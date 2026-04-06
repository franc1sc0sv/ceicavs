import { Injectable } from '@nestjs/common'
import type { TxClient } from '@ceicavs/db'
import { IPostRepository } from '../interfaces/post.repository'
import type { IPostsPage } from '../interfaces/post.repository'
import type {
  IPost,
  IPostWithRelations,
  ICreatePostData,
  IUpdatePostData,
  IPostFilters,
  PostStatus,
  IReactionSummary,
} from '../interfaces/blog.interfaces'

@Injectable()
export class PostRepository extends IPostRepository {
  findById = async (id: string, tx: TxClient): Promise<IPost | null> => {
    return tx.post.findFirst({
      where: { id, deletedAt: null },
    })
  }

  findMany = async (filters: IPostFilters, tx: TxClient): Promise<IPostWithRelations[]> => {
    const posts = await tx.post.findMany({
      where: {
        deletedAt: null,
        ...(filters.status != null ? { status: filters.status } : {}),
        ...(filters.authorId != null ? { authorId: filters.authorId } : {}),
        ...(filters.categoryId != null
          ? { categories: { some: { categoryId: filters.categoryId } } }
          : {}),
        ...(filters.search != null
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { excerpt: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true, role: true },
        },
        categories: {
          where: { category: { deletedAt: null } },
          include: { category: true },
        },
        reactions: true,
        images: { orderBy: { order: 'asc' } },
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return posts.map((post): IPostWithRelations => {
      const reactionGroups = new Map<string, number>()
      for (const reaction of post.reactions) {
        reactionGroups.set(reaction.emoji, (reactionGroups.get(reaction.emoji) ?? 0) + 1)
      }

      const reactionSummary: IReactionSummary[] = Array.from(reactionGroups.entries()).map(
        ([emoji, count]) => ({ emoji, count, userReacted: false }),
      )

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status as PostStatus,
        authorId: post.authorId,
        rejectionNote: post.rejectionNote,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        deletedAt: post.deletedAt,
        author: {
          id: post.author.id,
          name: post.author.name,
          avatarUrl: post.author.avatarUrl,
          role: post.author.role,
        },
        categories: post.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
          deletedAt: pc.category.deletedAt,
        })),
        reactionSummary,
        commentCount: post._count.comments,
        images: post.images.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: img.publicId,
          order: img.order,
        })),
      }
    })
  }

  findFeed = async (
    filters: IPostFilters,
    cursor: string | undefined,
    limit: number,
    userId: string,
    tx: TxClient,
  ): Promise<IPostsPage> => {
    const posts = await tx.post.findMany({
      where: {
        deletedAt: null,
        status: 'published',
        ...(filters.categoryId != null
          ? { categories: { some: { categoryId: filters.categoryId } } }
          : {}),
        ...(filters.search != null
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { excerpt: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, role: true } },
        categories: {
          where: { category: { deletedAt: null } },
          include: { category: true },
        },
        reactions: true,
        images: { orderBy: { order: 'asc' } },
        _count: { select: { comments: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor != null ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasMore = posts.length > limit
    const page = hasMore ? posts.slice(0, limit) : posts

    const items = page.map((post): IPostWithRelations => {
      const reactionGroups = new Map<string, { count: number; userReacted: boolean }>()
      for (const reaction of post.reactions) {
        const existing = reactionGroups.get(reaction.emoji) ?? { count: 0, userReacted: false }
        reactionGroups.set(reaction.emoji, {
          count: existing.count + 1,
          userReacted: existing.userReacted || reaction.userId === userId,
        })
      }

      const reactionSummary: IReactionSummary[] = Array.from(reactionGroups.entries()).map(
        ([emoji, data]) => ({ emoji, count: data.count, userReacted: data.userReacted }),
      )

      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status as PostStatus,
        authorId: post.authorId,
        rejectionNote: post.rejectionNote,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        deletedAt: post.deletedAt,
        author: {
          id: post.author.id,
          name: post.author.name,
          avatarUrl: post.author.avatarUrl,
          role: post.author.role,
        },
        categories: post.categories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
          deletedAt: pc.category.deletedAt,
        })),
        reactionSummary,
        commentCount: post._count.comments,
        images: post.images.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: img.publicId,
          order: img.order,
        })),
      }
    })

    return {
      items,
      nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
    }
  }

  create = async (
    data: ICreatePostData,
    authorId: string,
    status: PostStatus,
    tx: TxClient,
  ): Promise<IPost> => {
    return tx.post.create({
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        authorId,
        status,
        publishedAt: status === 'published' ? new Date() : null,
        categories: {
          create: data.categoryIds.map((categoryId) => ({ categoryId })),
        },
        ...(data.images != null && data.images.length > 0
          ? {
              images: {
                create: data.images.map((img) => ({
                  url: img.url,
                  publicId: img.publicId,
                  order: img.order,
                })),
              },
            }
          : {}),
      },
    }) as Promise<IPost>
  }

  update = async (id: string, data: IUpdatePostData, tx: TxClient): Promise<IPost> => {
    if (data.categoryIds != null) {
      await tx.postCategory.deleteMany({ where: { postId: id } })
      await tx.postCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({ postId: id, categoryId })),
      })
    }

    if (data.images != null) {
      await tx.postImage.deleteMany({ where: { postId: id } })
      if (data.images.length > 0) {
        await tx.postImage.createMany({
          data: data.images.map((img) => ({
            postId: id,
            url: img.url,
            publicId: img.publicId,
            order: img.order,
          })),
        })
      }
    }

    return tx.post.update({
      where: { id },
      data: {
        ...(data.title != null ? { title: data.title } : {}),
        ...(data.excerpt != null ? { excerpt: data.excerpt } : {}),
        ...(data.content != null ? { content: data.content } : {}),
      },
    }) as Promise<IPost>
  }

  softDelete = async (id: string, tx: TxClient): Promise<void> => {
    await tx.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  updateStatus = async (
    id: string,
    status: PostStatus,
    rejectionNote: string | undefined,
    tx: TxClient,
  ): Promise<IPost> => {
    return tx.post.update({
      where: { id },
      data: {
        status,
        rejectionNote: rejectionNote ?? null,
        ...(status === 'published' ? { publishedAt: new Date() } : {}),
      },
    }) as Promise<IPost>
  }
}
