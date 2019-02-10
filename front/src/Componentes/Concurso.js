import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import axios from 'axios';

class Concurso extends Component {

  constructor(props) {
    super(props);

    this.state = {
      Nombre:'',
      Fecha_inicio:'',
      Fecha_fin:'',
      valor:'',
      guion:'',
      recomendaciones:'',
      url_concurso:'',
      banner:'',
      id_usuario:'',
    };
  }

  handleSave = () =>{
    const {
      Nombre,
      Fecha_inicio,
      Fecha_fin,
      valor,
      guion,
      recomendaciones,
      url_concurso,
      banner,
      id_usuario}=this.state;

    axios.post('/concurso/creacion',{
      Nombre,
      Fecha_inicio,
      Fecha_fin,
      valor,
      guion,
      recomendaciones,
      url_concurso,
      banner,
      id_usuario
    }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if(!exito){
        alert("Intentelo nuevamente");
      }
      else{
        console.log(exito)
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
      {name:'Nombre', label:'Nombre', type:'text'},
      {name:'fecha_inicio', label:'Fecha de Inicio', type:'text'},
      {name:'fecha_fin', label:'Fecha_fin', type:'text'},
      {name:'valor', label:'Valor a pagar', type:'text'},
      {name:'guion', label:'Guion', type:'text'},
      {name:'recomendaciones', label:'Recomendaciones', type:'text'},
      {name:'url_concurso', label:'Url/Direccion Web', type:'text'},
      {name:'banner', label:'Banner/Imagen', type:'text'},

    ];

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>Crear un Concurso</Modal.Header>
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
            content='Crear Concurso'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Concurso;
