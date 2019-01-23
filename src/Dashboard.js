import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {
    Container,
    Dropdown,
    Menu,
} from 'semantic-ui-react'

import OrderTable from './OrderTable/OrderTable'
import Order from './Order/Order'
import {Button} from 'semantic-ui-react'

class OrderDashBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
        };
        this.viewComponent = this.viewComponent.bind(this);

    }

    viewComponent = function () {
        if (!this.state.showComponent) {
            this.setState({showComponent: true});
        } else {
            this.setState({showComponent: false});
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
                //TODO button should also hide
{/*                <Button size='massive' circular color='red' icon='add circle'
                        floated='right' onClick={this.viewComponent}></Button>*/}
                <Order/>
                {/*     {this.state.showComponent ? <Order/>:<OrderTable/>}*/}
            </div>
        )
    }

}

export default withRouter(OrderDashBoard);