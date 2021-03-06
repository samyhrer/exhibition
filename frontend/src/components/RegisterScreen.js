import React, { Component } from 'react';
import {
  Redirect
} from 'react-router';
import ws from '../data/ws';

class RegisterScreen extends Component {
   constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      terminals: [],
      newTerminal: null
    };
    this.onRegisterNew = this.onRegisterNew.bind(this);
    this.onTakeover = this.onTakeover.bind(this);
    this.renderTerminal = this.renderTerminal.bind(this);
  }
  componentDidMount() {
    this.loadServerState((err)=>{
      if(err){
        console.log(err);
        return;
      }
      ws.subscribe('REGISTER_SCREEN_UPDATE', this.onMessage.bind(this));
    });
  }
  componentWillUnmount() {}
  onMessage(payload) {
    console.log(payload)
    this.setState({
      terminals: payload
    });
  }
  render() {
    if(this.state.loaded === false){
      return (
        <p>Loading...</p>
      );
    }
    if(this.state.newTerminal !== null){
      return (
        <Redirect to={{
          pathname: this.state.newTerminal.links.self,
          query: {},
          state: {}
        }}/>
      );
    }
    return (
      <div className="register-screen">
        { this.state.terminals.map(this.renderTerminal) }
        { this.renderRegisterAction( this.state.terminals.length + 1 ) }
      </div>
    );
  }
  renderTerminal(terminal, index) {
    return (
      <button key={ terminal.id } onClick={ this.onTakeover(terminal, index) }>{ terminal.id }</button>
    );
  }
  renderRegisterAction(candidateOrder) {
    return (
      <button onClick={ this.onRegisterNew }>
        { `Registrer som skjerm nummer ${ candidateOrder }` }
      </button>
    );
  }
  onRegisterNew(evt) {
    evt.preventDefault();
    this.doRegister(this.state.terminals.length + 1);
  }
  onTakeover(terminal, order){
    return (evt) => {
      evt.preventDefault();
      this.doRegister(order);
    }
  }
  doRegister(order) {
    fetch('/api/terminal', {
      method: 'POST',
      body: {
        order: order
      }})
      .then(response => response.json())
      .then((terminal) => {
        this.setState({
          newTerminal: terminal
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }
  loadServerState (cb) {
    fetch('/api/terminal')
      .then(response => response.json())
      .then((terminals) =>{
        this.setState({
          loaded: true,
          terminals: terminals,
          freeTerminalIndex: terminals.length + 1
        }, ()=>{
          cb(null)
        })
      }, (err) => {
        cb(err)
      })
  }
}

export default RegisterScreen;
