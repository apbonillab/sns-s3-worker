import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';

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
      url_concurso: '',
      banner: '',
      id_usuario: '',
    };
  }

  handleSave = () => {
    const {
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url_concurso,
      banner,
      id_usuario } = this.state;

    axios.post('/concurso/creacion', {
      nombre,
      fecha_inicio,
      fecha_fin,
      valor,
      guion,
      recomendaciones,
      url_concurso,
      banner,
      id_usuario
    }).then(res => {
      console.log(res.data);
      let exito = res.data.exito;
      if (!exito) {
        alert("Intentelo nuevamente");
      }
      else {
        console.log(exito)
      }
    }).catch(err => console.log(err));
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }


  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {

    const campos = [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' },
      { name: 'fecha_fin', label: 'Fecha fin', type: 'date' },
      { name: 'valor', label: 'Valor a pagar', type: 'text' },
      { name: 'guion', label: 'Guion', type: 'text' },
      { name: 'recomendaciones', label: 'Recomendaciones', type: 'text' },
      { name: 'url_concurso', label: 'Url/Direccion Web', type: 'text' },
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
                      name={c.name}
                      label={c.label}
                      value={this.state.c}
                      iconPosition="left"
                      dateFormat='YYYY-MM-DD'
                      onChange={this.handleChange}
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
