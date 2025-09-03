"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const app = new hono_1.Hono();
const prisma = new client_1.PrismaClient();
app.get("/", (c) => c.text("Hello World"));
app.get("/about", (c) => {
    return c.json({ message: "Jirapinya" });
});
app.get("/profile", async (c) => {
    const profile = await prisma.profile.findMany();
    return c.json({
        message: "get data completed",
        data: profile
    }, 200);
});
app.post("/profile", async (c) => {
    const body = await c.req.json();
    const passwordHash = await bcrypt.hash(body.password, 10);
    const result = await prisma.profile.create({
        data: {
            username: body.username,
            password: passwordHash,
            cardId: body.cardId,
            mobile: body.mobile,
            status: false, // ใส่ชัด ๆ ตรงนี้
        },
    });
    return c.json({
        message: "create profile completed",
        data: result,
    });
});
exports.default = app;
