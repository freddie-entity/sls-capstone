import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteStory } from '../../businessLogic/stories'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('StoryDELETE')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const storyId = event.pathParameters.storyId
    const isDeleted = await deleteStory(storyId, getUserId(event))
    if (isDeleted)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Deleted item with ID: ${storyId} of User ${getUserId(event)}`
            })
        }
    
    return {
        statusCode: 400,
        body: `Error while deleting story ID: ${storyId} of User ${getUserId(event)}`
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
