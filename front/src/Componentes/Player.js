import React, { Component } from 'react';
import ReactJWPlayer from 'react-jw-player';

const playlist = [{
  file: 'http://localhost:3000/images/hysteria.mp3'
}];

class Player extends Component {
  render() {
    return (
      <ReactJWPlayer
        customProps={{height:40}}
        playerId='my-unique-id'
        playerScript='https://cdn.jwplayer.com/libraries/3IQopFCB.js'
        playlist={playlist}
      />
    );
  }
}

export default Player;