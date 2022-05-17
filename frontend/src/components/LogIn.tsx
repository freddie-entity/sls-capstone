import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Icon, Header } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <Header as='h2' icon textAlign='center'>
          <Icon name='newspaper outline' circular />
          <Header.Content>Save your own stories</Header.Content>
        </Header>

        <Button animated onClick={this.onLogin} color='violet' size='massive'>
          <Button.Content visible>Login</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow right' />
          </Button.Content>
        </Button>
      </div>
    )
  }
}
