"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const index_1 = require("./index");
const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
(0, node_server_1.serve)(index_1.default, (info) => {
    console.log("Running server on port", info.port);
});
