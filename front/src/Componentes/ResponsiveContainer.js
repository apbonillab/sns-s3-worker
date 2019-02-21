import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';
var conf = require('../conf');

class ResponsiveContainer extends Component {
  render() {
    return (
      <div>
        <DesktopContainer {...this.props}>{this.props.children}</DesktopContainer>
        <MobileContainer {...this.props}>{this.props.children}</MobileContainer>
      </div>
    );
  }
}

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

export default ResponsiveContainer;