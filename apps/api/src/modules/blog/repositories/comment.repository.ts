import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { ICommentRepository } from '../interfaces/comment.repository'
import type { ICommentsPage } from '../interfaces/comment.repository'
import type { IComment, ICommentWithAuthor, IReactionSummary } from '../interfaces/blog.interfaces'

@Injectable()
export class CommentRepository extends ICommentRepository {
  findById = async (id: string, tx: TxClient): Promise<IComment | null> => {
    return tx.comment.findFirst({
      where: { id, deletedAt: null },
    }) as Promise<IComment | null>
  }

  findByPost = async (postId: string, tx: TxClient): Promise<ICommentWithAuthor[]> => {
    const comments = await tx.comment.findMany({
      where: { postId, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return comments.map((c): ICommentWithAuthor => this.mapWithAuthor(c))
  }

  findPageByPost = async (
    postId: string,
    cursor: string | undefined,
    limit: number,
    userId: string,
    tx: TxClient,
  ): Promise<ICommentsPage> => {
    const items = await tx.comment.findMany({
      where: { postId, parentId: null, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, role: true } },
        reactions: true,
        _count: { select: { replies: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor != null ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items

    return {
      items: page.map((c) => ({
        ...this.mapWithAuthor(c),
        replyCount: c._count.replies,
        reactionSummary: this.buildReactionSummary(c.reactions, userId),
      })),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    }
  }

  findPageByParent = async (
    parentId: string,
    cursor: string | undefined,
    limit: number,
    userId: string,
    tx: TxClient,
  ): Promise<ICommentsPage> => {
    const items = await tx.comment.findMany({
      where: { parentId, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, role: true } },
        reactions: true,
        _count: { select: { replies: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor != null ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items

    return {
      items: page.map((c) => ({
        ...this.mapWithAuthor(c),
        replyCount: c._count.replies,
        reactionSummary: this.buildReactionSummary(c.reactions, userId),
      })),
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    }
  }

  create = async (
    postId: string,
    authorId: string,
    text: string,
    parentId: string | null,
    depth: number,
    gifUrl: string | null,
    gifAlt: string | null,
    tx: TxClient,
  ): Promise<IComment> => {
    return tx.comment.create({
      data: {
        postId,
        authorId,
        text,
        parentId,
        depth,
        gifUrl,
        gifAlt,
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true, role: true },
        },
      },
    }) as Promise<IComment>
  }

  update = async (id: string, text: string, tx: TxClient): Promise<IComment> => {
    return tx.comment.update({
      where: { id },
      data: { text },
    }) as Promise<IComment>
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.comment.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  private buildReactionSummary(
    reactions: { emoji: string; userId: string }[],
    userId: string,
  ): IReactionSummary[] {
    const groups = new Map<string, { count: number; userReacted: boolean }>()
    for (const r of reactions) {
      const existing = groups.get(r.emoji) ?? { count: 0, userReacted: false }
      groups.set(r.emoji, {
        count: existing.count + 1,
        userReacted: existing.userReacted || r.userId === userId,
      })
    }
    return Array.from(groups.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      userReacted: data.userReacted,
    }))
  }

  private mapWithAuthor(c: {
    id: string
    postId: string
    authorId: string
    text: string
    gifUrl: string | null
    gifAlt: string | null
    depth: number
    parentId: string | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    author: { id: string; name: string; avatarUrl: string | null; role: string }
  }): ICommentWithAuthor {
    return {
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      text: c.text,
      gifUrl: c.gifUrl,
      gifAlt: c.gifAlt,
      depth: c.depth,
      parentId: c.parentId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt,
      author: {
        id: c.author.id,
        name: c.author.name,
        avatarUrl: c.author.avatarUrl,
        role: c.author.role,
      },
    }
  }
}
