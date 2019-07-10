import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import general from '../ethereum/general';
import web3 from '../ethereum/web3';

class BuyIndex extends Component {
    static async getInitialProps() {
        const unitTypeNr = await general.methods.getNumberOfUnitTypes().call();
        var unitType = [];
        for (let i = 0; i < unitTypeNr; i++) {
            unitType[i] = await general.methods.getUnitType(i).call();
        }
        
        return { unitType };
    }
    
    state = {
        value: ''
    }
    
    onClick = async(id, price) => {
        const accounts = await web3.eth.getAccounts();
        const name = this.state.value;
        
        await general.methods.purchaseNewUnit(id, name).send({
          from: accounts[0],
          value: price
        });
        
      }
        
    renderUnitTypes() {
        return (
            <div> {
                    this.props.unitType.map(unittype => {
                      return <div key={unittype.id}>
                      {unittype.type1}
                      Name: <input type="text" value={this.state.value} onChange={event => this.setState({ value: event.target.value })}/> 
                      <button onClick={() => this.onClick(unittype.id, unittype.basePrice)}>Buy unit!</button>
                      </div>
                    })
                }
                
            </div>
        );
    }
    
    render() {
        return (
            <Layout>
                <div>
                {this.renderUnitTypes()}
                </div>
            </Layout>
        )
    }
}

export default BuyIndex;