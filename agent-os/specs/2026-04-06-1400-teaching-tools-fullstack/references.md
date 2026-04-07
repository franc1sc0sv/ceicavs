# References for Teaching Tools Fullstack

## Similar Implementations

### Blog Module (Backend)

- **Location:** `apps/api/src/modules/blog/`
- **Relevance:** Identical CQRS + vertical slice architecture; ToggleFavorite mirrors ToggleReaction pattern
- **Key patterns:** Abstract repos with `RepositoryMethod`, Prisma implementations with soft delete, thin resolver dispatching to buses, CASL checks in every handler

### Auth Module (Backend)

- **Location:** `apps/api/src/modules/auth/`
- **Relevance:** JWT guard pattern, `@CurrentUser()` decorator usage, module wiring
- **Key patterns:** `JwtAuthGuard`, `IJwtUser` interface, `CommandBus`/`QueryBus` injection in resolver

### Product-Plan UI Components

- **Location:** `product-plan/sections/teaching-tools/components/`
- **Relevance:** Authoritative grid design — TeachingTools.tsx, ToolCard.tsx, FavoritePill
- **Key patterns:** ICON_MAP, COLOR_MAP, search filtering, favorites row, category sections, responsive grid
- **Note:** Adapt to use shadcn/ui components and `useTranslation()` — do not copy verbatim

### Sample Data

- **Location:** `product-plan/sections/teaching-tools/sample-data.json`
- **Relevance:** Canonical tool IDs, names, descriptions, icons, colors, category assignments
- **Key patterns:** Use exact IDs for seed script and tool registry mapping

### Test Specs

- **Location:** `product-plan/sections/teaching-tools/tests.md`
- **Relevance:** Complete test specifications for grid, favorites, search, navigation, edge cases, accessibility
