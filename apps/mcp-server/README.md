# Daysktop MCP Server

An MCP (Model Context Protocol) server that exposes Daysktop's daily journal entries to MCP clients (Claude Desktop, Claude Code, etc.) over stdio.

It calls a dedicated AI-facing API on the backend (`apps/backend/src/ai`) — the backend must be running first.

## Tools

- `get_entry_by_date(date)` — the journal entry for a single `YYYY-MM-DD` day, or `null` if none exists.
- `get_entries(from, to)` — entries in a date range (both required). Capped at 30 results.
- `search_entries(mood?, activities?, keyword?, from?, to?)` — entries matching a mood, any of a list of activities (OR), and/or a keyword in the note; filters combine (AND); `from`/`to` are optional. Capped at 30 results.

All dates are strict `YYYY-MM-DD`. Entries are returned in a cleaned shape (`date`, `note`, `mood`, `activities`, `isFavorite`) — no internal ids.

## Running

```bash
cd apps/backend && npm run start:dev
```

```bash
cd apps/mcp-server && npm install && npm start
```

By default the server calls `http://localhost:3000/api`. Override with the `DAYSKTOP_API_URL` environment variable if the backend runs elsewhere.

## Using with Claude Desktop / Claude Code

First build it (needed once, and again after any change to `src/`):

```bash
cd apps/mcp-server && npm run build
```

Then point your MCP client at the built `dist/main.js` with `node` directly and an **absolute path** — avoid `npx`/`.cmd` shims and the `cwd` field, they're unreliable across MCP hosts (especially on Windows: no shell means no `.cmd` resolution, and `cwd` isn't honored by every host). This repo's [`.mcp.json`](../../.mcp.json) already does this:

```json
{
  "mcpServers": {
    "daysktop": {
      "command": "node",
      "args": ["/absolute/path/to/Daily Desktop/apps/mcp-server/dist/main.js"]
    }
  }
}
```

Make sure the backend is running before starting the MCP client.
