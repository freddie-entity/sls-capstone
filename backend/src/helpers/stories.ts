import { StoriesAccess } from './storiesAccess'
// import { AttachmentUtils } from './imageUtils';
import { StoryItem } from '../models/StoryItem'
import { CreateStoryRequest } from '../requests/CreateStoryRequest'
// import { UpdateStoryRequest } from '../requests/UpdateStoryRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { StoryUpdate } from '../models/StoryUpdate'
// import * as createError from 'http-errors'

const storyAccess = new StoriesAccess()

export async function getStories(userId: string): Promise<StoryItem[]> {
  return storyAccess.getStories(userId)
}

export async function createStory(
  CreateStoryRequest: CreateStoryRequest,
  userId: string
): Promise<StoryItem> {
  const itemId = uuid.v4();

  const newItem = {
    storyId: itemId,
    userId: userId,
    content: CreateStoryRequest.content,
    dueDate: CreateStoryRequest.dueDate,
    isArchive: false,
    timestamp: new Date().toISOString()
  }

  return await storyAccess.createStory(newItem)
}

export async function updateStory(storyId: string, userId: string, updatedStory: StoryUpdate): Promise<StoryUpdate> {
  return storyAccess.updateStory(storyId, userId, updatedStory)
}

export async function deleteStory(storyId: string, userId: string): Promise<boolean> {
  return storyAccess.deleteStory(storyId, userId)
}