import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

class DetalleConcurso extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    if (this.props.admin) {

      return (
        <Container>
          <h1>Detalle del concurso {this.props.id}</h1>
          <Button>Editar concurso</Button>
          <h2>Aca va la lista de tarjetas para admin</h2>
        </Container>
      );
    }
    else {
      return (
        <Container>
          <h1>Detalle del concurso {this.props.id}</h1>
          <Button>Subir nueva voz</Button>
          <h2>Aca va la lista de tarjetas para usuario regular</h2>
        </Container>
      );
    }
  }
}

export default DetalleConcurso;