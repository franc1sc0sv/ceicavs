# References for Wave 0 + Wave 1 Shell

## Existing Infrastructure

### CQRS Base Handlers
- **Location:** `apps/api/src/common/cqrs/`
- **Relevance:** All command/query handlers must extend `BaseCommandHandler` / `BaseQueryHandler`
- **Key patterns:** `tx: TxClient` required in every repository call, `IDatabaseService.$transaction()` wraps all work

### Database Service Abstraction
- **Location:** `apps/api/src/common/database/`
- **Relevance:** `IDatabaseService` is the only DB token — never import PrismaClient directly in handlers
- **Key patterns:** Only exposes `$transaction()`, no raw client access

### JWT Auth Guard
- **Location:** `apps/api/src/common/guards/jwt-auth.guard.ts`
- **Relevance:** Apply to all protected resolvers with `@UseGuards(JwtAuthGuard)`

### CASL Ability Matrix
- **Location:** `packages/shared/src/casl.ts`
- **Relevance:** `defineAbilityFor(role)` is the single source of truth — call inside every handler that checks permissions

### AbilityProvider + Can Component
- **Location:** `apps/web/src/context/ability.context.tsx`
- **Relevance:** Use `<Can I="read" a="Post">` to gate UI elements; use `useAbility()` for imperative checks
