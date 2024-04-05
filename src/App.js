import "./App.css";
import React from "react";
import lottery from "./lottery";
import web3 from "./web3";

class App extends React.Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: '',
        winner: '',
        isManager: false
    };

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        const isManager = accounts[0] === this.state.manager;

        this.setState({manager, players, balance, isManager});
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({message: 'Waiting on transaction success...'});

        const accounts = await web3.eth.getAccounts();

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({message: 'You have been entered!'});
    };

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();

        this.setState({message: 'Waiting on transaction success...'});

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const winner = await lottery.methods.lastWinner().call();

        this.setState({message: 'The winner is ' + winner});
    }

    render() {
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>This contract is managed by {this.state.manager}</p>
                <p>There are currently {this.state.players.length} people entered,
                    competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
                </p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of ether to enter </label>
                        <input
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}
                        />
                    </div>
                    <button>Enter</button>
                </form>
                <hr/>
                {this.state.isManager &&
                    <div>
                        <h4>Ready to pick a winner?</h4>
                        <button onClick={this.onClick}>Pick a winner!</button>
                        <hr/>
                    </div>
                }
                <h3>{this.state.message}</h3>
            </div>
        );
    }
}

export default App;
