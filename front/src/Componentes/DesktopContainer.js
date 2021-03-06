import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Menu,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react';
import HomepageHeading from './HomepageHeading';
import Register from './Register';
import Login from './Login';

class DesktopContainer extends Component {
  constructor(props) {
    super(props);
    this.state={
      usuario: JSON.parse(localStorage.getItem('usuario')),
      token: localStorage.getItem('JWToken'),
      modalRegistro:false,
      modalLogin:false
    };
  }

  verificarStorage = () => {
    if (
      localStorage.getItem('usuario') &&
      localStorage.getItem('JWToken')
    ) {
      this.setState(
        {
          usuario: JSON.parse(localStorage.getItem('usuario')),
          token: localStorage.getItem('JWToken'),
          sesionIniciada: true
        },
        window.location.reload()
      );
    }
  }

  cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('JWToken');
    this.setState(
      {
        usuario: null,
        token: null,
        sesionIniciada: false
      },
      window.location.reload()
    );
  }
  
  handleRegistro = () => {
    this.setState({ modalRegistro: true });
  }
  handleCloseRegistro = () => this.setState({ modalRegistro: false })
  handleLogin = () => {
    this.setState({ modalLogin: true });
  }
  handleCloseLogin = () => this.setState({ modalLogin: false })
  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  // Heads up!
  // We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
  // For more advanced usage please check Responsive docs under the "Usage" section.
  getWidth = () => {
    const isSSR = typeof window === 'undefined';

    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
  }

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive getWidth={this.getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='a' active>
                  Home
                </Menu.Item>
                <Menu.Item as='a'>Work</Menu.Item>
                <Menu.Item as='a'>Company</Menu.Item>
                <Menu.Item as='a'>Careers</Menu.Item>
                {this.state.sesionIniciada?
                  <Menu.Item position='right'>
                    <Button 
                      content={this.state.usuario}
                      as='a' inverted={!fixed}
                    /></Menu.Item>:
                  <Menu.Item position='right'>
                    <Button 
                      onClick={this.handleLogin}
                      as='a' inverted={!fixed}>
                    Log in
                    </Button>
                    <Button as='a' 
                      onClick={this.handleRegistro}
                      inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                    Sign Up
                    </Button> 
                  </Menu.Item>}
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>
        <Register
          open={this.state.modalRegistro}
          onClose={this.handleCloseRegistro}
          verificar={this.verificarStorage}
        />
        <Login
          open={this.state.modalLogin}
          onClose={this.handleCloseLogin}
          verificar={this.verificarStorage}
        />
        {children}
      </Responsive>
    );
  }
  
  
  
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

export default DesktopContainer;