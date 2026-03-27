import { createRouter, createWebHashHistory } from "vue-router"
import Layout from "../layouts/layout.vue"
import Login from "../views/login.vue"
import Products from "../views/products.vue"
import Movements from "../views/movements.vue"

const routes = [
    { path: "/", component: Login },
    {
        path: "/app", component: Layout, children: [
            { path: 'products', component: Products },
            { path: 'movements', component: Movements }
        ]
    }

]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})