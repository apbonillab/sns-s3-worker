import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

class ResponsiveContainer extends Component {
  render() {
    return (
      <div>
        <DesktopContainer setAdmin={this.props.setAdmin}>{this.props.children}</DesktopContainer>
        <MobileContainer setAdmin={this.props.setAdmin}>{this.props.children}</MobileContainer>
      </div>
    );
  }
}

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

export default ResponsiveContainer;