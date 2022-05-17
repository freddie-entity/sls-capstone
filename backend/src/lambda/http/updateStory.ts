import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateStory } from '../../helpers/stories'
import { UpdateStoryRequest } from '../../requests/UpdateStoryRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('StoryPATCH')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const storyId = event.pathParameters.storyId
    const updatedStory: UpdateStoryRequest = JSON.parse(event.body)

    try {
        await updateStory(storyId, getUserId(event), updatedStory)
        return {
            statusCode: 200,
            body: ''
        }
    } catch (error) {   
        return {
            statusCode: 400,
            body: "Error while updating story: " + JSON.stringify(error)
        }
    }
}
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
