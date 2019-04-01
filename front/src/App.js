import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Segment,
  CardGroup,
  Icon
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Player from './Componentes/Player';
import ResponsiveContainer from './Componentes/ResponsiveContainer';
import Axios from 'axios';
import CardConcurso from './Componentes/CardConcurso';
import DetalleConcurso from './Componentes/DetalleConcurso';
import HomepageHeading from './Componentes/HomepageHeading';
var conf = require('./conf');



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: localStorage.getItem('usuario'),
      openConcurso: false,
      listaConcursos: [],
      concursoActual: '',
      urlConcursoActual: '',
      listaVoces: [],
    };
  }

  componentDidMount() {
    if (this.state.admin) {
      this.getConcursos();
    }
    let url_concurso = window.location.pathname.match(/\/concurso\/url\/([^/\n]*)/);
    if (url_concurso !== null) {
      this.setState({ urlConcursoActual: url_concurso[1] });
    }
  }

  setAdmin = (user) => {
    this.setState({ admin: user }, () => {
      this.getConcursos();
    });
  }

  onCloseConcurso = () => {
    this.setState({
      openConcurso: false
    });
    this.getConcursos();
  }


  viewConcurso = (idConcurso) => {
    this.setState({
      concursoActual: idConcurso,
    });
    this.state.listaConcursos.map(con => {
      if (con.idconcurso === idConcurso) {
        this.setState({
          urlConcursoActual: con.url,
          concursoInfo: con
        });
      }
    });
  }

  getConcursos = () => {
    let token = localStorage.getItem('JWToken');
    Axios.get(`${conf.baseURL}/concurso/obtener/admin/${localStorage.getItem('iduser')}`, { headers: { 'Authorization': `Bearer ${token}` }, })
      .then(res => {
        console.log(res.data.Items);
        this.setState({ listaConcursos: res.data.Items });
      }).catch(err => console.log(err));
  }

  renderHome = () => {
    console.log('entra');
    return (
      <ResponsiveContainer 
        setAdmin={this.setAdmin}
        showHome={true}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  La mejor herramienta para encontrar la voz que necesitas!
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                SuperVoices es una herrramienta que te permitira interactuar desde dos roles, como administrador crear y gestionar 
                concursos para que encuentres la voz adecuada a tu necesidad comercial, como concursante podras sin necesidad de registro 
                conocer el detalle de diferentes concursos y si decides participar no necesitas registrarte y tampoco tendras restricciones 
                de tipos de archivos lo que te facilita ser parte de uno o varios concursos!!
                
                </p>
                <Header as='h4' style={{ fontSize: '2em' }}>
                  Concentrate en tu negocio y encuentra a los mejores locutores para tu publicidad sin mayor esfuerzo!!!
                </Header>
              </Grid.Column>
              <Grid.Column floated='right' width={6}>
                <Image  rounded size='large' src='/api/images/locutor2.jpg' />
              </Grid.Column>
            </Grid.Row>
            {/*<Grid.Row>
              <Grid.Column textAlign='center'>
                <Button size='huge'>Check Them Out</Button>
              </Grid.Column>
            </Grid.Row>*/}
          </Grid>
        </Segment>
        
        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "Comparte tu concurso"
                </Header>
                <p style={{ fontSize: '1.33em' }}>Con Super Voices puedes compartir tus concursos de una forma
                facil y rapida, para que todas las personas interesadas participen y los tiempos de busqueda de voces
                sean muy bajos, dandote tiempo para tomarte unos coctelitos <Icon name='glass martini' /><Icon name='glass martini' /></p>
                <Image  rounded verticalAlign='middle' size='medium' src='/api/images/sharing.jpg' />
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "Gestiona tus concursos"
                </Header>
                <p style={{ fontSize: '1.33em' }}>Con Super Voices puedes crear nuevos concursos, modificar concursos existentes 
                  o si lo quieres, Borrar los concursos, aunque perderias las voces participantes <Icon name='trash' />, Todo esto de una forma muy facil y rapida.</p>
                <Image rounded verticalAlign='middle' size='large' src='/api/images/gestion.jpg' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                    "Sube tus voces"
                  </Header>
                  <p style={{ fontSize: '1.33em' }}>Puedes subir tus voces a cada concurso sin registrarte, 
                    y lo mejor, es que puedes subir cuantas voces desees!! </p>
                    <Image rounded verticalAlign='middle' size='medium' src='/api/images/subirVoz2.jpg' />
                </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                  "Sin programas adicionales"
                </Header>
                <p style={{ fontSize: '1.33em' }}>Con Super Voices no necesitas instalar otros softwares en tu pc, 
                  lo que te brinda mayor seguridad y optimiza tu almacenamiento en disco y no sobrecarga tu procesador  
                <Icon name='line graph' />.</p>
                <Image rounded verticalAlign='middle' size='medium' src='/api/images/nosoftware.jpg' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                  <Header as='h3' style={{ fontSize: '2em' }}>
                  "Multiples formatos soportados"
                </Header>
                <p style={{ fontSize: '1.33em' }}>Sabemos lo tedioso que puede ser tener que convertir un archivo a otro formato, por eso,
                  Super Voices soporta una gran cantidad de formatos de audio, evitando que uses herramientas online poco seguras y con muchos virus
                  <Icon name='bug' />.  </p>
                  <Image rounded verticalAlign='middle' size='large' src='/api/images/multiformato.jpg' />
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                  "Reproductor integrado"
                </Header>
                <p style={{ fontSize: '1.33em' }}>Con Super Voices no necesitas descargar los arhivos de audio a tu PC para escucharlos
                ya que tenemos Reproductor integrado, esto optimiza tu almacenamiento en disco y no sobrecarga tu procesador!!
                <Icon name='line graph' />.</p>
                <Image rounded verticalAlign='middle' size='medium' src='/api/images/player.jpg' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                {/*<Grid.Column width={3}>
                  <Header inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item as='a'>Sitemap</List.Item>
                    <List.Item as='a'>Contact Us</List.Item>
                    <List.Item as='a'>Religious Ceremonies</List.Item>
                    <List.Item as='a'>Gazebo Plans</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as='h4' content='Services' />
                  <List link inverted>
                    <List.Item as='a'>Banana Pre-Order</List.Item>
                    <List.Item as='a'>DNA FAQ</List.Item>
                    <List.Item as='a'>How To Access</List.Item>
                    <List.Item as='a'>Favorite X-Men</List.Item>
                  </List>
                </Grid.Column>*/}
                <Grid.Column width={7}>
                  <Header as='h4' inverted>
                    Desarrollado por Adriana, Alejandro y Orlando de 🇨🇴 para el 🌎.
                  </Header>
                  
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </ResponsiveContainer>
    );
  }

  render() {
    if (!this.state.admin) {
      let path = window.location.pathname;
      if (this.state.urlConcursoActual) {
        //Render Concurso para locutores
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openConcurso={this.state.openConcurso}
            onCloseConcurso={this.onCloseConcurso}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <Container>
              {/*<Button
                as='a'
                icon
                labelPosition='right'
                onClick={() => this.setState({ concursoActual: '' })}
              >Atras
                <Icon name='left arrow' />
              </Button>*/}
              <DetalleConcurso
                info={this.state.concursoInfo}
                id={this.state.concursoActual}
                url={this.state.urlConcursoActual}
              />
            </Container>
          </ResponsiveContainer>
        );
      }
      else {
        return this.renderHome();
      }
    }
    else {
      if (!this.state.concursoActual) {
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openConcurso={this.state.openConcurso}
            onCloseConcurso={this.onCloseConcurso}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <p>Hola admin {this.state.admin}</p>
            <Container>
              <Button
                primary
                onClick={() => this.setState({ openConcurso: true })}
              >
                Nuevo Concurso
              </Button>
            </Container>
            <Container>
              <CardGroup>
                {this.state.listaConcursos.map(card => {
                  return (
                    <CardConcurso
                      key={card.idconcurso}
                      id={card.idconcurso}
                      urlImagen={card.banner}
                      nombreConcurso={card.nombre}
                      fechaInicio={card.fecha_inicio}
                      fechaFin={card.fecha_fin}
                      valor={card.valor}
                      onClick={this.viewConcurso}
                    >
                    </CardConcurso>
                  );
                })}
              </CardGroup>
            </Container>
          </ResponsiveContainer>
        );
      }
      else {
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openConcurso={this.state.openConcurso}
            onCloseConcurso={this.onCloseConcurso}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <Container>
              <Button
                as='a'
                icon
                labelPosition='right'
                onClick={() => this.setState({ concursoActual: '' })}
              >Atras
                <Icon name='left arrow' />
              </Button>
              <DetalleConcurso
                admin={this.state.admin}
                info={this.state.concursoInfo}
                id={this.state.concursoActual}
                url={this.state.urlConcursoActual}
              />
            </Container>
          </ResponsiveContainer>
        );
      }
    }
  }
}

export default App;
