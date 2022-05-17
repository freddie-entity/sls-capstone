import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createStory, deleteStory, getStories, patchStory } from '../api/stories-api'
import Auth from '../auth/Auth'
import { Story } from '../types/Story'

interface StoriesProps {
  auth: Auth
  history: History
}

interface StoriesState {
  stories: Story[]
  newContent: string
  loadingStories: boolean
}

export class Stories extends React.PureComponent<StoriesProps, StoriesState> {
  state: StoriesState = {
    stories: [],
    newContent: '',
    loadingStories: true
  }

  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContent: event.target.value })
  }

  onEditButtonClick = (storyId: string) => {
    this.props.history.push(`/stories/${storyId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createStory(this.props.auth.getIdToken(), {
        content: this.state.newContent,
        dueDate
      })
      this.setState({
        stories: [...this.state.stories, newTodo],
        newContent: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (storyId: string) => {
    try {
      await deleteStory(this.props.auth.getIdToken(), storyId)
      this.setState({
        stories: this.state.stories.filter(todo => todo.storyId !== storyId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.stories[pos]
      await patchStory(this.props.auth.getIdToken(), todo.storyId, {
        content: todo.content,
        dueDate: todo.dueDate,
        isArchive: !todo.isArchive
      })
      this.setState({
        stories: update(this.state.stories, {
          [pos]: { isArchive: { $set: !todo.isArchive } }
        })
      })
    } catch {
      alert('Todo check failed')
    }
  }

  async componentDidMount() {
    try {
      const stories = await getStories(this.props.auth.getIdToken())
      this.setState({
        stories,
        loadingStories: false
      })
    } catch (e: any) {
      alert(`Failed to fetch stories: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Stories</Header>

        {this.rendercreateStoryInput()}

        {this.renderStories()}
      </div>
    )
  }

  rendercreateStoryInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Share your thought',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Express something..."
            onChange={this.handleContentChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderStories() {
    if (this.state.loadingStories) {
      return this.renderLoading()
    }

    return this.renderStoriesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Your stories
        </Loader>
      </Grid.Row>
    )
  }

  renderStoriesList() {
    return (
      <Grid padded>
        {this.state.stories.map((todo, pos) => {
          return (
            <Grid.Row key={todo.storyId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.isArchive}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.content}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.storyId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.storyId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.storyImageUrl && (
                <Image src={todo.storyImageUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
