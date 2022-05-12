import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly toDosTable = process.env.TODOS_TABLE) {
    }
    

    async getToDos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        // const result = await this.docClient.scan({
        //     TableName: this.toDosTable
        // }).promise()

        const result = await this.docClient.query({
            TableName: this.toDosTable,
            KeyConditionExpression: '#userId =:userId',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()
        
        return result.Items as TodoItem[]
    }

    async createToDo(todo: TodoItem): Promise<TodoItem> {

        logger.info("Creating todo ", todo)
        await this.docClient.put({
        TableName: this.toDosTable,
        Item: todo
        }).promise()

        return todo
    }
    async updateToDo(todoId: string, userId: string, todo: TodoUpdate): Promise<TodoUpdate> {

        logger.info("Creating todo ", todo)
        await this.docClient.update({
            TableName: this.toDosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            ExpressionAttributeNames: {
                '#nameToDo': 'name',
                '#dueDateToDo': 'dueDate',
                '#doneToDo': 'done'
            },
            ExpressionAttributeValues: {
            ":name": todo.name,
            ":dueDate": todo.dueDate,
            ":done": todo.done
            },
            UpdateExpression:
                "SET #nameToDo = :name, #dueDateToDo = :dueDate, #doneToDo = :done",
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return todo
    }
    async deleteToDo(todoId: string, userId: string): Promise<boolean> {

        logger.info("Deleting todo ", todoId)
        await this.docClient.delete({
        TableName: this.toDosTable,
        Key: {
            userId: userId,
            todoId: todoId
        }
        }).promise()

        return true
    }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}
