import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUploadUrl, updateToDoAttachmentUrl } from '../../helpers/attachmentUtils'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('ToDoGenerateAttachmentUrlPOST')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    
    
    try {
      const url = getUploadUrl(todoId);
      await updateToDoAttachmentUrl(todoId, getUserId(event));
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
