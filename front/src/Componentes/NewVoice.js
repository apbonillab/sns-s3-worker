import React, { Component } from 'react';
import { Button, Form, Modal, Container } from 'semantic-ui-react';
import axios from 'axios';
import FilePond  from 'react-filepond';
import 'filepond/dist/filepond.min.css';

class NewVoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idLocutor: '',
      vozInicial: '',
      idConcurso: '',
      observaciones: '',
      extension: '',
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
    return(
      <Container>
        <Button
          onClick={this.crearVoz()}
        >
        Crear archivo
        </Button>
        <p>Form para cargar voz</p>
      </Container>
    );
  }
}

export default NewVoice;
