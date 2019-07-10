import React, { Component } from 'react';
import Layout from '../components/Layout';
import general from '../ethereum/general';
import web3 from '../ethereum/web3';

class Battle extends Component {
    state = {
        userUnits: [],
        enemyUnits: [],
        chosenOne: Number,
        showUserUnits: true,
        showEnemies: false
    }
    
    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const userUnitsNr = await general.methods.getUnitsByOwner(accounts[0]).call();
        const enemyNr = await general.methods.getEnemies(accounts[0]).call();
        var userUnits = [];
        var enemyUnits = [];
        for (let i = 0; i < userUnitsNr.length; i++) {
            userUnits[i] = await general.methods.getUnit(userUnitsNr[i]).call();
        }
        for (let i = 0; i < enemyNr.length; i++) {
            enemyUnits[i] = await general.methods.getUnit(enemyNr[i]).call();
        }
        this.setState({userUnits, enemyUnits});
    }
    
    chooseUnit(id) {
        const chosenOne = id;
        this.setState({chosenOne});
    }
    
    chooseEnemy = async (id) => {
        const result = await general.methods.attack(this.state.chosenOne, id);
        console.log(result);
    }
    
    renderUserUnits() {
        return (
            <div>
            {
                this.state.userUnits.map(unit => {
                    return (
                    <div key={unit.id} className="ui card" onClick={() => this.chooseUnit(unit.id)}>
                        <div className="content">
                            <div className="header">{unit.name}</div>
                        </div>
                        <div className="summary">Attack: {unit.attack} </div>
                        <div className="summary">Defense: {unit.defense} </div>
                    </div>
                    );
                })
            }
            </div>
        )
    }
    
    renderEnemies() {
        return (
            <div>
            {
                this.state.enemyUnits.map(unit => {
                    return (
                    <div key={unit.id} className="ui card" onClick={() => this.chooseEnemy(unit.id)}>
                        <div className="content">
                            <div className="header">{unit.name}</div>
                        </div>
                        <div className="summary">Attack: {unit.attack} </div>
                        <div className="summary">Defense: {unit.defense} </div>
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
                Choose your fighter:
                {this.renderUserUnits()}
                Choose your enemy:
                {this.renderEnemies()}
                </div>
            </Layout>
        )
    }
}

export default Battle;