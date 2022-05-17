import { apiEndpoint } from '../config'
import { Story } from '../types/Story';
import { CreateStoryRequest } from '../types/CreateStoryRequest';
import Axios from 'axios'
import { UpdateStoryRequest } from '../types/UpdateStoryRequest';

export async function getStories(idToken: string): Promise<Story[]> {
  console.log('Fetching stories')

  const response = await Axios.get(`${apiEndpoint}/stories`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Stories:', response.data)
  return response.data.items
}

export async function createStory(
  idToken: string,
  newStory: CreateStoryRequest
): Promise<Story> {
  const response = await Axios.post(`${apiEndpoint}/stories`,  JSON.stringify(newStory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchStory(
  idToken: string,
  storyId: string,
  updatedStory: UpdateStoryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/stories/${storyId}`, JSON.stringify(updatedStory), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteStory(
  idToken: string,
  storyId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/stories/${storyId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  storyId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/stories/${storyId}/image`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
