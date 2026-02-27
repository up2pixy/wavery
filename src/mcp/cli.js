#!/usr/bin/env node
"use strict";
const stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
const mcp = require("./dist/mcp.js");
async function main() {
    const server = (0, mcp.getMcpServer)();
    const transport = new stdio.StdioServerTransport();
    await server.connect(transport);
    console.error("Wavery MCP server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});