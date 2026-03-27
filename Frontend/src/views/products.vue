<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">

        <div class="header-section q-mb-lg">
            <div class="row items-center justify-between">
                <div class="flex items-center q-gutter-md">
                    <div class="icon-wrapper">
                        <q-icon name="inventory_2" size="32px" color="white" />
                    </div>
                    <div>
                        <div class="text-h4 text-weight-bold text-grey-9">Productos</div>
                        <div class="text-subtitle2 text-grey-6">Administra tu inventario</div>
                    </div>
                </div>
                <Button label="Agregar" icon="add"
                    @click="op = 0, modalProducto = true, cleanInfo(), generateReference()" color="primary" size="md"
                    to="/app/productos/new" />
            </div>
        </div>

        <div class="row q-gutter-md q-mb-md">
            <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                <q-input label="Buscar por nombre o referencia" debounce="500" v-model="filters.search"
                    @update:model-value="getproductos" label-color="primary" dense clearable outlined />
            </div>
            <div class="col-1 col-xs-11 col-sm-3 col-md-2">
                <q-select v-model="filters.status" label="Estado" :options="status" emit-value map-options
                    @update:model-value="getproductos" label-color="primary" dense outlined />
            </div>
        </div>

        <q-card flat bordered class="table-card">

            <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                :loandingTable="loandingTable">

                <template v-slot:body-cell-stock="props">
                    <td class="text-center">
                        <Qchip :color="rangeStock(props.row.stock).color" text-color="white"
                            :label="rangeStock(props.row.stock).label + ' (' + props.row.stock + ')'" size="ld" />
                    </td>
                </template>

                <template #status="props">
                    <td class="text-center">
                        <Qchip :color="props.row.status == 0 ? 'green' : 'red'" text-color="white"
                            :label="props.row.status == 0 ? 'Activo' : 'Inactivo'" size="ld" />
                    </td>
                </template>

                <template #options="props">
                    <td class="text-center">
                        <buttonsTable icon="visibility" color="primary" size="24px" @click="openPreview(props.row)"
                            tooltip="Vista Previa" />
                        <buttonsTable icon="edit" color="grey-7" size="24px"
                            @click="$router.push(`/app/productos/edit/${props.row.id}`)"
                            :disable="props.row.status == 1" tooltip="Editar" />
                        <buttonsTable :icon="props.row.status == 0 ? 'block' : 'check_circle'"
                            :color="props.row.status == 0 ? 'red' : 'green'" size="24px"
                            @click="updateStatus(props.row)"
                            :tooltip="props.row.status == 0 ? 'Inactivar' : 'Activar'" />
                    </td>
                </template>
            </Table>
        </q-card>
    </q-page>

    <q-dialog v-model="spinner" persistent>
        <q-card>
            <q-card-section>
                <div>
                    <q-spinner-ios color="primary" size="3em" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getData, postData, putData } from '../services/apiclient.js';
import { formatters } from '../composables/useFormats.js';
import { useNotifications } from '../composables/useNotifications.js';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';
import Table from '../components/Table.vue';
import Button from '../components/button.vue';

const { error, success } = useNotifications();

const modalPreview = ref(false);
const selectedProduct = ref(null);

// Reactive variables
let spinner = ref(false);
let loandingTable = ref(true)


const filters = ref({
    search: '',
    status: ''
})

const slide = ref(1)

const columns = ref([
    { name: 'referenceCode', align: 'center', label: 'Referencia', field: 'code_reference' },
    { name: 'name', align: 'center', label: 'Nombre', field: 'name' },
    { name: 'price', align: "center", label: 'Precio', field: 'price', format: val => formatters.price(val) },
    { name: 'stock', align: "center", label: 'Stock', field: 'stock' },
    { name: 'Ultima Actualización', align: "center", label: 'Última Actualización', field: 'updated_at', format: val => formatters.date(val) },
    { name: 'status', align: "center", label: 'Estado' },
    { name: 'options', align: "center", label: "Opciones" }
]);

const rangeStock = (stock) => {
    if (stock > 100) return { label: 'Muy Alto', color: 'blue' };
    if (stock > 50) return { label: 'Alto', color: 'green' };
    if (stock > 10) return { label: 'Medio', color: 'orange' };
    if (stock > 0) return { label: 'Bajo', color: 'red' };
    return { label: 'Agotado', color: 'grey' };
}

const rows = ref([]);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
})

const getPagination = (props) => {
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: props.pagination.rowsNumber
    }

    getproductos()
}

const getproductos = async () => {
    loandingTable.value = true
    try {
        const res = await getData(`/products/getProducts`, {
            params: {
                page: pagination.value.page,
                limit: pagination.value.rowsPerPage,
                search: filters.value.search,
                status: filters.value.status
            }
        })

        pagination.value.rowsNumber = res.msg.totalRows

        console.log(res.msg.products);

        rows.value = res.msg.products;

    } catch (err) {
        error(err.response.data.errors[0].msg);
    }
    finally {
        loandingTable.value = false
    }

};

const updateStatus = async (props) => {
    try {
        let endpoint = props.status == 0 ? 'inactive' : 'active'

        console.log(props.id, endpoint);

        let res = await putData(`/products/${endpoint}Products/${props.id}`);

        getproductos();
        success(res.msg);

    } catch (err) {
        error(err.response.data.errors[0].msg);
    }
};

const openPreview = (product) => {
    selectedProduct.value = product;
    modalPreview.value = true;
};

</script>

<style scoped>
.header-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
    background: linear-gradient(135deg, #331955 0%, #764ba2 100%);
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-add {
    box-shadow: 0 4px 12px rgba(0, 47, 255, 0.3);
}

.table-card {
    border-radius: 12px;
    overflow: hidden;
}

.modern-container {
    background-color: white;
    border-radius: 20px;
}
</style>
