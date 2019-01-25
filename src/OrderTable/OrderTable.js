import React, {Component} from 'react'
import {Table} from 'semantic-ui-react'
import "./OrderTable.css";
import {history} from "../Order/Order";
import Order from "../Order/Order";


var i = 0;
export default class OrderTable extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                orders: [],
                order: '',
                liveComponent: '',
            };
    }

    //redundant
    componentDidMount() {
        i = 0;
        this.fetchData()
            .then(res => this.setState({orders: res}))
            .catch(err => console.log(err));
    }

    //fetch data from the server
    fetchData = async () => {
        const response = await fetch('/orderData', {
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
            return body.data.orders;
        }
    };

    //changer order items
    changeOrder = (e) => {
        const id = e.target.value;
        for (let i = 0; i < this.state.orders.length; i++) {
            if (this.state.orders[i].orderID == id) {
                this.setState({order: this.state.orders[i]}, () => {
                    this.setState({liveComponent: <Order orderData={this.state.order} handler={this.viewComponent}/>});
                });
                break;
            }
        }
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

    increment = () => {
        return i = i + 1
    };

    render() {
        return (

            <div style={{margin: '80px'}}>
                {this.state.liveComponent}
                <Table celled selectable className="table-margin">
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Order ID</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.orders.map(rows => <Table.Row key={rows.orderID}>
                            <Table.Cell>
                                {this.increment()}
                            </Table.Cell>
                            <Table.Cell>
                                Order {rows.orderID}
                                <div>
                                    <button className="ui positive button right floated" onClick={this.settleOrder}>Pay
                                        Order
                                    </button>
                                    <button className="ui negative button right floated"
                                            onClick={this.changeOrder} value={rows.orderID}>Change
                                        Order
                                    </button>
                                </div>
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                Rs.{rows.cost}.00
                            </Table.Cell>
                        </Table.Row>)}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}
