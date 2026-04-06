import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IReactionRepository } from '../interfaces/reaction.repository'
import type { IReaction, IReactionSummary } from '../interfaces/blog.interfaces'

@Injectable()
export class ReactionRepository extends IReactionRepository {
  findById = async (id: string, tx: TxClient): Promise<IReaction | null> => {
    return tx.reaction.findFirst({ where: { id } }) as Promise<IReaction | null>
  }

  findExisting = async (
    postId: string | null,
    commentId: string | null,
    userId: string,
    emoji: string,
    tx: TxClient,
  ): Promise<IReaction | null> => {
    return tx.reaction.findFirst({
      where: { postId, commentId, userId, emoji },
    }) as Promise<IReaction | null>
  }

  findSummaryByPost = async (
    postId: string,
    userId: string,
    tx: TxClient,
  ): Promise<IReactionSummary[]> => {
    return this.buildSummary({ postId }, userId, tx)
  }

  findSummaryByComment = async (
    commentId: string,
    userId: string,
    tx: TxClient,
  ): Promise<IReactionSummary[]> => {
    return this.buildSummary({ commentId }, userId, tx)
  }

  create = async (
    postId: string | null,
    commentId: string | null,
    userId: string,
    emoji: string,
    tx: TxClient,
  ): Promise<IReaction> => {
    return tx.reaction.create({
      data: {
        postId,
        commentId,
        userId,
        emoji,
      },
    }) as Promise<IReaction>
  }

  delete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.reaction.delete({ where: { id } })
  }

  private async buildSummary(
    where: { postId?: string; commentId?: string },
    userId: string,
    tx: TxClient,
  ): Promise<IReactionSummary[]> {
    const reactions = await tx.reaction.findMany({ where })

    const groups = new Map<string, { count: number; userReacted: boolean }>()
    for (const reaction of reactions) {
      const existing = groups.get(reaction.emoji) ?? { count: 0, userReacted: false }
      groups.set(reaction.emoji, {
        count: existing.count + 1,
        userReacted: existing.userReacted || reaction.userId === userId,
      })
    }

    return Array.from(groups.entries()).map(([emoji, data]) => ({
      emoji,
      count: data.count,
      userReacted: data.userReacted,
    }))
  }
}
