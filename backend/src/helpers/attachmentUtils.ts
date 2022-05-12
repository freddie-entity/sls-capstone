import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const docClient: DocumentClient = createDynamoDBClient();
const toDosTable = process.env.TODOS_TABLE;

export function getUploadUrl(todoId: string) {
    
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: parseInt(urlExpiration)
    })
}

export async function updateToDoAttachmentUrl(todoId: string, userId: string) {
    await docClient.update({
        TableName: toDosTable,
        Key: {
            userId: userId,
            todoId: todoId
        },
        ExpressionAttributeNames: {
            '#attachmentUrlToDo': 'attachmentUrl',
        },
        ExpressionAttributeValues: {
        ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${todoId}`
        },
        UpdateExpression:
            "SET #attachmentUrlToDo = :attachmentUrl",
        ReturnValues: "UPDATED_NEW"
    }).promise()
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}