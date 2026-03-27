import express from "express"
import cors from "cors"
import { db } from "./db.config.js"
import { routerProducts } from "./routes/products.route.js"

const app = express()

app.use(express.json())

app.use(cors(
    {
        origin: true
    }
))

app.use("/api", routerProducts)

db.query('SELECT NOW()')
    .then(() => { console.log("Database Conected") })
    .catch(() => { console.error("Database conection error") })

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})