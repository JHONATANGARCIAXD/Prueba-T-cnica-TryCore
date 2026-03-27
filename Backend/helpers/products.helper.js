import { db } from "../db.config.js";

const productsHelper = {};

productsHelper.valideProduct = async (movements) => {
    const valide = await db.query(`SELECT 
        pr.id IS NULL AS not_exist,
        pr.name,
        m.type,
        pr.current_stock >= m.quantity AS has_stock
        FROM jsonb_to_recordset($1::jsonb) AS m(
            product_id INT,
            quantity INT,
            type TEXT
        )
            
        LEFT JOIN product pr ON pr.id = m.product_id`, [JSON.stringify(movements)])

    console.log(valide.rows)

    if (valide.rows.some(row => row.not_exist)) {
        throw new Error(`Hay 1 producto que no existe`);
    }

    const productsWithoutStock = valide.rows.filter(row => row.has_stock == false && row.type.toUpperCase() == 'OUTPUT');

    if (productsWithoutStock.length > 0) {
        throw new Error(`El producto ${productsWithoutStock[0].name} no tiene stock suficiente`);
    }
}


export { productsHelper };