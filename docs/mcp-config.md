# MCP Configuration

## Available Servers (from `.mcp.json`)

### Supabase (FC — primary)
- **Type**: HTTP MCP
- **URL**: `https://mcp.supabase.com/mcp?project_ref=ilntxxutxbygjuixrzng`
- **Project**: FC (`ilntxxutxbygjuixrzng`) — Ireland/eu-west-1
- **Access**: service_role (bypasses RLS, full schema access)

### Supabase-CC (Creator Club — read-only reference)
- **Type**: HTTP MCP
- **URL**: `https://mcp.supabase.com/mcp?project_ref=znqesarsluytxhuiwfkt`
- **Project**: CC (`znqesarsluytxhuiwfkt`) — Zurich/eu-central-2
- **Access**: service_role — use for **read-only** operations to extract remaining data
- **NEVER modify CC database** — keep it intact as source of truth for unmigrated data

### Stripe
- **Type**: HTTP MCP (OAuth)
- **URL**: `https://mcp.stripe.com/`
- **Account**: European Fashion Institute (`acct_1Sra05HH4asvT4B6`)
- **Auth**: OAuth — run `/mcp` to re-authenticate if disconnected
- **Tools**: create/list products, prices, customers, subscriptions, invoices, payment links, refunds

## Key Tools & Usage
| Server | Tool | Purpose |
|--------|------|---------|
| supabase | `list_tables` | View table structure |
| supabase | `execute_sql` | Run SQL queries (service_role access) |
| supabase | `apply_migration` | DDL schema changes |
| supabase | `list_edge_functions` | View deployed functions |
| supabase | `deploy_edge_function` | Deploy functions (⚠️ doesn't resolve `../_shared/` imports) |
| stripe | `list_products`, `list_prices` | View Stripe catalog |
| stripe | `list_customers`, `list_subscriptions` | Customer data |
| stripe | `search_stripe_documentation` | API reference |

## Configuration Notes
- MCP Supabase server runs with **service_role** permissions — can access auth schema and bypass RLS
- For edge function deployment with shared imports, use CLI: `npx supabase functions deploy <name>`
- Both FC and CC MCP servers are configured simultaneously — use `supabase` for FC, `supabase-cc` for CC
- CC anon key in `/Users/bojodanchev/creator-club™/.env.local` (for REST API fallback if needed)
- `apply_migration` handles BEGIN/COMMIT automatically — do NOT include transaction wrappers in SQL

## Agent Coordination

### Chatroom System
Agents communicate via `chatroom.md`. Template in `.claude/templates/chatroom-template.md`.

### Agent Definitions (`.claude/agents/`)
coordinator, explorer, architect, implementer, reviewer, debugger, tester

### Agent Mail (MCP-based)
Separate from role-based agents. Use for MCP coordination with `macro_start_session()`, `fetch_inbox()`, `send_message()`, etc. Project key: `/Users/bojodanchev/founders-club`.

### Commands
- `/coordinate [task]` - Start coordinated multi-agent work
- `/reset-chatroom` - Clear chatroom for new task
- `/learn` - Update knowledge base
