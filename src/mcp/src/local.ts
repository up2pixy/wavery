import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getMcpServer } from './mcp.js';

async function main() {
  const server = getMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Wavery MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});