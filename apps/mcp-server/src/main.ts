import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getEntries, getEntryByDate, searchEntries } from './backend-client.js';

const MAX_RESULTS_NOTE = 'Returns at most 30 entries; if more match, the oldest ones are silently omitted.';
const DATE_DESCRIPTION = 'Date in YYYY-MM-DD format';

const server = new McpServer({
  name: 'daysktop-mcp-server',
  version: '0.0.1',
});

server.registerTool(
  'get_entry_by_date',
  {
    title: 'Get the journal entry for a day',
    description: 'Get the daily journal entry for a single day, or null if nothing was journaled that day.',
    inputSchema: {
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, DATE_DESCRIPTION).describe(DATE_DESCRIPTION),
    },
  },
  async ({ date }) => {
    const entry = await getEntryByDate(date);
    return { content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }] };
  },
);

server.registerTool(
  'get_entries',
  {
    title: 'Get journal entries in a date range',
    description: `List daily journal entries between two dates (inclusive). ${MAX_RESULTS_NOTE}`,
    inputSchema: {
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, DATE_DESCRIPTION).describe(`Start date (inclusive). ${DATE_DESCRIPTION}`),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, DATE_DESCRIPTION).describe(`End date (inclusive). ${DATE_DESCRIPTION}`),
    },
  },
  async ({ from, to }) => {
    const entries = await getEntries(from, to);
    return { content: [{ type: 'text', text: JSON.stringify(entries, null, 2) }] };
  },
);

server.registerTool(
  'search_entries',
  {
    title: 'Search journal entries',
    description: `Search daily journal entries by mood, activities, and/or a keyword in the note. All filters are optional and combine together (AND); multiple activities match if the entry has any of them (OR). ${MAX_RESULTS_NOTE}`,
    inputSchema: {
      mood: z.string().optional().describe('Mood name, case-insensitive substring match (e.g. "happy")'),
      activities: z
        .array(z.string())
        .optional()
        .describe('Activity names; an entry matches if it has any of them (OR)'),
      keyword: z.string().optional().describe('Keyword to search for in the entry note, case-insensitive'),
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, DATE_DESCRIPTION).optional().describe(`Start date (inclusive). ${DATE_DESCRIPTION}`),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, DATE_DESCRIPTION).optional().describe(`End date (inclusive). ${DATE_DESCRIPTION}`),
    },
  },
  async (params) => {
    const entries = await searchEntries(params);
    return { content: [{ type: 'text', text: JSON.stringify(entries, null, 2) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
