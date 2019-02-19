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
import Concurso from './NuevoConcurso';

class DesktopContainer extends Component {
  constructor(props) {
    super(props);
    this.state={
      usuario: localStorage.getItem('usuario'),
      token: localStorage.getItem('JWToken'),
      modalRegistro:false,
      modalLogin:false,
      modalConcurso:false,
    };
  }

  verificarStorage = () => {
    if (
      localStorage.getItem('usuario') &&
      localStorage.getItem('JWToken')
    ) {
      this.setState(
        {
          usuario: localStorage.getItem('usuario'),
          token: localStorage.getItem('JWToken'),
          sesionIniciada: true
        },
        () => {
          this.handleCloseLogin();
          this.props.setAdmin(localStorage.getItem('usuario'));
          //window.location.reload()
        }
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
  handleConcurso = () => {
    this.setState({ modalConcurso: true });
  }
  handleCloseRegistro = () => this.setState({ modalRegistro: false })
  handleCloseLogin = () => this.setState({ modalLogin: false })
  handleCloseConcurso = () => this.setState({ modalConcurso: false })
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
    const h = this.state.usuario!==null?700:100;
    console.log('usuarioContainer',this.state.usuario);
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
            style={{ minHeight: h, padding: '1em 0em' }}
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
                {this.state.usuario?
                  <Menu.Item position='right'>
                    <Button
                      content={this.state.usuario}
                      as='a' inverted={!fixed}
                    />
                    <Button 
                      content='Cerrar Sesión'
                      onClick={this.cerrarSesion}
                      as='a' inverted={!fixed}
                    />
                  </Menu.Item>:
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
            {this.state.usuario!==null?<HomepageHeading />:<div></div>}
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
        <Concurso
          open={this.props.openConcurso}
          onClose={this.props.onCloseConcurso}
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
