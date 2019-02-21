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
    console.log("url concurso App.js: ", url_concurso);
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
    Axios.get(`/concurso/obtener/admin/${localStorage.getItem('iduser')}`, { headers: { 'Authorization': `Bearer ${token}` }, })
      .then(res => {
        console.log(res.data);
        this.setState({ listaConcursos: res.data });
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
                  Concentrate en tu negocio y encuentra a los mejores locutores para tu publicidad sin esfuerzo.
                </p>
              </Grid.Column>
              <Grid.Column floated='right' width={6}>
                <Image bordered rounded size='large' src='/images/wireframe/white-image.png' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <Button size='huge'>Check Them Out</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ padding: '0em' }} vertical>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "What a Company"
                </Header>
                <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as='h3' style={{ fontSize: '2em' }}>
                  "I shouldn't have gone with their competitor."
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                  <Image avatar src='/images/avatar/large/nan.jpg' />
                  <b>Nan</b> Chief Fun Officer Acme Toys
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container text>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Breaking The Grid, Grabs Your Attention
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Instead of focusing on content creation and hard work, we have learned how to master the
              art of doing nothing by providing massive amounts of whitespace and generic content that
              can seem massive, monolithic and worth your attention.
            </p>
            <Button as='a' size='large'>
              Read More
            </Button>

            <Divider
              as='h4'
              className='header'
              horizontal
              style={{ margin: '3em 0em', textTransform: 'uppercase' }}
            >
              <a href='#'>Case Studies</a>
            </Divider>

            <Header as='h3' style={{ fontSize: '2em' }}>
              Did We Tell You About Our Bananas?
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
              it's really true. It took years of gene splicing and combinatory DNA research, but our
              bananas can really dance.
            </p>
            <Button as='a' size='large'>
              I'm Still Quite Interested
            </Button>
          </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
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
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header as='h4' inverted>
                    Footer Header
                  </Header>
                  <p>
                    Desarrollado por Adriana, Alejandro y Orlando de 🇨🇴 para el 🌎.
                  </p>
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
      console.log("Path: ", path, "Admin: ", this.state.admin);
      console.log("Concurso actual para locutor: ", this.state.urlConcursoActual);
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
