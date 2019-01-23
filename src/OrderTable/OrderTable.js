import React, {Component} from 'react'
import {Table} from 'semantic-ui-react'
import "./OrderTable.css";

export default class OrderTable extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                rows: [
                    {id: 1, name: 'Gob', value: '2'},
                    {id: 2, name: 'Buster', value: '5'},
                    {id: 3, name: 'George Michael', value: '4'}
                ]
            }
    }

    componentDidMount() {
        /* this.callApi()
             .then(res => this.setState({ itemData:res.orders}))
             .catch(err => console.log(err));
             */
    }

    //use to fetch open orders from the server
    callApi = async () => {
        const response = await fetch('/orderData');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    render() {
        return (
            <Table celled selectable className="table-margin"  >
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Order Number</Table.HeaderCell>
                        <Table.HeaderCell>Order</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >
                    {this.state.itemData.map(rows => <Table.Row key={rows.id} >
                        <Table.Cell collapsing >
                            {rows.id}
                        </Table.Cell>
                        <Table.Cell >
                            {rows.name}
                        </Table.Cell>
                        <Table.Cell textAlign='center'>
                           {rows.value}
                        </Table.Cell>
                    </Table.Row>)}

                </Table.Body>
            </Table>
        )
    }
}

