import React, { Component } from 'react';
import { Button, Form, Modal, Grid, Segment,Header } from 'semantic-ui-react';
import axios from 'axios';

class Login extends Component {

  constructor(props) {
    super(props);
    
    this.state={
      correo:'',
      contrasena:''
    };
  }
  

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

  handleLogin = () => {
    const { correo, contrasena } = this.state;
    //Verificar y notificar errores en la información

    axios.post('/admin/login', {
      correo, contrasena
    })
      .then(res => {
        console.log(res.data);
        let exito = res.data.exito;
        if(!exito){
          console.log(res.data.mensaje);
        }
        else{
          let data = res.data;
          localStorage.setItem('JWToken',data.token);
          localStorage.setItem('usuario',data.usuario);
          this.props.verificar();
        }
      }).catch(err => console.log(err));
  };

  render() {
    return (
      <Modal 
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Grid textAlign='center' style={{ height: '100%', margin:'40px' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
                Iniciar Sesión como Administrador
            </Header>
            <Modal.Content image>
              <Form>
                <Segment stacked>
                  <Form.Input fluid icon='user'
                    iconPosition='left'
                    placeholder='Correo Electronico'
                    name='correo'
                    onChange={this.handleInput}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Contraseña'
                    type='contrasena'
                    name='contrasena'
                    onChange={this.handleInput}
                  />
                </Segment>
              </Form>
              <Grid.Row style={{margin:'20px'}}>
                <Button color='teal'
                  size='large'
                  onClick={this.handleLogin}>
                      Iniciar Sesión
                </Button>
              </Grid.Row>
            </Modal.Content>
          </Grid.Column>
        </Grid>
      </Modal>
    );
  }
}

export default Login;