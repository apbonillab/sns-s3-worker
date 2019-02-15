import React, { Component } from 'react';
import { Button, Form, Modal, Container } from 'semantic-ui-react';
import axios from 'axios';
import FilePond  from 'react-filepond';
import 'filepond/dist/filepond.min.css';

class NuevaVoz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idLocutor: '',
      vozInicial: '',
      idConcurso: '',
      observaciones: '',
      extension: '',
      abrirModalVoz:'',
    };

  }

  handleSave = () => {
    const {
      idLocutor,
      vozInicial,
      idConcurso,
      observaciones,
      extension,
    } = this.state;
    axios.post('/archivo/creacion', {
      idLocutor,
      vozInicial,
      idConcurso,
      observaciones,
      extension
    }.then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if (!exito) {
        //alert("Intentelo nuevamente");
        console.log('no exito');
      }
      else {
        console.log(exito);
      }
    }).catch(err => console.log(err)))
  }
  
  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
  crearVoz=()=>{
    console.log("Entra a Crear Voz ")
    this.setState.idLocutor=this.props.idLocutor
    this.setState.vozInicial=this.props.vozInicial
    this.setState.idConcurso=this.props.idConcurso
    this.setState.observaciones=this.props.observaciones
    this.setState.extension=this.props.extension
    return(
      this.handleSave
    );      
  }
  render(){
          const campos = [
            { name: 'vozInicial', label: 'Sube tu Voz', type: 'file' },
            { name: 'observaciones', label: 'Coloca tus observaciones', type: 'text'},
          ];
          this.setState.abrirModalVoz=this.props.open;
          console.log("Open Crear Voz", this.props.open);
          return (
            <Modal open={this.props.open}
              onClose={this.props.onClose}
            >
            <Modal.Header>Subir una Voz</Modal.Header>
              <Modal.Content>
                <Container>
                  <Form>
                    {campos.map(c => {
                        return (
                          <Form.Input
                            key={c.name}
                            value={this.state.c}
                            onChange={this.handleInput}
                            name={c.name}
                            label={c.label}
                            type={c.type}
                          />
                        );                  
                    })}
                  </Form>
                </Container>
              </Modal.Content>
              <Modal.Actions>
                <Button primary
                  content='Subir Voz'
                  icon='save'
                  onClick={this.handleSave}
                />
              </Modal.Actions>

            </Modal>
      );
    }
}

export default NuevaVoz;
