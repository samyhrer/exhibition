import React, { Component } from 'react';
import {
  Redirect
} from 'react-router';
import ws from '../data/ws';

function hasVerticalScroll(node){
  if(node === undefined){
    if(window.innerHeight){
      return document.body.offsetHeight> innerHeight;
    }
    else {
      return document.documentElement.scrollHeight > 
        document.documentElement.offsetHeight ||
        document.body.scrollHeight>document.body.offsetHeight;
      }
    }
  else {
    return node.scrollHeight> node.offsetHeight;
  }
}

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terminal: null,
      dead: false,
      seamen: []
    };
    this.heartbeatTimer = null;
    this.datarange = {
      from: 0,
      to: 1500
    }
  }
  componentDidMount() {
    this.loadServerState(() => {
      this.initHeartbeat();
      var datarange = this.state.terminal.attributes.datarange;
      if(datarange){
        this.provision(datarange.from, datarange.to);
      }
    });
    ws.subscribe('START_PROVISION', this.onMessage.bind(this));
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.state.seamen.length === 0){
      return
    }
    var datarange = this.state.terminal.attributes.datarange;
    if(datarange){
      return //already provisioned
    }
    var hasVScroll = hasVerticalScroll();
    if(hasVScroll){
      this.datarange = {
        from: this.datarange.from,
        to: (this.datarange.to - 1)
      }
      this.provision(this.datarange.from, this.datarange.to);
    }
    else {
      ws.send('PROVISION_DONE', {
          datarange: this.datarange,
          identifier: this.state.terminal.id
        }
      );
    }
  }
  componentWillUnmount() {
    if(this.heartbeatTimer){
      clearInterval(this.heartbeatTimer);
    }
  }
  render() {
    if(this.state.dead === true){
      return (
        <Redirect to={{
          pathname: '/',
          query: {},
          state: {}
        }} />
      );
    }
    return (
      <div className="terminal">
        { this.renderSeamen(this.state.seamen) }
      </div>
    );
  }
  renderSeamen(seamen) {
    if(seamen.length === 0){
      return;
    }
    return (
      <ul style={{
        margin: 0
      }}>
        { seamen.map((seaman, index) => {
          return (
            <li onClick={ ()=>{ alert(seaman.displayName)} } key={seaman.displayName + index}>
              { seaman.displayName }
            </li>
          );
        })}
      </ul>
    );
  }
  onMessage(payload) {
    if(this.state.terminal.id === payload.identifier){
      this.datarange = payload.datarange;
      this.provision(this.datarange.from, this.datarange.to);
    };
  }
  provision(from, to) {
    fetch(`${this.state.terminal.links.seamen}?from=${from}&to=${to}`)
      .then(response => response.json())
      .then((seamen) => {
        this.setState({
          seamen: seamen
        });
      });
  }
  loadServerState(cb) {
    fetch(`/api${this.props.pathname}`)
      .then(response => response.json())
      .then((terminal) => {
        this.setState({
          terminal
        }, cb);
      });
  }
  initHeartbeat() {
    this.doHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.doHeartbeat();
    }, 30000);
  }
  doHeartbeat() {
    var terminal = this.state.terminal;
    terminal.heartbeatTimestamp = Date.now();
    fetch(this.state.terminal.links.heartbeat, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: terminal.identifier
      })
    })
    .then((response) => {
      if(!response.ok || response.status === 404){
        this.setState({
          dead: true
        });
      }
    })
    .catch(()=>{
      this.setState({
        dead: true
      });
    })
  }
}

export default Terminal;
