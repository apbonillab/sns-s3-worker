import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';

class CardConcurso extends Component {

  render() {
    return (
      <Card>
        <Image src={this.props.urlImagen} />
        <Card.Content>
          <Card.Header>{this.props.nombreConcurso}</Card.Header>
          <Card.Meta>
            <span className='date'>Fecha inicio {this.props.fechaInicio}</span>
            <span className='date'>Fecha fin {this.props.fechaFin}</span>
          </Card.Meta>
          <Card.Description>Premio: {this.props.valor}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            content='Ver concurso'
            color='teal'
            as='a'
            onClick={this.props.onClick}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default CardConcurso;