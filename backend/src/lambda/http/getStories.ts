import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getStories } from '../../businessLogic/stories'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('StoryGET')

export const handler = 
  middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
  
    const items = await getStories(getUserId(event));
    
    logger.info(items);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
