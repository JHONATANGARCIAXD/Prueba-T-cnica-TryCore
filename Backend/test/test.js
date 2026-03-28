import supertest from "supertest";
import app from "../app.js";

describe("GET /products", () => {
    it("retornaria los productos", async () => {
        const res = await supertest(app).get("/api/products");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("msg");
    }
    );
});
