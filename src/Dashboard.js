import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {
    Container,
    Dropdown,
    Menu,
} from 'semantic-ui-react'

import OrderTable from './OrderTable/OrderTable'
import Order, {history} from './Order/Order'
import {Button} from 'semantic-ui-react'

class OrderDashBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            liveComponent: false,
            orderID: '',
            random: ''
        };
        this.triggerOrder = this.triggerOrder.bind(this);
        this.viewComponent = this.viewComponent.bind(this);
    }

    fetchData = async () => {
        const response = await fetch('/orderData/getMax', {
            method: 'GET',
            headers: {
                'Authorization': window.localStorage.getItem('authToken'),
            },
        });
        const body = await response.json();
        if (!body.success) {
            window.localStorage.removeItem('authToken');
            history.push('/login');
        } else {

            return body.orderID;
        }
    };

    triggerOrder = () => {
        this.fetchData()
            .then(res => {
                this.setState({orderID: res}, () => this.viewComponent())
            })
            .catch(err => console.log(err));
    };

    viewComponent = () => {
        if (!this.state.liveComponent) {
            this.setState({
                liveComponent: <Order handler={this.viewComponent} orderData={{orderID: this.state.orderID}}/>
            });
        } else {
            this.setState({liveComponent: false});
            console.log(Math.random());
            this.setState({random: Math.random()})
        }
    };

    render() {
        return (
            <div>
                <Menu fixed='top' inverted size='massive'>
                    <Container>
                        <Menu.Item as='a' header>
                            ARACADIA CAFE
                        </Menu.Item>
                        <Menu.Item as='a'>Home</Menu.Item>
                        <Dropdown item simple text='Dropdown'>
                            <Dropdown.Menu>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Header>Header Item</Dropdown.Header>
                                <Dropdown.Item>
                                    <i className='dropdown icon'/>
                                    <span className='text'>Submenu</span>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>List Item</Dropdown.Item>
                                        <Dropdown.Item>List Item</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Container>
                </Menu>
                {this.state.liveComponent}
                <Button style={{position: 'absolute', bottom: '30px', right: '30px'}} size='massive' circular
                        color='red'
                        icon='add circle' floated='right'
                        onClick={this.triggerOrder}>
                </Button>
                <OrderTable key={this.state.random}/>,
            </div>
        )
    }

}

export default withRouter(OrderDashBoard);