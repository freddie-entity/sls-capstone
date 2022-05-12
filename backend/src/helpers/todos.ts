import { ToDoAccess } from './todosAccess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as createError from 'http-errors'

const todoAccess = new ToDoAccess()

export async function getToDos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getToDos(userId)
}

export async function createToDo(
  createToDoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4();
  // const bucketName = process.env.ATTACHMENT_S3_BUCKET;
  const newItem = {
    todoId: itemId,
    userId: userId,
    name: createToDoRequest.name,
    dueDate: createToDoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
    // attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  }

  return await todoAccess.createToDo(newItem)
}

export async function updateToDo(todoId: string, userId: string, updatedTodo: TodoUpdate): Promise<TodoUpdate> {
  return todoAccess.updateToDo(todoId, userId, updatedTodo)
}

export async function deleteToDo(todoId: string, userId: string): Promise<boolean> {
  return todoAccess.deleteToDo(todoId, userId)
}