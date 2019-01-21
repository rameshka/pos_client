import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route,Switch,Redirect } from 'react-router-dom';
import Login from "./Login/login";
import {isUser} from './Services/Auth'

import OrderDashBoard from './Dashboard';

ReactDOM.render(
    <BrowserRouter>

        <Switch>

            <Route exact path="/" render={()=>{
                if (isUser()) {
                    return <Redirect to='/dashboard'/>
            } else {
                    return <Login/>
                }}}/>

            <Route exact path="/dashboard" render = {()=>{

                if (isUser()) {
                    return <OrderDashBoard/>
                } else {
                    return <Redirect to='/'/>
                }}}/>

            }}/>

        </Switch>

    </BrowserRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
