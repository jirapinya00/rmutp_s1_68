"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const index_1 = __importDefault(require("./index"));
const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
(0, node_server_1.serve)(index_1.default, (info) => {
    console.log("Running server on port", info.port);
});
