# CQRS Patterns

## 1. Transaction-First Execution

Both commands AND queries run inside `$transaction`.

```typescript
// BaseCommandHandler.execute()
const result = await this.db.$transaction((tx) =>
  this.handle(command, tx, events),
);

// BaseQueryHandler.execute()
return this.db.$transaction((tx) => this.handle(query, tx));
```

- **Why:** Uniform API — every handler gets a `tx`, no conditional logic about when to use one.
- Never call a repository method outside a transaction.

## 2. Event Collection After Commit

Domain events are collected during `handle()`, emitted AFTER the transaction commits.

```typescript
protected abstract handle(
  command: TCommand,
  tx: TxClient,
  events: IDomainEvent[],
): Promise<TResult>

// In execute():
for (const event of events) {
  this.eventEmitter.emit(event.eventName, event)
}
```

- **Why:** (1) Rollback safety — failed tx emits nothing. (2) Ordering — events fire after data is committed and visible. (3) Events represent completed actions — listeners react to things that already happened.
- Push events inside `handle()`, never call `eventEmitter.emit()` directly in a handler.

## 3. Repository TxClient Contract

`tx: TxClient` is always **required** in repository methods — never optional, no fallbacks.

```typescript
// Abstract repository interface
export abstract class IPostRepository {
  abstract findById: RepositoryMethod<[id: string], Post | null>
  abstract create: RepositoryMethod<[data: ICreatePostData], Post>
}
```

- **Why:** `RepositoryMethod` type makes `tx` structurally required at compile time. Prevents accidental bypass of transaction boundaries.
- All repository interfaces implement `IBaseRepository<TEntity>`.

## 4. CASL Authorization Inside Handlers

Every handler checks CASL inside `handle()`. No exceptions.

```typescript
protected async handle(command: CreatePostCommand, tx: TxClient, events: IDomainEvent[]) {
  const ability = defineAbilityFor(command.user.role)
  if (!ability.can('create', 'Post')) {
    throw new ForbiddenException()
  }
  // ... business logic
}
```

- **Why:** Guards handle authentication (is user logged in?). Handlers handle authorization (can this user do THIS action on THIS resource?).
- Never rely solely on guards for authorization.

## 5. Thin Resolvers

Resolvers dispatch to `CommandBus`/`QueryBus`. Zero business logic.

```typescript
@Mutation(() => PostType)
async createPost(
  @Args('input') input: CreatePostInput,
  @CurrentUser() user: AuthUser,
) {
  return this.commandBus.execute(new CreatePostCommand(input, user))
}
```

- **Why:** Logic in handlers is testable without GraphQL context, follows vertical slice isolation.
- If a resolver grows beyond dispatch + return, logic belongs in a handler.
