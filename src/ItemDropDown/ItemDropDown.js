import React, {Component} from 'react'
import {Dropdown} from 'semantic-ui-react'
import {createHashHistory} from 'history';
import './ItemDropDown.css'

export const history = createHashHistory();

var divStyle1 = {
    display: 'inline-block',
    width: '40%'
};
var divStyle = {
    display: 'inline-block',
    width: '15%'
};


export default class ItemSelectionMenu extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                rows: [],
                value: '',
                price: 0.0,
                totalCost: 0.0,
                quantity: 1,
                itemList: []
            };

        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
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
        this.setState({value: value.value}, this.getPrice);

    };

    addToOrder = () => {

        var item = {
            Item: this.state.value,
            Price: this.state.price,
            Quantity: this.state.quantity,
            Cost: this.state.quantityCost
        };

        this.setState(state => ({
            myArray: [state.myArray, item]
        }))
    };

    //set total quantityCost for item * price
    handleQuantityChange = (e, value) => {
        let quantityVal = parseInt(e.target.value);
        console.log(quantityVal);

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
        let key = this.state.value;
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

        )
    }
}
