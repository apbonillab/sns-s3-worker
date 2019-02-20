import React, { Component } from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Player from './Player';
import Axios from 'axios';
import FileDownload from 'js-file-download';
class CardVoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombrecompleto: this.props.nombreLocutor + " " + this.props.apellidoLocutor
    };
  }

  render() {
    if(this.props.estado === "Convertida"){
      return (

        <Card>
          <Card.Content>
            <Card.Header>{this.state.nombrecompleto} {
  
            } </Card.Header>
            <Card.Meta>
              <span className='date'>Fecha {this.props.fecha}</span>
            </Card.Meta>
            <Card.Description>
              <strong> Correo: </strong> {this.props.correo} <br />
              <strong> Voz: </strong> {this.props.voz_inicial} <br />
              <strong> Estado: </strong> {this.props.estado} <br />
              <strong> Observaciones: </strong> {this.props.observaciones} <br />
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
            {this.props.mostarOriginal ?
              <Button
                content='Original'
                primary
                as='a'
                download
                onClick={() => {
                  Axios({
                    url: `http://localhost:3000/Voces/concurso_${this.props.idconcurso}/inicial/${this.props.voz_inicial}.${this.props.ext}`,
                    method: 'GET',
                    responseType: 'blob', // important
                  }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'file.mp3'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                  });
                }
                }
              /> :
              <div></div>
            }
          </Card.Content>
  
        </Card>
      );
    }else{
      return (

        <Card>
          <Card.Content>
            <Card.Header>{this.state.nombrecompleto} {
  
            } </Card.Header>
            <Card.Meta>
              <span className='date'>Fecha {this.props.fecha}</span>
            </Card.Meta>
            <Card.Description>
              <strong> Correo: </strong> {this.props.correo} <br />
              <strong> Voz: </strong> {this.props.voz_inicial} <br />
              <strong> Estado: </strong> {this.props.estado} <br />
              <strong> Observaciones: </strong> {this.props.observaciones} <br />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>            
            {/*  <Button
              content='Reproducir Voz'
              color='teal'
              as='a'
              onClick={() => {this.props.onClick(this.props.voz_id);}}
            /> */}
            {this.props.mostarOriginal ?
              <Button
                content='Original'
                primary
                as='a'
                download
                onClick={() => {
                  Axios({
                    url: `http://localhost:3000/Voces/concurso_${this.props.idconcurso}/inicial/${this.props.voz_inicial}.${this.props.ext}`,
                    method: 'GET',
                    responseType: 'blob', // important
                  }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'file.mp3'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                  });
                }
                }
              /> :
              <div></div>
            }
          </Card.Content>
  
        </Card>
      );
    }
    
  }
}

export default CardVoice;