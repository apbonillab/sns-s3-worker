import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

var conf = require('../conf');

const HomepageHeading = ({ mobile }) => (
  <Container
    fluid
    text>
    <Header
      as='h1'
      content='Super Voices'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Las  mejores voces  para  sus anuncios publicitarios.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

export default HomepageHeading;