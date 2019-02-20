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
      nombre:'',
      segundo_nombre:'',
      apellido:'',
      segundo_apellido:'',
      correo:'',
      vozInicial: '',
      concursoId:'',
      observaciones: '',
      extension: '',
      abrirModalVoz:'',
    };

  }

  componentDidMount() {
    this.setState({concursoId:this.props.id_concurso});  
  }

  getLocutor=()=>{

  }

  handleSave = () => {
    
    const {
      idLocutor,
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo,
      vozInicial,
      concursoId,
      observaciones,
      extension,
    } = this.state;
    /*axios.post('/locutor/creacion',{
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo
    })*/
    console.log("Nombre Archivo :", this.state.vozInicial);
    console.log("concursoId :", this.props.id_concurso);
    /*axios.post('/archivo/creacion', {
      idLocutor,
      vozInicial,
      concursoId,
      observaciones,
      extension
    }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if (!exito) {
        //alert("Intentelo nuevamente");
        console.log('no exito');
      }
      else {
        console.log(exito);
      }
    }).catch(err => console.log(err))*/
  }
  
  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
  
  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === 'vozInit') {
        let nombreVoz=this.state.vozInit.split("\.");
        let long=nombreVoz.length;
        let val = nombreVoz[long-2].split("\\");
        let long2=val.length;
        let ext = nombreVoz[long-1];
        this.setState({ vozInicial: val[long2-1], extension:ext });
      }
    });
  }
  render(){
          const campos = [
            { name: 'nombre', label: 'Primer Nombre', type: 'text' },
            { name: 'segundo_nombre', label: 'Segundo Nombre', type: 'text' },
            { name: 'apellido', label: 'Primer Apellido', type: 'text' },
            { name: 'segundo_apellido', label: 'Segundo apellido', type: 'text' },
            { name: 'correo', label: 'Correo', type: 'text' },
            { name: 'vozInit', label: 'Sube tu Voz', type: 'file' },
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
