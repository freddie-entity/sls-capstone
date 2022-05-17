export interface StoryItem {
  userId: string
  storyId: string
  timestamp: string
  content: string
  dueDate: string
  isArchive: boolean
  storyImageUrl?: string
}