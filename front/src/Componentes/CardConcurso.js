import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';

class CardConcurso extends Component {

  borrarConcurso=()=>{

  }
  render() {
    return (
      <Card>
        <Image size='small' centered src={this.props.urlImagen!=='no-image' && this.props.urlImagen!==null ?`http://localhost:3000/Voces/concurso_${this.props.id}/${this.props.urlImagen}`:'http://localhost:3000/images/default.jpg'} />
        <Card.Content>
          <Card.Header>{this.props.nombreConcurso}</Card.Header>
          <Card.Meta>
            <span className='date'>Fecha inicio {this.props.fechaInicio}</span>
          </Card.Meta>
          <Card.Meta>
            <span className='date'>Fecha fin {this.props.fechaFin}</span>
          </Card.Meta>
          <Card.Description>Premio: {this.props.valor}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            content='Ver concurso'
            color='teal'
            as='a'
            onClick={() => {this.props.onClick(this.props.id);}}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default CardConcurso;