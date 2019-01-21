import React,{ Component } from 'react'
import {withRouter}from 'react-router-dom';
import {
    Container,
    Dropdown,
    Header,
    Menu,
} from 'semantic-ui-react'

import OrderTable from './OrderTable/OrderTable'

class OrderDashBoard extends Component {

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

            <OrderTable/>
        </div>
        )
    }

}

export default withRouter(OrderDashBoard);