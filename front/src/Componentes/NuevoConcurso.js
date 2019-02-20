import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';

class NuevoConcurso extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      valor: '',
      guion: '',
      recomendaciones: '',
      url: '',
      banner: [],
    };


  }

  componentDidMount() {
    this.setState({ url: `${localStorage.getItem('iduser')}con_${this.state.nombre}` });
  }

  onDrop = (picture) => {
    this.setState({
      banner: picture,
    });
  }

  handleSave = () => {
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url,
      banner } = this.state;
    let idusuario = localStorage.getItem('iduser');
    let token = localStorage.getItem('JWToken');
    localStorage.setItem('url',this.state.url);
    let formData = new FormData();
    formData.append('banner',banner[0]);
    formData.append('nombre',nombre);
    formData.append('fecha_inicio',fecha_inicio);
    formData.append('fecha_fin',fecha_fin);
    formData.append('valor',valor);
    formData.append('guion',guion);
    formData.append('recomendaciones',recomendaciones);
    formData.append('url',url);
    formData.append('idusuario',idusuario);
    axios.post('/concurso/creacion',formData , { headers: { 'Authorization': `Bearer ${token}` }, }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if (!exito) {
        alert('Intentelo nuevamente');
        console.log('no exito');
      }
      else {
        console.log(exito);
        this.props.onClose();
      }
    }).catch(err => {
      console.log(err);
      alert(err);
    });
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === 'nombre') {
        let val = `${localStorage.getItem('iduser')}con_${this.state.nombre}`.replace(/\s/g, '');
        this.setState({ url: val });
      }
    });
  }


  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {

    const campos = [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date', value: this.state.fecha_inicio },
      { name: 'fecha_fin', label: 'Fecha fin', type: 'date', value: this.state.fecha_fin },
      { name: 'valor', label: 'Valor a pagar', type: 'text' },
      { name: 'guion', label: 'Guion', type: 'text' },
      { name: 'recomendaciones', label: 'Recomendaciones', type: 'text' },
      { name: 'url', label: 'Url/Direccion Web', type: 'text' },
      { name: 'banner', label: 'Banner/Imagen', type: 'text' },

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

                if (c.type === 'date') {
                  return (
                    <DateInput
                      key={c.name}
                      name={c.name}
                      label={c.label}
                      value={c.value}
                      iconPosition="left"
                      dateFormat='YYYY-MM-DD'
                      onChange={this.handleChange}
                    />
                  );
                }
                else if (c.name === 'url') {
                  return (
                    <Form.Input
                      key={c.name}
                      value={this.state.url}
                      onChange={this.handleInput}
                      name={c.name}
                      label={c.label}
                      type={c.type}
                    />
                  );
                }
                else if (c.name === 'banner') {
                  return (
                    <ImageUploader
                      key={c.name}
                      withIcon={true}
                      buttonText='Choose images'
                      onChange={this.onDrop}
                      imgExtension={['.jpg', '.gif', '.png', '.gif']}
                      maxFileSize={5242880}
                    />
                  );
                }
                else {
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

export default NuevoConcurso;
