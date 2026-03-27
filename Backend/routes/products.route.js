import { productsCtrl } from "../controllers/products.controller.js";
import { valideFields } from "../middleware/valideFields.middleware.js";
import { check } from "express-validator";
import { Router } from "express";

const routerProducts = Router();

routerProducts.get("/products", productsCtrl.getProducts);

routerProducts.post("/products", [
    check("name", "El nombre del producto es requerido").notEmpty(),
    check("price", "El precio del producto es requerido").notEmpty().isInt({ gt: 0 }).withMessage("El precio del producto debe ser un número entero mayor a 0"),
    check("current_stock", "El stock actual del producto es requerido").notEmpty().isInt({ gt: -1 }).withMessage("El stock actual del producto debe ser un número entero mayor o igual a 0"),
    check("min_stock", "El stock mínimo del producto es requerido").notEmpty().isInt({ gt: -1 }).withMessage("El stock mínimo del producto debe ser un número entero mayor o igual a 0"),
    valideFields
], productsCtrl.saveProducts);


export { routerProducts }