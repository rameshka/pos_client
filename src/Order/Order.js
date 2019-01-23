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
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.createOrder =  this.createOrder.bind(this);
    }

    componentDidMount() {
        this.fetchData()
            .then(res => this.setState({itemData: res}))
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
            cost:this.state.quantityCost
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

    createOrder = async () => {
        const response = await fetch('/orderData', {
            method: 'POST',
            headers: {
                'Authorization': window.localStorage.getItem('authToken'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemList: this.state.itemList,totalOrderCost:this.state.totalOrderCost,status:false})
        });
        const body = await response.json();
        if (body.success) {
            //success saving data
        } else {
            //error occurred
            //data not saved
            //unsuccessful might be JWT expire
        }

    };

    //set total quantityCost for item * price
    handleQuantityChange = (e, value) => {
        let quantityVal = parseInt(e.target.value);
        if (!isNaN(quantityVal)) {
            if ((quantityVal < 101 && quantityVal > 0)) {
                this.setState({quantity: e.target.value});
                let totalCost = parseInt(e.target.value) * parseInt(this.state.price);
                this.setState({quantityCost: totalCost})
            } else {
                alert('Enter number of items quantity between 1-100');
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

            <div className="ui very padded segment">
                <div className="ui basic segment">
                    <h2 style={{'textAlign': 'center'}}>Create Order</h2>
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
                                   onChange={this.handleQuantityChange}/></div>
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
                                {row.quantity}
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                {row.cost}
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <i className="trash icon"></i>
                            </Table.Cell>
                        </Table.Row>)}
                        <Table.Row>
                            <Table.Cell></Table.Cell>
                            <Table.Cell></Table.Cell>
                            <Table.Cell textAlign='right'> Total Cost </Table.Cell>
                            <Table.Cell textAlign='center'>{this.state.totalOrderCost}</Table.Cell>
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

