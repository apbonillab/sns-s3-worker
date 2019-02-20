import React, { Component } from 'react';
import { Container, Button, CardGroup, Image, Accordion, Icon, Divider, Confirm } from 'semantic-ui-react';
import Axios from 'axios';
import TarjetaVoz from './CardVoice';
import NuevaVoz from './NuevaVoz';
import EditarConcurso from './EditarConcurso';

class DetalleConcurso extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url_concurso: this.props.url,
      listaVoces: [],
      borrarVoz: false,
      openCrearVoz: false,
      openEditarConcurso: false,
      idConcurso: this.props.id,
      activeIndex: 0,
      info: {},
      openConfirm:false,
    };
  }

  show = () => this.setState({ openConfirm: true })
  handleCancel = () => this.setState({ openConfirm: false })

  componentDidMount() {
    if (!this.props.info) {
      this.getInfoConcurso();
    }
    else {
      this.setState({ info: this.props.info });
    }
    if (this.props.admin) {
      this.getVoces();
    } else {
      this.getVocesxUrl();
    }

  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  getInfoConcurso = () => {
    Axios.get(`http://localhost:3000/concurso/obtener/url/${this.state.url_concurso}`)
      .then(res => {
        let datos = res.data[0];
        console.log(datos);
        this.setState({ info: datos });
      }).catch(err => console.log(err));
  }

  getVoces = () => {
    Axios.get(`/archivo/obtener/concurso/${this.props.id}`)
      .then(res => {
        console.log(res.data);
        this.setState({ listaVoces: res.data });
      }).catch(err => console.log(err));
  }

  getVocesxUrl = () => {
    Axios.get(`/archivo/obtener/concurso/url/${this.props.url}`)
      .then(res => {
        console.log('voces', res.data);
        this.setState({ listaVoces: res.data });
        this.setState({ idConcurso: res.data[0].concurso });
      }).catch(err => console.log(err));
  }

  onCloseCrearVoz = () => {
    this.setState({
      openCrearVoz: false
    });
  }

  onCloseEditarConcurso = () => {
    this.setState({
      openEditarConcurso: false
    });
  }

  crearNuevaVoz = () => {
    this.setState({ openCrearVoz: true });
    console.log('va a entrar: ', this.state.openCrearVoz);
  }

  editarConcurso = () => {
    console.log('url en detalle concurso: ', this.state.url_concurso);
    this.setState({ openEditarConcurso: true });
  }

  borrarConcurso =()=>{
    let token = localStorage.getItem('JWToken');
    console.log("Concurso a borrar props: ", this.props.id);
    Axios.delete(`/concurso/eliminar/${this.props.id}`, { headers: { 'Authorization': `Bearer ${token}` }, })
    .then(res => {
      console.log(res.data);
    }).catch(err => console.log(err));
    this.handleCancel();
    window.location = window.location.origin
  }


  render() {
    const { activeIndex } = this.state
    if (this.props.admin) {
      this.setState.borrarVoz = true;
      return (
        <Container>
          <h1>{this.state.info.nombre}</h1>
          <Button onClick={this.editarConcurso} >Editar concurso  <Icon name="edit"/></Button>
          <Button onClick={this.show}>Borrar concurso  <Icon name="delete"/></Button>
          <Image size='medium' centered src={this.state.info.banner ? `http://localhost:3000/Voces/concurso_${this.props.id}/${this.state.info.banner}` : 'images/default.jpg'}></Image>
          <Divider />
          <Accordion fluid styled>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Fechas
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <h3>Fecha Inicio: {this.state.info.fecha_inicio}</h3>
              <h3>Fecha Fin: {this.state.info.fecha_fin}</h3>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Guion
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <p>
                {this.state.info.guion}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Recomendaciones
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <p>
                {this.state.info.recomendaciones}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Premio
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 3}>
              <h3>
                $ {this.state.info.valor}
              </h3>
            </Accordion.Content>
          </Accordion>
          <br></br>
          <h2>Locutores Participantes</h2>
          <CardGroup>
            
            {this.state.listaVoces.map(card => {
              return (
                <TarjetaVoz
                  key={card.idarchivos}
                  voz_id={card.idarchivos}
                  nombreLocutor={card.nombre}
                  correo={card.correo}
                  apellidoLocutor={card.apellido}
                  idconcurso={this.state.idConcurso}
                  fecha={card.fecha}
                  estado={card.estado_nombre}
                  voz_inicial={card.voz_inicial}
                  ext={card.extension}
                  observaciones={card.observaciones}
                  borrar={this.state.borrar}
                  mostarOriginal
                  file={`http://localhost:3000/Voces/concurso_${card.concurso}/convertida/${card.voz_convertida}.mp3`}
                  
                >
                </TarjetaVoz>
              );
            })}
          </CardGroup>
          <EditarConcurso
            open={this.state.openEditarConcurso}
            onClose={this.onCloseEditarConcurso}
            urlConcurso={this.props.url}
            infoConcurso={this.state.info}
            refrescar={this.getInfoConcurso}
          />
          <Confirm
              open={this.state.openConfirm}
              content='Esta seguro de eliminar el concurso'
              onCancel={this.handleCancel}
              onConfirm={this.borrarConcurso}
          />
        </Container>
      );
    }
    else {
      return (

        <Container>
          <h1>{this.state.info.nombre}</h1>
          <Container>
            <Button
              //primary
              //onClick={() => this.setState({ openCrearVoz: true })}
              onClick={this.crearNuevaVoz}
            >
              Subir voz
            </Button>
          </Container>
          <Image size='medium' centered src={this.state.info.banner ? `http://localhost:3000/Voces/concurso_${this.state.info.idconcursos}/${this.state.info.banner}` : 'http://localhost:3000/images/default.jpg'}></Image>
          <Accordion fluid styled>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Fechas
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <h3>Fecha Inicio: {this.state.info.fecha_inicio}</h3>
              <h3>Fecha Fin: {this.state.info.fecha_fin}</h3>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Guion
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <p>
                {this.state.info.guion}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Recomendaciones
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <p>
                {this.state.info.recomendaciones}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Premio
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 3}>
              <h3>
                $ {this.state.info.valor}
              </h3>
            </Accordion.Content>
          </Accordion>
          <br></br>
          <h2>Locutores Participantes</h2>
          <CardGroup>
            {this.state.listaVoces.map(card => {
              if(card.estado_nombre==="Convertida"){
                return (
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
                    file={`http://localhost:3000/Voces/concurso_${card.concurso}/convertida/${card.voz_convertida}.mp3`}
                  >
                  </TarjetaVoz>
                );  
              }
              
            })}
          </CardGroup>
          <NuevaVoz
            open={this.state.openCrearVoz}
            onClose={this.onCloseCrearVoz}
            id_concurso={this.state.info.idconcursos}
          />
        </Container>
      );
    }
  }
}

export default DetalleConcurso;