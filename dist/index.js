"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const client_1 = require("@prisma/client");
const service_1 = require("./service");
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
app.get("/profile/:id", async (c) => {
    const id = c.req.param("id");
    console.log("profile id ", id);
    return c.json({
        data: id
    });
});
app.post("/profile", async (c) => {
    const body = await c.req.json();
    // 1) hash password
    // 2) encrypt cardId & mobile (เก็บ ciphertext ลง DB)
    const encCardId = (0, service_1.encode)(String(body.cardId));
    const encMobile = (0, service_1.encode)(String(body.mobile));
    const encPassword = (0, service_1.encode)(String(body.password));
    // 3) บันทึก DB
    const created = await prisma.profile.create({
        data: {
            username: String(body.username),
            password: encPassword, // hash
            cardId: encCardId, // ciphertext
            mobile: encMobile, // ciphertext
            status: false,
        },
    });
    // 4) ตอบกลับเป็น JSON (ถอดรหัสให้ดู)
    return c.json({
        message: "create profile completed",
        data: {
            id: created.id,
            username: created.username,
            // ไม่ส่ง hash/ciphertext ออก — โชว์ค่าปกติแทน
            password: encPassword,
            cardId: (0, service_1.decode)(encCardId),
            mobile: (0, service_1.decode)(encMobile),
        },
    }, 201);
});
app.onError((err, c) => {
    console.error("Unexpected error:", err);
    return c.text("Service Unavailable", 503);
});
exports.default = app;
