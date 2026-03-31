# Repository Pattern

Repositories encapsulate data access. Abstract class = DI token, concrete class = Prisma implementation.

## Type-Level Enforcement

Use `RepositoryMethod` and `IBaseRepository` from `common/cqrs/` to enforce `tx` is always required at compile time:

```typescript
import type { TxClient, RepositoryMethod, IBaseRepository } from '@/common/cqrs'

export abstract class IPostRepository implements IBaseRepository<IPost> {
  abstract create: RepositoryMethod<[data: ICreatePostData], IPost>
  abstract findById(id: string, tx: TxClient): Promise<IPost | null>
  abstract findMany: RepositoryMethod<[filters: IPostFilters], IPost[]>
}
```

`RepositoryMethod<TArgs, TReturn>` expands to `(...args: [...TArgs, tx: TxClient]) => Promise<TReturn>` — making `tx` structurally required. If anyone writes `tx?: TxClient`, TypeScript will reject it.

`IBaseRepository<TEntity>` enforces that every repository has `findById(id, tx)`.

## Abstract Repository (in `interfaces/`)

```typescript
export abstract class IPostRepository implements IBaseRepository<IPost> {
  abstract create: RepositoryMethod<[data: ICreatePostData], IPost>
  abstract findById(id: string, tx: TxClient): Promise<IPost | null>
  abstract findMany: RepositoryMethod<[filters: IPostFilters], IPost[]>
}
```

## Concrete Repository (in `repositories/`)

```typescript
@Injectable()
export class PostRepository extends IPostRepository {
  async create(data: ICreatePostData, tx: TxClient): Promise<IPost> {
    return tx.post.create({ data: { ... } })
  }
}
```

## Rules

- Every method requires `tx: TxClient` — enforced by `RepositoryMethod` type, never optional
- Use `RepositoryMethod<[...args], ReturnType>` for method signatures in abstract classes
- Implement `IBaseRepository<TEntity>` on every repository interface
- Repositories do NOT inject `IDatabaseService` — they only receive `tx` from handlers
- Abstract class lives in `interfaces/[entity].repository.interface.ts`
- Concrete class lives in `repositories/[entity].repository.ts`
- Module binds: `{ provide: IPostRepository, useClass: PostRepository }`
- Repositories return domain interfaces (`IPost`), not Prisma types directly
- Soft delete: always add `deletedAt: null` to `where` clauses for entities with soft delete
