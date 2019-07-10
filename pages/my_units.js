import React, { Component } from 'react';
import Layout from '../components/Layout';
import general from '../ethereum/general';
import web3 from '../ethereum/web3';

class UserUnits extends Component {
    state = {
        userUnits: [],
        value: '',
        showStore: false
    }
    
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const userUnitsNr = await general.methods.getUnitsByOwner(accounts[0]).call();
        var userUnits = [];
        for (let i = 0; i < userUnitsNr.length; i++) {
            userUnits[i] = await general.methods.getUnit(userUnitsNr[i]).call();
        }
        this.setState({userUnits});
    }
    
    onClick = async (id) => {
        const price = this.state.value;
        this.setState({ showStore: true });
        await general.methods.setPrice(id, price);
    }
    
    changeName = async (id) => {
        await general.methods.changeName(id);
    }
    
    renderUserUnits() {
        return (
            <div>
            {
                this.state.userUnits.map(unit => {
                    return (
                    <div key={unit.id} className="ui card">
                        <div className="content">
                            <div className="header">{unit.name}</div>
                        </div>
                        <div className="summary">Attack: {unit.attack} </div>
                        <div className="summary">Defense: {unit.defense} </div>
                        <div className="description" style={{display:  this.state.showStore ? 'block' : 'none' }}>Price: <input type="text" value={this.state.value} onChange={event => this.setState({ value: event.target.value })}/></div>
                        <div className="extra content">
                        <button className="ui primary button" onClick={() => this.onClick(unit.id)}>Sell</button>
                        <button className="ui primary button" onClick={() => this.changeName(unit.id)}>Change name</button>
                        </div>
                    </div>
                    );
                })
            }
            </div>
        )
    }
    
    render() {
        return (
            <Layout>
                <div>
                    {this.renderUserUnits()}
                </div>
            </Layout>
        );
    }
}

export default UserUnits;