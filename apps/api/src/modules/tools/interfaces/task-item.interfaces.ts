export interface ITaskItem {
  id: string
  text: string
  completed: boolean
  order: number
  userId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface IUpdateTaskItemData {
  text?: string
  completed?: boolean
}

export interface IReorderItem {
  id: string
  order: number
}
