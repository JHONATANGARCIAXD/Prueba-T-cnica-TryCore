import app from "./app.js"
import { db } from "./db.config.js"

db.query('SELECT NOW()')
    .then(() => { console.log("Database Conected") })
    .catch(() => { console.error("Database conection error") })

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})