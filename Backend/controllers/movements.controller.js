import { db } from "../db.config.js";

const movementsCtrl = {};

movementsCtrl.saveMovements = async (req, res) => {
    const client = await db.connect();
    try {
        const { movements } = req.body;
        await client.query("BEGIN");

        const resul = await client.query(`WITH movements_data AS (
            SELECT * FROM jsonb_to_recordset($1::jsonb) AS m(
                product_id INT,
                quantity INT,
                type TEXT
            )
            ),
            validated_update AS (
            UPDATE product p
            SET current_stock = p.current_stock + 
                (m.quantity * CASE WHEN m.type = 'input' THEN 1 ELSE -1 END)
            FROM movements_data m
            WHERE p.id = m.product_id
                AND (
                m.type = 'input'
                OR (m.type = 'output' AND p.current_stock >= m.quantity)
                )
            RETURNING p.id
            )
            SELECT COUNT(*)::INT FROM validated_update;`,
            [JSON.stringify(movements)]
        );

        if (resul.rows[0].count != movements.length) {
            await client.query("ROLLBACK");
            return res.status(400).json({ msg: "No se pudo registrar el movimiento, Verifique el stock de los productos." });
        }

        await client.query(`INSERT INTO movement (product_id, quantity, type) SELECT product_id, quantity, type 
            FROM jsonb_to_recordset($1::jsonb) 
            AS m(
                product_id INT, 
                quantity INT, 
                type TEXT
            )`,
            [JSON.stringify(movements)]
        );

        console.log("FINALIZO EL MOVIMIENTO");
        await client.query("COMMIT");
        res.status(201).json({ msg: "Movimiento registrado exitosamente." });
    }
    catch (error) {
        await db.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor, Intenta mas tarde." });
    }
    finally {
        client.release();
    }
};


export { movementsCtrl };