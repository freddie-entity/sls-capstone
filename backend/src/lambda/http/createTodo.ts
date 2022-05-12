import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('ToDoPOST')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    try {
        const item = await createToDo(newTodo, getUserId(event))
        return {
            statusCode: 201,
            body: JSON.stringify({
                newItem: item
            })
        }
    } catch (error) {   
        return {
            statusCode: 400,
            body: "Error while creating todo: " + JSON.stringify(error)
        }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
