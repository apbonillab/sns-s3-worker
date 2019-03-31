import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
var conf = require('../conf');

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
      idconcurso: '',
    };
  }

  getConcursoData = () => {
    debugger;
    axios.get(`${conf.baseURL}/concurso/obtener/url/${this.props.urlConcurso}`)
      .then(res => {
        console.log('Concurso', res.data.Items);
        let datos = res.data.Items[0];
        console.log(datos);
        this.setState({ info: datos });
        /*this.setState({
          idconcursos: res.data.Items[0].idconcursos,
          nombre: res.data.Items[0].nombre,
          fecha_inicio: res.data.Items[0].fecha_inicio,
          fecha_fin: res.data.Items[0].fecha_fin,
          valor: res.data.Items[0].valor,
          guion: res.data.Items[0].guion,
          recomendaciones: res.data.Items[0].recomendaciones,
          url: res.data.Items[0].url,
          banner: res.data.Items[0].banner,
          info: {},
        });*/
      }).catch(err => console.log(err));

  }

  componentWillReceiveProps(nextProps) {
    console.log("---1--- "+JSON.stringify(nextProps.infoConcurso))
    console.log("---2--- "+JSON.stringify(this.props.infoConcurso))
    console.log("---3--- "+JSON.stringify(this.state))
    if (this.props.infoConcurso !== nextProps.infoConcurso) {
      this.setState({
        nombre: nextProps.infoConcurso.nombre,
        fecha_inicio: nextProps.infoConcurso.fecha_inicio,
        fecha_fin: nextProps.infoConcurso.fecha_fin,
        valor: nextProps.infoConcurso.valor,
        guion: nextProps.infoConcurso.guion,
        recomendaciones: nextProps.infoConcurso.recomendaciones,
        url: nextProps.infoConcurso.url,
        banner: nextProps.infoConcurso.banner,
        idconcurso: nextProps.infoConcurso.idconcurso,
      });
    }
  }

  onDrop = (picture) => {
    this.setState({
      banner: picture,
    });
  }

  handleSave = () => {
    debugger;
    const {
      idconcurso,
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url,
      banner
    } = this.state;
    let token = localStorage.getItem('JWToken');
    localStorage.setItem('url', this.state.url);
    let idadmin = localStorage.getItem('iduser');
    axios.post(`${conf.baseURL}/concurso/editar`, {
      idconcurso,
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url,
      banner
    }, { headers: { 'Authorization': `Bearer ${token}` }, })

      .then(res => {
        console.log(res.data);
        let exito = res.data.exito;
        if (!exito) {
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
          toast.info('Tu concurso ha sido actualizado.',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          this.props.updateUrl(url);
          this.props.onClose();
          this.props.refrescar();
          console.log(exito);
        }
      }).catch(function (error) {
        if (error.response.status === 500) {
          //alert("No se pudo crear el concurso, intentelo nuevamente");
          toast.error('Algo salio mal. Intentalo nuevamente',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error: ', error.message);
        }
        console.log(error.config);
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
      { name: 'nombre', label: 'Nombre', type: 'text', value: this.state.nombre },
      { name: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date', value: this.state.fecha_inicio },
      { name: 'fecha_fin', label: 'Fecha fin', type: 'date', value: this.state.fecha_fin },
      { name: 'valor', label: 'Valor a pagar', type: 'text', value: this.state.valor },
      { name: 'guion', label: 'Guion', type: 'text', value: this.state.guion },
      { name: 'recomendaciones', label: 'Recomendaciones', type: 'text', value: this.state.recomendaciones },
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
                      imgExtension={['.jpg','jpeg','bmp', '.gif', '.png', '.gif']}
                      maxFileSize={5242880}
                    />
                  );
                }
                else {
                  return (
                    <Form.Input
                      key={c.name}
                      value={c.value}
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
