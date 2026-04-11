import type { RepositoryMethod } from '../../../common/cqrs'

export interface IToolCategory {
  id: string
  name: string
  slug: string
  order: number
}

export interface ITool {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  category: IToolCategory
}

export abstract class IToolRepository {
  abstract findAll: RepositoryMethod<[], ITool[]>
}
