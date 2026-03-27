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
                <Button label="Agregar" icon="add" @click="modalProduct = true, cleanInfo()" color="primary"
                    size="md" />
            </div>
        </div>

        <div class="row q-gutter-md q-mb-md">
            <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                <q-input label="Buscar por nombre o referencia" debounce="500" v-model="filters.search"
                    @update:model-value="getproducts" label-color="primary" dense clearable outlined />
            </div>
            <div class="col-1 col-xs-11 col-sm-3 col-md-2">
                <q-select v-model="filters.stock" label="Estado" :options="status" emit-value map-options
                    @update:model-value="getproducts" label-color="primary" dense outlined />
            </div>
        </div>

        <q-card flat bordered class="table-card">

            <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                :loandingTable="loandingTable">

                <template v-slot:body-cell-stock="props">
                    <td class="text-center">
                        <Qchip :color="rangeStock(props.row.status).color" text-color="white"
                            :label="rangeStock(props.row.status).label + ' (' + props.row.current_stock + ')'"
                            size="ld" />
                    </td>
                </template>
            </Table>
        </q-card>
    </q-page>

    <!-- MODAL CREAR PRODUCTO -->
    <Modal v-model="modalProduct" :form-ref="true" @submit="saveProduct" :persistent="true" width="600px">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="text-h6 q-px-md q-py-md">Crear Producto</div>

                <Button icon="close" flat round dense v-close-popup text-color="white" :outline="false"
                    :rounded="false" />
            </div>
        </template>

        <template #body>
            <div class="q-gutter-md">
                <q-input v-model="formProduct.name" label="Nombre del Producto" outlined counter maxlength="50"
                    :rules="[val => !!val || 'Nombre es requerido']">
                    <template v-slot:prepend>
                        <q-icon name="shopping_bag" color="primary" />
                    </template>
                </q-input>

                <q-input v-model="formProduct.price" label="Precio" outlined class="col"
                    :rules="[val => !!val || 'Precio es requerido', val => val > 0 || 'Precio debe ser mayor a 0']">
                    <template v-slot:prepend>
                        <q-icon name="attach_money" color="positive" />
                    </template>
                </q-input>

                <q-input v-model="formProduct.currentStock" label="Stock Actual" outlined class="col"
                    :rules="[val => !!val || 'Stock es requerido', val => val >= 0 || 'Stock no puede ser negativo']">
                    <template v-slot:prepend>
                        <q-icon name="inventory" color="info" />
                    </template>
                </q-input>

                <q-input v-model="formProduct.minStock" label="Stock Mínimo (Alerta)" outlined
                    :rules="[val => !!val || 'Stock mínimo es requerido', val => val >= 0 || 'Stock mínimo no puede ser negativo']">
                    <template v-slot:prepend>
                        <q-icon name="warning" color="warning" />
                    </template>
                </q-input>
            </div>
        </template>

        <template #footer>
            <div class="row justify-end q-gutter-md q-pa-md">
                <Button label="Cancelar" v-close-popup color="negative" outline="false" />
                <Button label="Guardar" :loading="spinnerBtn" type="submit"  outline="false" color="primary" />
            </div>
        </template>
    </Modal>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getData, postData } from '../services/apiclient.js';
import { formatters } from '../composables/useFormats.js';
import { useNotifications } from '../composables/useNotifications.js';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';
import Table from '../components/Table.vue';
import Button from '../components/button.vue';
import Modal from '../components/Modal.vue';

const { error, success } = useNotifications();

// Modal variables
const modalProduct = ref(false);


const formProduct = ref({
    name: '',
    price: '',
    currentStock: '',
    minStock: ''
});

let spinnerBtn = ref(false);
let loandingTable = ref(true)


const filters = ref({
    search: '',
    stock: '',
})

const status = ref([
    { label: 'Todos', value: '' },
    { label: 'Ver Agotados', value: "ALERT" },
    { label: 'Ver Con Stock', value: "OK" }
])

const columns = ref([
    { name: 'id', align: 'center', label: 'Id', field: 'id' },
    { name: 'name', align: 'center', label: 'Nombre', field: 'name' },
    { name: 'price', align: "center", label: 'Precio', field: 'price', format: val => formatters.price(val) },
    { name: 'stock', align: "center", label: 'Stock', field: 'current_stock' },
    { name: 'stockmin', align: "center", label: 'Alerta Stock', field: 'min_stock' },
]);

const rangeStock = (stock) => {
    if (stock == "OK") return { label: 'OK', color: 'green' };
    if (stock == "ALERT") return { label: 'Alert', color: 'red' };
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

    getproducts()
}

const getproducts = async () => {
    loandingTable.value = true
    try {
        const res = await getData(`/products`, {
            params: {
                page: pagination.value.page,
                limit: pagination.value.rowsPerPage,
                search: filters.value.search,
                stock: filters.value.stock
            }
        })

        pagination.value.rowsNumber = res.msg.totalRows

        console.log(res.msg.products);

        rows.value = res.msg.products;

    } catch (err) {
        console.log(err);
        error(err.response.data.errors[0].msg);
    }
    finally {
        loandingTable.value = false
    }

};

const cleanInfo = () => {
    formProduct.value = {
        name: '',
        price: '',
        currentStock: '',
        minStock: ''
    }
}

const saveProduct = async () => {
    spinnerBtn.value = true;
    try {
        const res = await postData('/products', {
            name: formProduct.value.name,
            price: parseInt(formProduct.value.price),
            current_stock: parseInt(formProduct.value.currentStock),
            min_stock: parseInt(formProduct.value.minStock),
        });
        success(res.msg);
        modalProduct.value = false;
        cleanInfo();
        getproducts();
    } catch (err) {
        console.log(err);
        error(err.response.data?.errors?.[0] || err.response.data.msg || 'Error al crear el producto');
    } finally {
        spinnerBtn.value = false;
    }
}

onMounted(() => {
    getproducts()
})

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
