import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Player from './Player';
class CardVoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombrecompleto: this.props.nombreLocutor + " " +this.props.apellidoLocutor
    };
  }
  
  render() {
    return (
      
      <Card>
        <Card.Content>
          <Card.Header>{this.state.nombrecompleto} {
            
          } </Card.Header>
          <Card.Meta>
            <span className='date'>Fecha {this.props.fecha}</span>
          </Card.Meta>
          <Card.Description>
            <strong> Voz: </strong> {this.props.voz_inicial} <br/>
            <strong> Estado: </strong> {this.props.estado} <br/>
            <strong> Observaciones: </strong> {this.props.observaciones} <br/>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>          
          <Player
            idplayer={this.props.voz_id}
            archivo={this.props.file}
          ></Player>
         {/*  <Button
            content='Reproducir Voz'
            color='teal'
            as='a'
            onClick={() => {this.props.onClick(this.props.voz_id);}}
          /> */}
        </Card.Content>
      </Card>
    );
  }
}

export default CardVoice;