import { db } from "../db.config.js";

const movementsCtrl = {};

movementsCtrl.saveMovements = async (req, res) => {
    try {
        const { movements } = req.body;

        await db.query("BEGIN");

        await db.query(`INSERT INTO movement (product_id, quantity, type) SELECT product_id, quantity, type 
            FROM jsonb_to_recordset($1::jsonb) 
            AS m(
                product_id INT, 
                quantity INT, 
                type TEXT
            )`,
            [JSON.stringify(movements)]
        );

        await db.query(`UPDATE product p SET current_stock = current_stock + m.quantity * CASE WHEN m.type = 'input' THEN 1 ELSE -1 END
            FROM jsonb_to_recordset($1::jsonb) AS m(
                product_id INT,
                quantity INT,
                type TEXT
            )
            WHERE p.id = m.product_id`,
            [JSON.stringify(movements)]
        );

        await db.query("COMMIT");
        res.status(201).json({ msg: "Movimiento registrado exitosamente." });
    }
    catch (error) {
        await db.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor, Intenta mas tarde." });
    }
};


export { movementsCtrl };