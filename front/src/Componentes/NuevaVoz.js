import React, { Component } from 'react';
import { Button, Form, Modal, Container, Progress } from 'semantic-ui-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
import 'filepond/dist/filepond.min.css';
var conf = require('../conf');


class NuevaVoz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idLocutor: '',
      nombre: '',
      segundo_nombre: '',
      apellido: '',
      segundo_apellido: '',
      correo: '',
      audio: [],
      concursoId: '',
      observaciones: '',
      progress: 0
    };

  }

  componentDidMount() {
    this.setState({ concursoId: this.props.id_concurso });
  }

  handleSave = () => {
    const {
      idLocutor,
      nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo,
      audio,
      concursoId,
      observaciones,
    } = this.state;
    let formData = new FormData();
    formData.append('audio', audio[0]);
    //formData.append('idLocutor', idLocutor);
    formData.append('nombre', nombre);
    formData.append('segundo_nombre', segundo_nombre);
    formData.append('apellido', apellido);
    formData.append('segundo_apellido', segundo_apellido);
    formData.append('correo', correo);
    formData.append('concurso', this.props.id_concurso);
    formData.append('url', window.location.href);
    formData.append('observaciones', observaciones);
    const config = {
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded);
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        let percent = Math.round((progressEvent.loaded * 100) / totalLength);
        this.setState({ progress: percent });
      }
    };
    axios.post(`${conf.baseURL}/locutor/creacion`, formData, config)
      .then(res => {
        let exito = res.data.exito;
        if (!exito) {
          //alert('Intentelo nuevamente');
          toast.error('Algo salio mal. Intentalo nuevamente',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          console.log('no exito');
        }
        else {
          toast.info('Tu voz 🎤 ha sido cargada correctamente, seras notificado por correo cuando este lista para reproducir.',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          console.log(exito);
          this.props.onClose();
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('Algo salio mal. Intentalo nuevamente',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
      });
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
        let nombreVoz = this.state.vozInit.split('\.');
        let long = nombreVoz.length;
        let val = nombreVoz[long - 2].split('\\');
        let long2 = val.length;
        let ext = nombreVoz[long - 1];
        this.setState({ vozInicial: val[long2 - 1], extension: ext, audio: e.target.files[0] });
      }
    });
  }

  onDrop = (file) => {
    this.setState({
      audio: file,
    });
  }

  render() {
    const campos = [
      { name: 'nombre', label: 'Primer Nombre', type: 'text' },
      { name: 'segundo_nombre', label: 'Segundo Nombre', type: 'text' },
      { name: 'apellido', label: 'Primer Apellido', type: 'text' },
      { name: 'segundo_apellido', label: 'Segundo apellido', type: 'text' },
      { name: 'correo', label: 'Correo', type: 'text' },
      { name: 'audio', label: 'Sube tu Voz', type: 'file' },
      { name: 'observaciones', label: 'Coloca tus observaciones', type: 'text' },
    ];

    return (
      <React.Fragment>

        <Modal open={this.props.open}
          onClose={this.props.onClose}
        >
          <Modal.Header>Subir una Voz</Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                {campos.map(c => {
                  if (c.type === 'text') {
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
                  }
                  else if (c.type === 'file') {
                    return (
                      <ImageUploader
                        key={c.name}
                        withIcon={false}
                        label='Max file size: 10MB'
                        buttonText='Seleccionar archivo'
                        onChange={this.onDrop}
                        imgExtension={['mp3', 'midi', 'ogg', 'm4a', 'wav',]}
                        accept='audio/*'
                        maxFileSize={10485760}
                        singleImage
                      />
                    );
                  }
                })}
              </Form>
              {this.state.progress !== 0 ?
                <Progress percent={this.state.progress}
                  progress
                  active
                  color='teal'
                >Subiendo Voz... Espera</Progress> : <div></div>}
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
      </React.Fragment>
    );
  }
}

export default NuevaVoz;
