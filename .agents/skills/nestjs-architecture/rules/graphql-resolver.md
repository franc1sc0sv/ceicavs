# GraphQL Resolver

Resolvers are thin — they dispatch to CommandBus/QueryBus and return results.

## Pattern

```typescript
@Resolver(() => PostType)
export class PostResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => PostType)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: AuthUser,
  ): Promise<PostType> {
    return this.commandBus.execute(new CreatePostCommand(input, user.id))
  }
}
```

## Rules

- Zero business logic in resolvers — only dispatch and return
- Use `@UseGuards(JwtAuthGuard)` for authenticated operations
- Use `@CurrentUser()` decorator to get the authenticated user
- `@InputType()` classes live in `commands/[action]/[action].input.ts`
- `@ObjectType()` classes live in `types/[resource].type.ts`
- Use `@ResolveField()` for related data to avoid N+1 (with DataLoader)
- GraphQL enums: register with `registerEnumType()` in the types file
- Return types match `@ObjectType()` classes, not domain interfaces
