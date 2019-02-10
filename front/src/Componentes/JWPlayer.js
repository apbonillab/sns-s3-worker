import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactJWPlayer from 'react-jw-player';


const displayName = 'ReactJWPlayerContainer';


const propTypes = {
  playlist: PropTypes.string.isRequired,
  playerScript: PropTypes.string.isRequired
};


class ReactJWPlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoTitle: '',
    };

    this.onAdPlay = this.onAdPlay.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onVideoLoad = this.onVideoLoad.bind(this);

    // each instance of <ReactJWPlayer> needs a unique id.
    // we randomly generate it here and assign to the container instance.
    //this.playerId = someFunctionToRandomlyGenerateId();
    this.playerId = 5;
  }
  onReady(event) {
    // interact with JW Player API here
    const player = window.jwplayer(this.playerId);
  }
  onAdPlay(event) {
    // track the ad play here
  }
  onVideoLoad(event) {
    this.setState({
      videoTitle: event.item.description // this only works with json feeds!
    });
  }
  render() {
    return (
      <div className='react-jw-player-container'>
        <h1>{ this.state.videoTitle }</h1>
        <ReactJWPlayer
          playlist={this.props.playlist}
          licenseKey='your-license-key'
          onAdPlay={this.onAdPlay}
          onReady={this.onReady}
          onVideoLoad={this.onVideoLoad}
          playerId={this.playerId} // bring in the randomly generated playerId
          playerScript='https://link-to-your-jw-player-script.js'
        />
      </div>
    );
  }
}

ReactJWPlayerContainer.propTypes = propTypes;
//ReactJWPlayerContainer.defaultProps = defaultProps;
ReactJWPlayerContainer.displayName = displayName;
export default ReactJWPlayerContainer;
