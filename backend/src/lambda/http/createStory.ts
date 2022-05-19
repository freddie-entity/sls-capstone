import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateStoryRequest } from '../../requests/CreateStoryRequest'
import { createStory } from '../../businessLogic/stories'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('StoryPOST')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const newStory: CreateStoryRequest = JSON.parse(event.body)

    try {
        const item = await createStory(newStory, getUserId(event))
        return {
            statusCode: 201,
            body: JSON.stringify({
                newItem: item
            })
        }
    } catch (error) {   
        return {
            statusCode: 400,
            body: "Error while creating story: " + JSON.stringify(error)
        }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
