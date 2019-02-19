import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';

class EditarConcurso extends Component {

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

  getConcursoData = () => {
    axios.get(`/concurso/obtener/url/${this.props.urlConcurso}`)
    .then(res => {
      console.log('Concurso',res.data);
      this.setState({
        nombre:res.data[0].nombre,
        fecha_inicio:res.data[0].fecha_inicio,
        fecha_fin:res.data[0].fecha_fin,
        valor:res.data[0].valor,
        guion:res.data[0].guion,
        recomendaciones:res.data[0].recomendaciones,
        url:res.data[0].url,
        banner:res.data[0].banner,
      });
    }).catch(err => console.log(err));
    
  }

  componentDidMount() {
    this.getConcursoData();
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
    axios.post('/concurso/creacion', {
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url,
      banner: '',
      idusuario
    }, { headers: { 'Authorization': `Bearer ${token}` }, }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if (!exito) {
        //alert("Intentelo nuevamente");
        console.log('no exito');
      }
      else {
        console.log(exito);
      }
    }).catch(err => console.log(err));
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
      { name: 'nombre', label: 'Nombre', type: 'text', value:this.state.nombre},
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
        <Modal.Header>Editar Concurso {this.state.nombre}</Modal.Header>
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
            content='Editar Concurso'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default EditarConcurso;
