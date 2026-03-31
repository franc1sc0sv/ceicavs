# Error Handling

Custom exceptions extend `GraphQLError` via `AppException` base class.

## Hierarchy

```
GraphQLError (graphql)
  └── AppException (common/errors/)
        ├── NotFoundException
        └── ForbiddenException
```

## Classes (in `common/errors/`)

```typescript
export class AppException extends GraphQLError {
  constructor(message: string, code: string) {
    super(message, { extensions: { code } })
  }
}

export class NotFoundException extends AppException {
  constructor(entity: string) {
    super(`${entity} not found`, 'NOT_FOUND')
  }
}

export class ForbiddenException extends AppException {
  constructor() {
    super('Forbidden', 'FORBIDDEN')
  }
}
```

## Rules

- Always throw domain exceptions from `common/errors/`, not NestJS built-in exceptions
- `NotFoundException` takes the entity name: `throw new NotFoundException('Post')`
- `ForbiddenException` is parameterless — used after CASL check failure
- Add new exception subclasses as needed (e.g., `ConflictException`, `ValidationException`)
- Exceptions thrown inside `$transaction` will roll back the transaction automatically
