import React, { Component } from 'react';
import { Container, Button, CardGroup, Responsive } from 'semantic-ui-react';
import Axios from 'axios';
import TarjetaVoz from './CardVoice'
import NuevaVoz from './NuevaVoz'
import EditarConcurso from './EditarConcurso'

class DetalleConcurso extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url_concurso: localStorage.getItem('url'),  
      listaVoces:[],
      borrarVoz:false,
      openCrearVoz:false,
      onCloseCrearVoz:false,
    };
  }

  componentDidMount() {
    if (this.props.admin) {
      this.getVoces();
    }else{
      this.getVocesxUrl();
    }

  }
  
  getVoces = () => {
    Axios.get(`/archivo/obtener/concurso/${this.props.id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ listaVoces: res.data });
      }).catch(err => console.log(err));
  }

  getVocesxUrl = () => {
    Axios.get(`/archivo/obtener/concurso/url/${this.props.id}`)
      .then(res => {
        console.log('voces',res.data);
        this.setState({ listaVoces: res.data });
      }).catch(err => console.log(err));
  }

  onCloseCrearVoz = () => {
    this.setState({
      openCrearVoz: false
    });
  }

  crearNuevaVoz =() =>{
      this.setState({openCrearVoz:true});
      console.log("va a entrar: ", this.state.openCrearVoz);
  }

  editarConcurso = () => {
      return(
        <EditarConcurso />
      );
  }


  render() {
    if (this.props.admin) {
        this.setState.borrarVoz=true;
        return (
          <Container>
            <h1>Detalle del concurso {this.props.id}</h1>
            <Button onClick={this.editarConcurso}>Editar concurso</Button>
            <br></br>
            <h2>Locutores Participantes</h2>
            <CardGroup>
              {this.state.listaVoces.map(card => {
                  return(
                    <TarjetaVoz
                        key={card.idarchivos}
                        voz_id={card.idarchivos}
                        nombreLocutor={card.nombre}
                        apellidoLocutor={card.apellido}
                        fecha={card.fecha}
                        estado={card.estado_nombre}
                        voz_inicial={card.voz_inicial}
                        observaciones={card.observaciones}
                        borrar={this.state.borrar}
                        file={`http://localhost:3000/Voces/concurso_${card.concurso}/convertida/${card.idarchivos}.mp3`}
                    >
                    </TarjetaVoz>
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
                  <Container>
                    <Button
                      //primary
                      //onClick={() => this.setState({ openCrearVoz: true })}
                      onClick={this.crearNuevaVoz}
                    >
                     Subir voz
                    </Button>
                </Container>
                <h2>Aca va la lista de tarjetas para usuario regular</h2>
                  <CardGroup>
                    {this.state.listaVoces.map(card => {
                        return(
                          <TarjetaVoz
                              key={card.idarchivos}
                              voz_id={card.idarchivos}
                              nombreLocutor={card.nombre}
                              apellidoLocutor={card.apellido}
                              fecha={card.fecha}
                              estado={card.estado_nombre}
                              voz_inicial={card.voz_inicial}
                              observaciones={card.observaciones}
                              borrar={this.state.borrar}
                              file={`http://localhost:3000/Voces/concurso_${card.concurso}/convertida/${card.idarchivos}.mp3`}
                          >
                          </TarjetaVoz>
                        );
                    })}
                  </CardGroup>
                  <NuevaVoz
                    open={this.state.openCrearVoz}
                    onClose={this.onCloseCrearVoz}
                    idConcurso={this.props.id}  
                  />
              </Container>
          );
        }
    }
}   

export default DetalleConcurso;