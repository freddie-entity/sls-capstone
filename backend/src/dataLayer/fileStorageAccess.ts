import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.STORY_IMAGE_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const docClient: DocumentClient = createDynamoDBClient();
const storiesTable = process.env.STORIES_TABLE;

export function getUploadUrl(storyId: string) {
    
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: storyId,
        Expires: parseInt(urlExpiration)
    })
}

export async function updateStoryImageUrl(storyId: string, userId: string) {
    await docClient.update({
        TableName: storiesTable,
        Key: {
            userId: userId,
            storyId: storyId
        },
        ExpressionAttributeNames: {
            '#storyImageUrl': 'storyImageUrl',
        },
        ExpressionAttributeValues: {
        ":storyImageUrl": `https://${bucketName}.s3.amazonaws.com/${storyId}`
        },
        UpdateExpression:
            "SET #storyImageUrl = :storyImageUrl",
        ReturnValues: "UPDATED_NEW"
    }).promise()
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}