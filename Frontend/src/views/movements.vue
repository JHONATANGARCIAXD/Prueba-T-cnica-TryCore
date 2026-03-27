<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">

        <div class="header-section q-mb-lg">
            <div class="row items-center justify-between">
                <div class="flex items-center q-gutter-md">
                    <div class="icon-wrapper">
                        <q-icon name="swap_horiz" size="32px" color="white" />
                    </div>
                    <div>
                        <div class="text-h4 text-weight-bold text-grey-9">Movimientos</div>
                        <div class="text-subtitle2 text-grey-6">Registra entradas y salidas de stock</div>
                    </div>
                </div>
                <Button label="Agregar" icon="add" @click="modalMovement = true; movementsArray = []; cleanInfo()" color="primary"
                    size="md" />
            </div>
        </div>

        <div class="row q-gutter-md q-mb-md">
            <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                <q-select label="Tipo de Movimiento" v-model="filters.type" :options="typeOptions" map-options
                    emit-value @update:model-value="getMovements" :option-label="val => val.label"
                    :option-value="val => val.value" label-color="primary" dense outlined />
            </div>
            <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                <q-input label="Desde" v-model="filters.dateFrom" type="date" @update:model-value="getMovements"
                    label-color="primary" dense outlined />
            </div>
            <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                <q-input label="Hasta" v-model="filters.dateTo" type="date" @update:model-value="getMovements"
                    label-color="primary" dense outlined />
            </div>
        </div>

        <q-card flat bordered class="table-card">
            <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                :loandingTable="loandingTable">

                <template v-slot:body-cell-type="props">
                    <td class="text-center">
                        <Qchip :color="getTypeColor(props.row.type)" text-color="white" :label="props.row.type == 'input' ? 'Entrada' : 'Salida'"
                            size="md" />
                    </td>
                </template>

                <template v-slot:body-cell-quantity="props">
                    <td class="text-center">
                        <span>{{ props.row.quantity }}</span>
                    </td>
                </template>

                <template v-slot:body-cell-created_at="props">
                    <td class="text-center">
                        <span class="text-caption">{{ formatters.date(props.row.created_at) }}</span>
                    </td>
                </template>
            </Table>
        </q-card>
    </q-page>

    <!-- MODAL CREAR MOVIMIENTO -->
    <Modal v-model="modalMovement" :form-ref="true" @submit="addMovement" :persistent="true" width="700px">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="text-h6 q-px-md q-py-md">Registrar Movimientos</div>
                <Button icon="close" flat round dense v-close-popup text-color="white" :outline="false"
                    :rounded="false" />
            </div>
        </template>

        <template #body>
            <div class="q-gutter-md">
                <div class="text-subtitle3 text-weight-bold q-mb-md" v-if="movementsArray.length > 0">
                    Movimientos a guardar: {{ movementsArray.length }}
                </div>

                <q-select v-model="formMovement.product_id" label="Producto" use-input input-debounce="900" clearable
                    behavior="menu" @filter="getProducts" :options="productOptions" :option-value="val => val.id"
                    map-options emit-value :option-label="val => val.name" outlined lazy-rules
                    :rules="[val => !!val || 'Producto es requerido']">
                    <template v-slot:prepend>
                        <q-icon name="shopping_bag" color="primary" />
                    </template>

                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section>
                                <q-item-label>Nombre: {{ scope.opt.name }}</q-item-label>
                                <q-item-label caption>ID: {{ scope.opt.id }} Stock: {{ scope.opt.current_stock
                                    }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <q-select v-model="formMovement.type" label="Tipo de Movimiento"
                    :options="[{ label: 'Entrada', value: 'input' }, { label: 'Salida', value: 'output' }]" outlined map-options emit-value :option-label="val => val.label" :option-value="val => val.value"
                    :rules="[val => !!val || 'Tipo es requerido']" lazy-rules> 
                    <template v-slot:prepend>
                        <q-icon name="arrow_forward" color="info" />
                    </template>
                </q-select>

                <q-input v-model="formMovement.quantity" label="Cantidad" outlined lazy-rules
                    :rules="[val => !!val || 'Cantidad es requerida', val => val > 0 || 'Cantidad debe ser mayor a 0']">
                    <template v-slot:prepend>
                        <q-icon name="inventory_2" color="warning" />
                    </template>
                </q-input>

                <!-- Lista de movimientos agregados -->
                <div v-if="movementsArray.length > 0" class="q-mt-lg">
                    <div class="text-subtitle3 text-weight-bold q-mb-md">Movimientos agregados:</div>
                    <q-card v-for="(mov, index) in movementsArray" :key="index" flat bordered class="q-mb-sm">
                        <q-card-section class="row items-center justify-between q-pa-md">
                            <div class="col-grow q-gutter-sm">
                                <div class="text-caption text-grey-7">Producto: <span class="text-weight-bold">{{ getProductName(mov.product_id) }}</span></div>
                                <div class="text-caption text-grey-7">
                                    Tipo: <q-chip :color="getTypeColor(mov.type)" text-color="white" size="sm" :label="mov.type === 'input' ? 'Entrada' : 'Salida'" />
                                    Cantidad: <span class="text-weight-bold">{{ mov.quantity }}</span>
                                </div>
                            </div>
                            <Button icon="delete" flat round dense color="negative" size="sm" @click="removeMovement(index)" tooltip="Eliminar" />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="row justify-end q-gutter-md q-pa-md">
                <Button label="Cancelar" v-cl color="negative" />
                <Button label="Agregar Movimiento" :loading="spinnerBtn" type="submit" color="info" />
                <Button v-if="movementsArray.length > 0" label="Guardar Todos" :loading="spinnerBtn" @click="saveAllMovements" color="positive" />
            </div>
        </template>
    </Modal>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getData, postData, deleteData } from '../services/apiclient.js';
import { formatters } from '../composables/useFormats.js';
import { useNotifications } from '../composables/useNotifications.js';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';
import Table from '../components/Table.vue';
import Button from '../components/button.vue';
import Modal from '../components/Modal.vue';

const { error, success } = useNotifications();

// Modal variables
const modalMovement = ref(false);
const movementsArray = ref([]);

const formMovement = ref({
    product_id: null,
    type: '',
    quantity: ''
});

let spinnerBtn = ref(false);
let loandingTable = ref(true);

const filters = ref({
    type: '',
    dateFrom: '',
    dateTo: ''
});

const typeOptions = ref([
    { label: 'Todos', value: '' },
    { label: 'Entrada', value: 'input' },
    { label: 'Salida', value: 'output' }
]);

const productOptions = ref([]);

const columns = ref([
    { name: 'id', align: 'center', label: 'ID', field: 'id' },
    { name: 'product_id', align: 'center', label: 'Producto', field: 'product_name' },
    { name: 'type', align: 'center', label: 'Tipo', field: 'type' },
    { name: 'quantity', align: 'center', label: 'Cantidad', field: 'quantity' },
    { name: 'created_at', align: 'center', label: 'Fecha', field: 'created_at' },
]);

const rows = ref([]);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
});

const getTypeColor = (type) => {
    if (type === 'input') return 'positive';
    if (type === 'output') return 'negative';
    return 'grey';
};

const getPagination = (props) => {
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: props.pagination.rowsNumber
    };
    getMovements();
};

const getMovements = async () => {
    loandingTable.value = true;
    try {
        const res = await getData(`/movements`, {
            params: {
                page: pagination.value.page,
                limit: pagination.value.rowsPerPage,
                type: filters.value.type,
                dateFrom: filters.value.dateFrom,
                dateTo: filters.value.dateTo
            }
        });


        pagination.value.rowsNumber = res.msg.totalRows || 0;
        rows.value = res.msg.movements || [];
    } catch (err) {
        console.log(err);
        error(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al cargar movimientos');
    } finally {
        loandingTable.value = false;
    }
};

const cleanInfo = () => {
    formMovement.value = {
        product_id: null,
        type: '',
        quantity: ''
    };
};

const addMovement = async () => {
    movementsArray.value.push({
        product_id: formMovement.value.product_id,
        type: formMovement.value.type,
        quantity: parseInt(formMovement.value.quantity)
    });
    
    success('Movimiento agregado a la lista');
    cleanInfo();
};


const getProductName = (id) => {
    const product = productOptions.value.find(p => p.id === id);
    return product ? product.name : 'Desconocido';
};

const removeMovement = (index) => {
    movementsArray.value.splice(index, 1);
    success('Movimiento eliminado');
};

const saveAllMovements = async () => {
    spinnerBtn.value = true;
    try {
        const res = await postData('/movements', {
            "movements": movementsArray.value
        });
        success(res.msg);
        cleanInfo();
        modalMovement.value = false;
        getMovements();
    } catch (err) {
        console.log(err);
        error(err.response?.data?.msg || err.response?.data?.errors[0] || 'Error al registrar movimientos');
    } finally {
        spinnerBtn.value = false;
        movementsArray.value = [];
    }
};

const getProducts = async (val, update) => {
    try {
        const res = await getData(`/products`, {
            params: {
                search: val
            }
        })
        update(() => {
            productOptions.value = res.msg.products
        })
    }
    catch (err) {
        console.error('Error al filtrar productos:', err);
    }
};


onMounted(() => {
    getMovements();
});

</script>

<style scoped>
.header-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.table-card {
    border-radius: 12px;
    overflow: hidden;
}
</style>
