import React, { Component } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import {setUser} from "../Services/Auth";
import { createHashHistory } from 'history';

export const history = createHashHistory();
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            response: '',
            username:'rameshkafox@gmail.com',
            password:'1234'
        };

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
        const body = await response.json();

        if(body.success){
            setUser(body.token);
            history.push('/dashboard');
            //redirect to dashboard view
        }else{
            //view error
        }

    };

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
