import React, { Component } from 'react';
import ReactJWPlayer from 'react-jw-player';
var conf = require('../conf');

class Player extends Component {
  constructor(props) {
    super(props);

    this.state={
      archivo:''
    };
  }

  componentDidMount(){
    this.setState({archivo:this.props.archivo});
  }

  render() {
    return (
      <ReactJWPlayer
        customProps={{height:40, width:200}}
        playerId={`player-${this.props.idplayer}`}
        playerScript='https://cdn.jwplayer.com/libraries/3IQopFCB.js'
        file={this.state.archivo}
      />
    );
  }
}

export default Player;