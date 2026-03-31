# Naming Conventions

## Files

| Type | Pattern | Example |
|---|---|---|
| Module | `[domain].module.ts` | `posts.module.ts` |
| Resolver | `[resource].resolver.ts` | `post.resolver.ts` |
| Command | `[action]-[resource].command.ts` | `create-post.command.ts` |
| Command Handler | `[action]-[resource].handler.ts` | `create-post.handler.ts` |
| Command Input | `[action]-[resource].input.ts` | `create-post.input.ts` |
| Query | `[action]-[resource].query.ts` | `list-posts.query.ts` |
| Query Handler | `[action]-[resource].handler.ts` | `list-posts.handler.ts` |
| Query Output | `[action]-[resource].output.ts` | `list-posts.output.ts` |
| Repository Interface | `[entity].repository.interface.ts` | `post.repository.interface.ts` |
| Repository Impl | `[entity].repository.ts` | `post.repository.ts` |
| Domain Interfaces | `[domain].interfaces.ts` | `posts.interfaces.ts` |
| Event Interface | `[domain].events.ts` | `posts.events.ts` |
| Event Class | `[action]-[entity].event.ts` | `post-created.event.ts` |
| GraphQL Type | `[resource].type.ts` | `post.type.ts` |

## Classes

| Type | Pattern | Example |
|---|---|---|
| Module | `[Domain]Module` | `PostsModule` |
| Resolver | `[Resource]Resolver` | `PostResolver` |
| Command | `[Action][Resource]Command` | `CreatePostCommand` |
| Handler | `[Action][Resource]Handler` | `CreatePostHandler` |
| Input DTO | `[Action][Resource]Input` | `CreatePostInput` |
| Query | `[Action][Resource]Query` | `ListPostsQuery` |
| Repository Abstract | `I[Entity]Repository` | `IPostRepository` |
| Repository Concrete | `[Entity]Repository` | `PostRepository` |
| Domain Interface | `I[Entity]` | `IPost` |
| Event Interface | `I[Action][Entity]Event` | `IPostCreatedEvent` |
| Event Class | `[Action][Entity]Event` | `PostCreatedEvent` |
| GraphQL Type | `[Resource]Type` | `PostType` |

## General

- Files: kebab-case
- Classes: PascalCase
- Interfaces: `I` prefix
- Folders: kebab-case, plural for collections (commands, queries, events, types)
- Domain module folder: plural (posts, users, tools)
- Command/query subfolder: kebab-case action-resource (create-post, list-posts)
