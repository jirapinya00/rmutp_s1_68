import { serve } from "@hono/node-server";
import app from "./index";  


const port = Number(process.env.PORT ?? 3000)

serve(app, (info) => {
  console.log("Running server on port", info.port);
});



