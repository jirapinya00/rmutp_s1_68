"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
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
    const passwordHash = await bcrypt.hash(String(body.password), 10);
    // 2) encrypt cardId & mobile (เก็บ ciphertext ลง DB)
    const encCardId = (0, service_1.encode)(String(body.cardId));
    const encMobile = (0, service_1.encode)(String(body.mobile));
    // 3) บันทึก DB
    const created = await prisma.profile.create({
        data: {
            username: String(body.username),
            password: passwordHash, // hash
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
            password: body.password,
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
