import { Router } from "express";
import { movementsCtrl } from "../controllers/movements.controller.js";
import { valideFields } from "../middleware/valideFields.middleware.js";
import { check } from "express-validator";
import { productsHelper } from "../helpers/products.helper.js";

const routerMovements = Router();

routerMovements.post("/movements", [
    check("movements", "El campo movements es requerido").notEmpty().bail().isArray().withMessage("El campo movements debe ser un array").bail().custom(productsHelper.valideProduct),
    check("movements.*.product_id", "El campo product_id es requerido").notEmpty(),
    check("movements.*.quantity", "El campo quantity es requerido").notEmpty().isInt({ gt: 0 }).withMessage("El campo quantity debe ser un número entero mayor a 0"),
    check("movements.*.type", "El campo type es requerido").notEmpty().isIn(["input", "output"]).withMessage("El campo type debe ser 'input' o 'output'"),
    valideFields
], movementsCtrl.saveMovements);    

export { routerMovements }