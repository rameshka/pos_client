import React, { Component } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
    username:'',
    password:''
  };
  componentDidMount() {
    this.callApi()
        .then(res => this.setState({ response: res.express }))
        .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/login');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.username ,password:this.state.password}),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  }

  render() {
    return (

        <div className='login-form'>
          {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
          <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Log-in to your account
              </Header>
              <p>{this.state.response}</p>
              <Form size='large' onSubmit={this.handleSubmit}>
                <Segment stacked>
                  <Form.Input
                      fluid icon='user'
                      iconPosition='left'
                      placeholder='E-mail address'
                      value={this.state.username}
                      onChange={e => this.setState({ username: e.target.value })}
                  />
                  <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Password'
                      type='password'
                      value={this.state.password}
                      onChange={e => this.setState({ password: e.target.value })}
                  />

                  <Button color='teal' fluid size='large'>
                    Login
                  </Button>
                </Segment>
              </Form>
              <Message>
                New to us? <a href='#'>Sign Up</a>
              </Message>
            </Grid.Column>
          </Grid>
        </div>

    );
  }
}

export default App;