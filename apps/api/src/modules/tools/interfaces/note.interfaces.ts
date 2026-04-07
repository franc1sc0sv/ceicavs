export interface INote {
  id: string
  content: string
  userId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
