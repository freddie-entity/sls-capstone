import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUploadUrl, updateStoryImageUrl } from '../../dataLayer/fileStorageAccess'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GenerateStoryImageUrlPOST')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const storyId = event.pathParameters.storyId
    
    
    try {
      const url = getUploadUrl(storyId);
      await updateStoryImageUrl(storyId, getUserId(event));
      return {
          statusCode: 201,
          body: JSON.stringify({
            uploadUrl: url,
          })
      };
    }
    catch(err) {
      return {
          statusCode: 400,
          body: JSON.stringify({
            error: err,
          })
      };
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
