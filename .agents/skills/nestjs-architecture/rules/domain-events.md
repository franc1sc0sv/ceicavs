# Domain Events

Events are emitted after a transaction commits. They follow an interface + class pattern.

## Event Interface (in `events/[domain].events.ts`)

```typescript
import { IDomainEvent } from '@/common/cqrs/types'

export interface IPostCreatedEvent extends IDomainEvent {
  postId: string
  authorId: string
}
```

## Event Class (in `events/[action]-[entity].event.ts`)

```typescript
export class PostCreatedEvent implements IPostCreatedEvent {
  readonly eventName = 'PostCreatedEvent'
  readonly occurredAt: Date
  readonly postId: string
  readonly authorId: string

  constructor(props: { postId: string; authorId: string }) {
    this.postId = props.postId
    this.authorId = props.authorId
    this.occurredAt = new Date()
  }
}
```

## Rules

- All events implement `IDomainEvent` (requires `eventName` and `occurredAt`)
- `eventName` matches the class name (used for routing)
- Events are collected in the `events` array during `handle()`, emitted after tx commits
- Event interfaces live in `events/[domain].events.ts`
- Event classes live in `events/[action]-[entity].event.ts`
- Constructor takes a props object — no positional arguments
- Events are immutable — all fields are `readonly`
- Listeners use `@OnEvent('PostCreatedEvent')` decorator from `@nestjs/event-emitter`
