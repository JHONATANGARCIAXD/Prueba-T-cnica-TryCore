import { createRouter, createWebHashHistory } from "vue-router"
import Layout from "../layouts/layout.vue"
import Login from "../views/login.vue"
import Home from "../views/home.vue"
import Products from "../views/products.vue"

const routes = [
    { path: "/", component: Login },
    {
        path: "/app", component: Layout, children: [
            { path: "home", component: Home },
            { path: 'products', component: Products }
        ]
    }

]

//  router.beforeEach(async (to, from, next) => {  

//     next()
//  })


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})