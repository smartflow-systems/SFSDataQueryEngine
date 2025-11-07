# Security Model for SFSDataQueryEngine

## Purpose

SFSDataQueryEngine is a **Natural Language to SQL Translation Tool**. By design, it accepts SQL queries from users and executes them against connected databases. This document explains our security model and mitigations against SQL injection.

## Accepted Risk

**User-provided SQL execution is intentional** - This application's core functionality is to:
1. Accept natural language queries from users
2. Translate them to SQL using AI
3. Execute the resulting SQL against user databases

Standard SQL injection prevention (rejecting all user SQL) would break the application's purpose.

## Multi-Layer Security Model

We employ **defense in depth** with 5 security layers:

### Layer 1: AI-Based Validation
- All SQL is validated by GPT-4 before execution
- Checks for malicious patterns and dangerous operations
- Located in: `server/services/openai.ts::validateAndOptimizeSQL()`

### Layer 2: Pattern-Based Structure Validation
- Whitelist of allowed SQL statement types (SELECT, INSERT, UPDATE, DELETE only)
- Blocks dangerous keywords: CREATE, DROP, ALTER, PRAGMA, ATTACH, LOAD_EXTENSION, etc.
- Blocks SQL injection patterns: comments (--/*#), stacked queries (;), hex encoding
- Limits UNION usage to prevent blind SQL injection
- Located in: `server/services/database.ts::isSafeSqlStatement()`

### Layer 3: Parameterized Query Enforcement
- SQL structure and data values are strictly separated
- User data MUST be passed via params array, not embedded in SQL string
- Validates placeholder count matches params array length
- Detects and blocks string literals in SQL (direct interpolation)
- Located in: `server/routes.ts::executeHandler()`

### Layer 4: Safe Execution
- All parameters sanitized to prevent object injection
- SQLite driver safely binds parameters (prepared statements)
- No string concatenation of user data into SQL
- Located in: `server/services/database.ts::executeQuery()`

### Layer 5: Rate Limiting
- Query execution is rate-limited to prevent abuse
- Configurable via environment variables
- Located in: `server/index.ts`

## Security Guarantees

With all layers active:
- ✅ SQL **structure** is validated against whitelisted patterns
- ✅ SQL **data values** are safely bound via parameterized queries
- ✅ **Dangerous operations** are blocked (DDL, PRAGMA, file operations)
- ✅ **Injection vectors** are blocked (comments, stacked queries, encoding tricks)
- ✅ **Rate limiting** prevents automated attacks

## CodeQL Suppression Justification

CodeQL alerts `js/sql-injection` for this codebase are **expected** and **mitigated**:

1. **Alert Location**: `server/routes.ts:176` and `server/services/database.ts:114,134`
2. **Why Flagged**: User input flows to SQL execution
3. **Why Safe**: 5-layer security model prevents actual injection
4. **Suppression Method**: Inline CodeQL comments with justification

## Threat Model

### Protected Against:
- ✅ Classic SQL injection (quotes, stacked queries, comments)
- ✅ Blind SQL injection (UNION-based, time-based with WAITFOR/SLEEP)
- ✅ Second-order injection (object injection prevention)
- ✅ Database enumeration attacks (schema exposure limited)
- ✅ Privilege escalation (no DDL, no GRANT/REVOKE)

### Out of Scope:
- ❌ DDoS (handled by infrastructure/rate limiting)
- ❌ Database-level vulnerabilities (user's responsibility)
- ❌ Legitimate expensive queries (user's database, their risk)

## Audit Trail

All SQL queries are logged with:
- Original natural language input
- Generated SQL
- Execution results
- Timestamp and user context

Located in: Database via `storage.createQuery()`

## Security Contact

For security concerns, please report via GitHub Security Advisories or contact the repository maintainers.

## References

- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
- Parameterized Queries: https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html
- SQLite Security: https://www.sqlite.org/security.html
