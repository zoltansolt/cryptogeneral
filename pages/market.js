import React, { Component } from 'react';
import Layout from '../components/Layout';
import general from '../ethereum/general';
import web3 from '../ethereum/web3';

class Market extends Component {
    state = {
        unitsForSale: []
    }
    
    async componentDidMount() {
        const unitsForSaleNr = await general.methods.getUnitsForSale().call();
        var unitsForSale = [];
        for (let i = 0; i < unitsForSaleNr.length; i++) {
            unitsForSale[i] = await general.methods.getUnit(unitsForSaleNr[i]).call();
        }
        this.setState({unitsForSale});
    }
    
    onClick = async(id) => {
        const accounts = await web3.eth.getAccounts();
        
        await general.methods.purchaseUnit(id).send({
          from: accounts[0],
          value: web3.utils.toWei('0.05', 'ether')
        });
    }
    
    renderUnits() {
        return (
            <ul> {
                this.state.unitsForSale.map(unit => {
                    return (
                        <div>
                            <li>
                                {unit.name}
                                {unit.attack}
                            </li>
                            <button onClick={this.onClick(unit.id)}>Buy unit!</button>
                        </div>
                    );
                })
            }
            </ul>
        )
    }
    
    render() {
        return (
            <Layout>
                <div>
                {this.renderUnits()}
                </div>
            </Layout>
        )
    }
}

export default Market;