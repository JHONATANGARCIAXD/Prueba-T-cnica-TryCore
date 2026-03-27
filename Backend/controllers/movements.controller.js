import { db } from "../db.config.js";

const movementsCtrl = {};

movementsCtrl.getMovements = async (req, res) => {
    try {
        const { page = 1, limit = 10, dateFrom, dateTo, type } = req.query;
        let filter = []
        let params = []

        if (type) {
            filter.push(`m.type = $${params.length + 1}`);
            params.push(type);
        }
        
        if (dateFrom) {
            filter.push(`m.created_at >= $${params.length + 1}`);
            params.push(dateFrom);
        }

        if (dateTo) {
            filter.push(`m.created_at <= $${params.length + 1}`);
            params.push(dateTo);
        }

        let query = `FROM movement m JOIN product p ON m.product_id = p.id`;
        if (filter.length > 0) {
            query += ' WHERE ' + filter.join(` AND `)
        }

        const totalRows = await db.query(`SELECT (COUNT(*)::INT)  ${query}`, params)

        const offset = (page - 1) * limit
        query += ` ORDER BY m.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2} `
        params.push(Number(limit), Number(offset))

        const movements = await db.query(`SELECT m.id, m.product_id, p.name as product_name, m.quantity, m.type, m.created_at ${query}`, params)

        res.status(200).json({ msg: { movements: movements.rows, totalRows: totalRows.rows[0].count } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor, Intenta mas tarde." });
    }
};

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