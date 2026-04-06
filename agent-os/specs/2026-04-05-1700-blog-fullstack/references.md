# References for Blog Fullstack

## Auth Module — Primary Reference

**Location:** `apps/api/src/modules/auth/`

**Relevance:** Fully implemented CQRS module following all architecture patterns. Use as the template for blog module structure.

### Module wiring pattern (`auth.module.ts`)

```typescript
@Module({
  imports: [CqrsModule, ...],
  providers: [
    AuthResolver,
    { provide: IAuthRepository, useClass: AuthRepository },  // IoC pattern
    LoginHandler,
    RefreshTokenHandler,
    GetMeHandler,
  ],
})
export class AuthModule {}
```

Blog module follows identical pattern: `{ provide: IPostRepository, useClass: PostRepository }`.

### Command handler pattern (`commands/login/login.handler.ts`)

```typescript
@CommandHandler(LoginCommand)
export class LoginHandler extends BaseCommandHandler<LoginCommand, IAuthTokens> {
  constructor(
    protected readonly db: IDatabaseService,
    protected readonly eventEmitter: IEventEmitter,
    private readonly authRepository: IAuthRepository,  // abstract class DI token
  ) {
    super(db, eventEmitter)
  }

  protected async handle(
    command: LoginCommand,
    tx: TxClient,
    _events: IDomainEvent[],
  ): Promise<IAuthTokens> {
    const user = await this.authRepository.findByEmail(command.email, tx)
    if (!user) throw new InvalidCredentialsException()
    // ... business logic
  }
}
```

### Abstract repository pattern (`repositories/auth.repository.abstract.ts`)

```typescript
export abstract class IAuthRepository implements IBaseRepository<IAuthUser> {
  abstract findByEmail: RepositoryMethod<[email: string], IAuthUserWithPassword | null>
  abstract findById: RepositoryMethod<[id: string], IAuthUser | null>
}
```

### Thin resolver pattern (`resolvers/auth.resolver.ts`)

```typescript
@Resolver()
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => AuthTokensType)
  async login(
    @Args('input', { type: () => LoginInput }) input: LoginInput,
  ): Promise<IAuthTokens> {
    return this.commandBus.execute<LoginCommand, IAuthTokens>(
      new LoginCommand(input.email, input.password),
    )
  }

  @Query(() => UserProfileType)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: IJwtUser): Promise<IAuthUser> {
    return this.queryBus.execute<GetMeQuery, IAuthUser>(
      new GetMeQuery(user.id, user.role),
    )
  }
}
```

## CQRS Base Classes

**Location:** `apps/api/src/common/cqrs/`

```typescript
// base-command.handler.ts
export abstract class BaseCommandHandler<TCommand, TResult = void> {
  async execute(command: TCommand): Promise<TResult> {
    const events: IDomainEvent[] = []
    const result = await this.db.$transaction((tx) => this.handle(command, tx, events))
    for (const event of events) this.eventEmitter.emit(event.eventName, event)
    return result
  }
  protected abstract handle(command: TCommand, tx: TxClient, events: IDomainEvent[]): Promise<TResult>
}

// base-query.handler.ts
export abstract class BaseQueryHandler<TQuery, TResult> {
  async execute(query: TQuery): Promise<TResult> {
    return this.db.$transaction((tx) => this.handle(query, tx))
  }
  protected abstract handle(query: TQuery, tx: TxClient): Promise<TResult>
}
```

### RepositoryMethod type (`common/cqrs/types.ts`)

```typescript
type RepositoryMethod<TArgs extends unknown[], TReturn> =
  (...args: [...TArgs, tx: TxClient]) => Promise<TReturn>

interface IBaseRepository<TEntity, TId = string> {
  findById(id: TId, tx: TxClient): Promise<TEntity | null>
}
```

## Product-Plan Design Components

**Location:** `product-plan/sections/blog/components/`

- `BlogFeed.tsx` — post grid with search bar, category chips, empty states, "+ Nuevo" button
- `PostCard.tsx` — single card with cover image, categories, reactions summary, comment count, author chip
- `types.ts` — complete TypeScript interfaces for all blog domain types (PostPreview, PostDetail, Comment, Draft, etc.)
- `sample-data.json` — representative data shapes including 2-level comment threading
