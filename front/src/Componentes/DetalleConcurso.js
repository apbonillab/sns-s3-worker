import React, { Component } from 'react';
import { Container, Button, CardGroup } from 'semantic-ui-react';
import Axios from 'axios';
import CardVoice from './CardVoice'
import NewVoice from './NewVoice'

class DetalleConcurso extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url_concurso: localStorage.getItem('url'),  
      listaVoces:[],
      borrarVoz:false,
      opencreateVoice:false
    };
  }

  componentDidMount() {
    if (!this.state.borrarVoz) {
      
      this.getVoces();
    }
  }
  
  getVoces = () => {
    Axios.get(`/archivo/obtener/concurso/${this.props.id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ listaVoces: res.data });
      }).catch(err => console.log(err));
  }

  onCloseCreateVoice = () => {
    this.setState({
      opencreateVoice: false
    });
  }

  crearNuevaVoz =() =>{
      return(
        <NewVoice 
            idLocutor='23'
            vozInicial="hola"
            idConcurso={this.props.id}
            observaciones="Nada"
            extension= "mp3"
        />
      );
  }



  render() {
    if (this.props.admin) {
        this.setState.borrarVoz=true;
        return (
              <Container>
                <h1>Detalle del concurso {this.props.id}</h1>
                <Button>Editar concurso</Button>
                <Button onClick={this.crearNuevaVoz()}>
                  Subir Voz
                </Button>
                <br></br>
                <h2>Locutores Participantes</h2>
                <CardGroup>
                  {this.state.listaVoces.map(card => {
                      return(
                        <CardVoice
                            key={card.id}
                            voz_id={card.id}
                            nombreLocutor={card.nombre}
                            apellidoLocutor={card.apellido}
                            fecha={card.fecha}
                            estado={card.estado_nombre}
                            voz_inicial={card.voz_inicial}
                            observaciones={card.observaciones}
                            borrar={this.state.borrar}
                        >
                        </CardVoice>
                      );
                  })}
                </CardGroup>
              </Container>
          );
        }
        else {
          return (
            <Container>
              <h1>Detalle del concurso {this.props.id}</h1>
              <Button onClick={this.crearNuevaVoz()}>Subir nueva voz</Button>
              <h2>Aca va la lista de tarjetas para usuario regular</h2>
                <CardGroup>
                  {this.state.listaVoces.map(card => {
                      return(
                        <CardVoice
                            key={card.id}
                            voz_id={card.id}
                            nombreLocutor={card.nombre}
                            apellidoLocutor={card.apellido}
                            fecha={card.fecha}
                            estado={card.estado_nombre}
                            voz_inicial={card.voz_inicial}
                            observaciones={card.observaciones}
                            borrar={this.state.borrar}
                        >
                        </CardVoice>
                      );
                  })}
                </CardGroup>
            </Container>
          );
        }
    }
}   

export default DetalleConcurso;