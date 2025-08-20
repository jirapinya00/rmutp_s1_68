import { Hono } from "hono";
import { serve } from "@hono/node-server";  
import { PrismaClient } from "@prisma/client";
const app = new Hono();

app.get("/", (c) => c.text("Hello World"));


app.get("/about", (c) => {
    return c.json({
      massage: "About Page",
    });
});

export default app;