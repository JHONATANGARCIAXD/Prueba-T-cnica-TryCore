import { db } from "../db.config.js";

const productsCtrl = {};

productsCtrl.getProducts = async (req, res) => {
    try {
        const { search, stock,  page = 1, limit = 10 } = req.query;
        let filter = []
        let params = []

        if (search) {
            filter.push(`(p.name::text ILIKE $${params.length + 1} OR p.id::text ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
        }

        if(stock){
            filter.push(`CASE WHEN p.current_stock <= p.min_stock THEN 'ALERT' ELSE 'OK' END = $${params.length + 1}`)
            params.push(stock)
        }

        let query = `FROM product p`;
        if (filter.length > 0) {
            query += ' WHERE ' + filter.join(` AND `)
        }

        const totalRows = await db.query(`SELECT (COUNT(DISTINCT p.id)::INT)  ${query}`, params)

        const offset = (page - 1) * limit
        query += ` ORDER BY p.id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2} `
        params.push(Number(limit), Number(offset))


        const products = await db.query(`SELECT p.* , 
            CASE WHEN p.current_stock <= p.min_stock 
            THEN 'ALERT'
            ELSE 'OK' 
            END as status 
            
            ${query}`, params)

        res.status(200).json({ msg: { products: products.rows, totalRows: totalRows.rows[0].count } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor, Intenta mas tarde." });
    }
}

productsCtrl.saveProducts = async (req, res) => {
    try {
        const { name, price, current_stock, min_stock } = req.body;
        await db.query(
            "INSERT INTO product (name, price, current_stock, min_stock) VALUES ($1, $2, $3, $4)",
            [name, price, current_stock, min_stock]
        );

        res.status(201).json({ msg: "Producto creado exitosamente." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Ha ocurrido un error en el servidor, Intenta mas tarde." });
    }
};

export { productsCtrl }
