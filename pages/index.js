import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';
import { Link } from '../routes';
import general from '../ethereum/general';
import web3 from '../ethereum/web3';

class GeneralIndex extends Component {
    
    onClick = async() => {
        const accounts = await web3.eth.getAccounts();
        
        await general.methods.InitiatTypes().send({
          from: accounts[0]
        });
        
    }
    
    render() {
        return (
            <Layout>
            <div>Hi</div>
            <button onClick={this.onClick}>Initiate Types</button>
            </Layout>
        );
    }
}

export default GeneralIndex;