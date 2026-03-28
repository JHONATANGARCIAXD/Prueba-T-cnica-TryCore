import express from "express"
import cors from "cors"
import { routerProducts } from "./routes/products.route.js"
import { routerMovements } from "./routes/movements.route.js"
import e from "express"

const app = express()

app.use(express.json())

app.use(cors(
    {
        origin: true
    }
))

app.use("/api", routerProducts)
app.use("/api", routerMovements)


export default app
