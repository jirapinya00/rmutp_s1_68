"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const client_1 = require("@prisma/client");
const app = new hono_1.Hono();
const prisma = new client_1.PrismaClient();
app.get("/", (c) => c.text("Hello World"));
app.get("/about", (c) => {
    return c.json({ message: "Jirapinya" });
});
app.get("/profile", async (c) => {
    const profile = await prisma.profile.findMany();
    return c.json(profile);
});
exports.default = app;
