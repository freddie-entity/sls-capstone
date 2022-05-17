import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { StoryItem } from '../models/StoryItem'
import { StoryUpdate } from '../models/StoryUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('StoriesAccess')

export class StoriesAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly storiesTable = process.env.STORIES_TABLE) {
    }
    

    async getStories(userId: string): Promise<StoryItem[]> {
        logger.info('Getting all stories')

        // const result = await this.docClient.scan({
        //     TableName: this.storiesTable
        // }).promise()

        const result = await this.docClient.query({
            TableName: this.storiesTable,
            KeyConditionExpression: '#userId =:userId',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()
        
        return result.Items as StoryItem[]
    }

    async createStory(story: StoryItem): Promise<StoryItem> {

        logger.info("Creating story ", story)
        await this.docClient.put({
        TableName: this.storiesTable,
        Item: story
        }).promise()

        return story
    }
    async updateStory(storyId: string, userId: string, story: StoryUpdate): Promise<StoryUpdate> {

        logger.info("Creating story ", story)
        await this.docClient.update({
            TableName: this.storiesTable,
            Key: {
                userId: userId,
                storyId: storyId
            },
            ExpressionAttributeNames: {
                '#content': 'content',
                '#dueDate': 'dueDate',
                '#isArchive': 'isArchive'
            },
            ExpressionAttributeValues: {
            ":content": story.content,
            ":dueDate": story.dueDate,
            ":isArchive": story.isArchive
            },
            UpdateExpression:
                "SET #content = :content, #dueDate = :dueDate, #isArchive = :isArchive",
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return story
    }
    async deleteStory(storyId: string, userId: string): Promise<boolean> {

        logger.info("Deleting story ", storyId)
        await this.docClient.delete({
        TableName: this.storiesTable,
        Key: {
            userId: userId,
            storyId: storyId
        }
        }).promise()

        return true
    }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}
