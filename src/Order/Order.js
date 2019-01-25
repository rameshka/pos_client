import React, {Component} from 'react'
import {Dropdown, Table} from 'semantic-ui-react'
import {createHashHistory} from 'history';
import "./Order.css";
//import ItemSelectionMenu, {history} from '../ItemDropDown/ItemDropDown'
import '../ItemDropDown/ItemDropDown.css'

export const history = createHashHistory();

var divStyle1 = {
    display: 'inline-block',
    width: '40%'
};
var divStyle = {
    display: 'inline-block',
    width: '15%'
};

export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                itemData: [],
                name: '',
                price: 0.0,
                quantityCost: 0.0,
                quantity: 1,
                itemList: [],
                totalOrderCost: 0.0

            };

        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleCostChange = this.handleCostChange.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.handleItemDelete = this.handleItemDelete.bind(this);
        this.acceptQuantityChange = this.acceptQuantityChange.bind(this);
    }

    //redundant
    componentDidMount() {
        this.fetchData()
            .then(res => this.setState({itemData: res}))
            .catch(err => console.log(err));

        if (this.props.orderData.items) {
            this.setState({itemList: this.props.orderData.items});
            this.setState({totalOrderCost: this.props.orderData.cost});
        }
    }

    //fetch data from the server
    fetchData = async () => {
        const response = await fetch('/itemData', {
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
            return body.data;
        }
    };

    //set price for each item depending on dropdown selection
    handleItemChange = (e, value) => {
        this.setState({name: value.value}, this.getPrice);
    };

    addToOrder = () => {
        var item = {
            name: this.state.name,
            price: this.state.price,
            quantity: this.state.quantity,
            cost: this.state.quantityCost
        };

        this.setState({
            itemList: [...this.state.itemList, item]
        }, () => {
            var totalOrderCost = 0;
            for (let i = 0; i < this.state.itemList.length; i++) {
                totalOrderCost = totalOrderCost + this.state.itemList[i].cost;
            }
            this.setState({totalOrderCost: totalOrderCost})
        });

    };

    updateOrder = async (newItemList, totalOrderCost, orderID) => {
        const response = await fetch('/orderData/update', {
            method: 'POST',
            headers: {
                'Authorization': window.localStorage.getItem('authToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemList: newItemList,
                totalOrderCost: totalOrderCost,
                status: false,
                orderID: orderID
            })
        });
        const body = await response.json();
        if (body.success) {
            console.log('success updating data');
            //    this.state.setState({itemList:body.})

        } else {
            //error occurred
            //data not saved
            //unsuccessful might be JWT expire
        }

    };


    createOrder = async () => {
        const response = await fetch('/orderData/save', {
            method: 'POST',
            headers: {
                'Authorization': window.localStorage.getItem('authToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemList: this.state.itemList,
                totalOrderCost: this.state.totalOrderCost,
                status: false,
                orderID: this.props.orderData.orderID
            })
        });
        const body = await response.json();
        if (body.success) {
            //success saving data
            //redirected to the dashboard view
            this.props.handler();
        } else {
            //error occurred
            //data not saved
            //unsuccessful might be JWT expire
        }

    };

    acceptQuantityChange = (itemID, itemPrice) => {
        console.log('in');
        //go through the loop, locate the value and save in the database
        //locate from ItemList and update the value and save in the database
        if (this.props.orderData) {
            for (let i = 0; i < this.state.itemList.length; i++) {
                if (this.state.itemList[i].name === itemID) {
                    let updatedItemList = this.state.itemList;
                    let updatedItemCost = this.state.quantity * itemPrice;
                    updatedItemList[i].quantity = this.state.quantity;
                    let newOrderCost = this.props.orderData.cost - updatedItemList[i].cost + updatedItemCost;
                    updatedItemList[i].cost = updatedItemCost;
                    this.updateOrder(updatedItemList, newOrderCost, this.props.orderData.orderID);
                    break;
                }
            }
        }


    };

    //set total quantityCost for item * price
    handleCostChange = (e, value) => {
        if (this.handleQuantityChange(e, value)) {
            let totalCost = parseInt(e.target.value) * parseInt(this.state.price);
            this.setState({quantityCost: totalCost})
        }
    };

    handleQuantityChange = (e, value) => {
        let quantity = parseInt(e.target.value);
        if (!isNaN(quantity)) {
            if ((quantity < 101 && quantity > 0)) {
                this.setState({quantity: quantity});
                return true;
            } else {
                alert('Enter number of items quantity between 1-100');
            }
        }
    };

//handle total cost of the order and order view while removing items from the order
    handleItemDelete(key) {
        for (let i = 0; i < this.state.itemList.length; i++) {
            if (key === this.state.itemList[i].name) {
                var array = [...this.state.itemList]; // make a separate copy of the array
                var itemQuantityCost = this.state.itemList[i].cost;
                array.splice(i, 1);
                this.setState({itemList: array}, () => {
                    var balance = this.state.totalOrderCost - itemQuantityCost;
                    this.setState({totalOrderCost: balance})
                });
            }

        }
    };

    getPrice = () => {
        let key = this.state.name;
        for (let i = 0; i < this.state.itemData.length; i++) {
            if (this.state.itemData[i].key === key) {
                this.setState({price: this.state.itemData[i].price}, () => {
                    let totalCost = parseInt(this.state.quantity) * parseInt(this.state.price);
                    this.setState({quantityCost: totalCost});
                });
                break;
            }
        }
    };

    render() {
        return (

            //drop down //price per item //Quantity //add the item

            <div className="ui very padded segment" style={{'margin-bottom':'100px'}}>
                <button className="ui icon right floated button" onClick={ this.props.handler}>
                    <i aria-hidden="true" className="close icon"/>
                </button>
                <div className="ui basic segment">
                    <h2 style={{'textAlign': 'center'}}>Create Order - {this.props.orderData.orderID}</h2>
                    <div className="ui horizontal divider">
                        <i className="icon cart plus"></i>
                    </div>
                    <div style={divStyle1}>
                        <Dropdown placeholder='Select Item' fluid search selection options={this.state.itemData}
                                  onChange={this.handleItemChange}/>
                    </div>
                    <div style={divStyle}>
                        <div className="ui tag labels">
                            <a className="ui label large"> Price per Item: Rs.{this.state.price}.00</a>
                        </div>
                    </div>
                    <div style={divStyle}>
                        <div className="ui input">
                            <input type="number" placeholder="Quantity" defaultValue={this.state.quantity}
                                   onChange={this.handleCostChange}/></div>
                    </div>
                    <div style={divStyle}>
                        <div className="ui tag labels">
                            <a className="ui label large"> Total cost: Rs.{this.state.quantityCost}.00</a>
                        </div>
                    </div>
                    <div style={divStyle}>
                        <button className="ui teal icon right labeled button" onClick={this.addToOrder}>
                            <i aria-hidden="true" className="cart icon"></i>Add Item
                        </button>
                    </div>
                </div>

                <Table celled selectable>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Item</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Cost</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>


                    <Table.Body>
                        {this.state.itemList.map(row => <Table.Row key={row.name}>
                            <Table.Cell>
                                {row.name}
                            </Table.Cell>
                            <Table.Cell>
                                {row.price}
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <div className="ui input">
                                    <input type="number" placeholder="Quantity" defaultValue={row.quantity}
                                           onChange={this.handleQuantityChange}/>
                                    <button className="ui positive button"
                                            onClick={() => this.acceptQuantityChange(row.name, row.price)}>
                                        <i className="check icon"></i>
                                    </button>
                                </div>

                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                Rs. {row.cost}.00
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <button onClick={() => this.handleItemDelete(row.name)}>
                                    <i className="trash icon"></i>
                                </button>
                            </Table.Cell>
                        </Table.Row>)}
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell textAlign='right'> Total Cost </Table.Cell>
                            <Table.Cell textAlign='center'>Rs. {this.state.totalOrderCost}.00</Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <button className="ui teal icon right floated labeled button" size="massive" onClick={this.createOrder}>
                    <i aria-hidden="true" className="cart icon"></i>Create Order
                </button>

            </div>


        )
    }
}

