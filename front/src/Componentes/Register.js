import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import axios from 'axios';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Nombre:'',
      Segundo_nombre:'',
      Apellido:'',
      Segundo_apellido:'',
      Correo:'',
      Contrasena:'',
      Contrasena2:'',
    };
  }

  handleSave = () =>{
    const {Nombre,
      Segundo_nombre,
      Apellido,
      Segundo_apellido,
      Correo,
      Contrasena}=this.state;

    axios.post('/admin/creacion',{
      Nombre,
      Segundo_nombre,
      Apellido,
      Segundo_apellido,
      Correo,
      Contrasena
    }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if(!exito){
        console.log(res.data.mensaje);
      }
      else{
        //queda logueado
        let data = res.data;
        localStorage.setItem('JWToken',data.token);
        localStorage.setItem('usuario',data.usuario);
        this.props.verificar();
      }
    }).catch(err => console.log(err));
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

  render() {

    const campos = [
      {name:'Nombre', label:'Primer Nombre', type:'text'},
      {name:'Segundo_nombre', label:'Segundo nombre', type:'text'},
      {name:'Apellido', label:'Primer Apellido', type:'text'},
      {name:'Segundo_apellido', label:'Segundo apellido', type:'text'},
      {name:'Correo', label:'Correo Electronico', type:'text'},
      {name:'Contrasena', label:'Contraseña', type:'password'},
      {name:'Contrasena2', label:'Repetir contraseña', type:'password'},
    ];

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>Registrarse como administrador</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {/* <Header>{this.props.id}</Header> */}
            <Form>
              {campos.map(c => {
                return(
                  <Form.Input
                    key={c.name}
                    value={this.state.c}
                    onChange={this.handleInput}
                    name = {c.name}
                    label= {c.label}
                    type={c.type}
                  />
                );
              })}
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
            content='Registrar'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Register;
