import React from 'react';
import { 
  Container,
  Typography,
  Divider,
  TextField,
  Grid,
  FormControl,
  CardContent,
  Card,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormGroup,
  ButtonGroup,
  Button
} from '@material-ui/core'
import './style.css'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { indigo, purple } from '@material-ui/core/colors';
import { withTranslation } from 'react-i18next';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: indigo[500],
    },
    primary: {
      main: indigo[700],
    },
    accent: {
      main: purple[500]
    }
  },
});

const App = class App extends React.Component {

  state = {
    score: 0,
    totalScore: 0,
    bonus: 0,
    lighthouseCanBeDeployed: false,
    lighthouseCanBeEnabled: false
  }

  inputs = {
    // buoys
    buoysInPort: 0,
    buoysInColoredChannel: 0,
    buoysValidPairs: 0,
    // lighthouse
    lighthouseExists: false,
    lighthouseEnabled: false,
    lighthouseDeployed: false,
    // windsock
    windsocks: 'none',
    orientation: 'none',
    flags: '',
    estimate: 0
  }

  computeScore = (event) => {
    let targetType = event.target.type
    let targetValue = event.target.type !== 'checkbox' ? event.target.value : event.target.checked
    if (targetType === 'number') {
      targetValue = parseInt(targetValue)
      if (isNaN(targetValue) || targetValue < 0) {
        targetValue = 0
      }
    }
    console.log(targetType, event.target.name, targetValue) 
    
    let inputs = this.inputs
    inputs[event.target.name] = targetValue
    this.inputs = inputs
    //console.log(inputs)

    let lighthouseCanBeEnabled = inputs.lighthouseExists
    let lighthouseCanBeDeployed = inputs.lighthouseEnabled

    let totalScore = 0;
    totalScore += inputs.buoysInPort;
    totalScore += inputs.buoysInColoredChannel;
    totalScore += inputs.buoysValidPairs * 2;
    if (inputs.windsocks === 'one') {
      totalScore += 5
    }
    if (inputs.windsocks === 'both') {
      totalScore += 15
    }
    if (inputs.lighthouseExists) {
      totalScore += 2
    }
    if (inputs.lighthouseExists && inputs.lighthouseEnabled) {
      totalScore += 3
    }
    if (inputs.lighthouseExists && inputs.lighthouseDeployed && inputs.lighthouseEnabled) {
      totalScore += 10
    }
    if (inputs.orientation === 'bad') {
      totalScore += 5
    }
    if (inputs.orientation === 'good') {
      totalScore += 10
    }
    if (inputs.flags === 'deployed') {
      totalScore += 10
    }
    let score = totalScore;
    let bonus =  (0.30 * totalScore).toFixed(0) - (Math.abs(totalScore - inputs.estimate));
    bonus =  (bonus < 0 ? 0 : bonus);
    totalScore += bonus;
    
    this.setState({score, bonus, totalScore, lighthouseCanBeDeployed, lighthouseCanBeEnabled})
    
  }

  switchLocale = (locale) => {
    this.props.i18n.changeLanguage(locale)
  }
  
  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <ThemeProvider theme={theme}>
        <Container>
          <div className="header">
            <div className="header-content">
              <div className="header-logos">
                <img 
                  src="/eurobot.png"
                  alt="Eurobot's logo"
                  className="eurobot-logo"
                  style={{width: '10em'}} />
                <img
                  src="https://s.werobot.fr/logo.png"
                  alt="We Robot's logo"
                  className="werobot-logo"
                  style={{width: '10em'}} />
              </div>
              <div className="header-title">
                <Typography variant="h4">
                  {t('header.title')}
                </Typography>
                <div className="header-sub">
                  <div>
                    <Typography variant="h6">
                      {t('header.description')}
                    </Typography>
                    <Typography dangerouslySetInnerHTML={({__html: t('header.author', { werobot: '<a href="https://werobot.fr">We Robot</a>' })})}>
                    </Typography>
                  </div>
                  <div className="header-locales">
                    <ButtonGroup size="small" color="primary">
                      <Button 
                        onClick={() => this.switchLocale('fr')}
                        disabled={i18n.language === 'fr'}>
                          Français
                      </Button>
                      <Button
                        onClick={() => this.switchLocale('en')}
                        disabled={i18n.language === 'en'}>
                          English
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </div>
              {/*
              <img src="https://s.werobot.fr/logo.png" style={{width: '10em'}} /> 
              */}
            </div>
          </div>
          <Divider style={{marginBottom: '1em', marginTop: '1em'}} />
          <div className="form">
            <Grid container spacing={1}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8} lg={6}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend">Bouées</FormLabel>
                      <TextField
                        fullWidth
                        label="Dans le port (1pt)"
                        type="number"
                        margin="dense"
                        name="buoysInPort"
                        onChange={this.computeScore}
                      />
                      <TextField
                        fullWidth
                        label="Dans le chenal coloré (1pt)"
                        type="number"
                        margin="dense"
                        name="buoysInColoredChannel"
                        onChange={this.computeScore}
                      />
                      <TextField
                        fullWidth
                        label="Paire valide couleurs, ports (2pts)"
                        type="number"
                        margin="dense"
                        name="buoysValidPairs"
                        onChange={this.computeScore}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Manches à air levés</FormLabel>
                      <RadioGroup name="windsocks" value={this.inputs.windsocks}>
                        <FormControlLabel 
                          onChange={this.computeScore}
                          control={<Radio />}
                          value="none"
                          label="0" color="secondary" />
                        <FormControlLabel 
                          onChange={this.computeScore}
                          control={<Radio />}
                          value="one"
                          label="1 (5pts)" />
                        <FormControlLabel 
                          onChange={this.computeScore}
                          value="both"
                          control={<Radio />}
                          label="2 (15pts)" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Phare</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox name="lighthouseExists" />}
                          label="Phare présent (2pts)"
                          onChange={this.computeScore}
                        />
                        <FormControlLabel
                          control={<Checkbox 
                            disabled={!this.state.lighthouseCanBeEnabled}
                            name="lighthouseEnabled" />}
                          label="Phare allumé (3pts)"
                          onChange={this.computeScore}
                        />
                        <FormControlLabel
                          control={<Checkbox 
                            disabled={!this.state.lighthouseCanBeDeployed || !this.state.lighthouseCanBeEnabled}
                            name="lighthouseDeployed" />}
                          label="Phare déployé (et allumé) (10pts)"
                          onChange={this.computeScore}
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" color="red">
                        Arriver à bon port
                      </FormLabel>
                      <RadioGroup name="orientation" value={this.inputs.orientation}>
                        <FormControlLabel 
                          value="none"
                          control={<Radio />}
                          onChange={this.computeScore}
                          label="Pas dans les zones ou entre les 2 zones" />
                        <FormControlLabel
                          value="bad"
                          control={<Radio />}
                          onChange={this.computeScore}
                          label="Robots dans la mauvaise zone (5pts)" />
                        <FormControlLabel
                          value="good"
                          control={<Radio />}
                          onChange={this.computeScore}
                          label="Robots dans les bonne zones (10pts)" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Pavillons
                      </FormLabel>
                      <RadioGroup name="flags" value={this.inputs.flags}>
                        <FormControlLabel
                          value="none"
                          control={<Radio />}
                          onChange={this.computeScore}
                          label="Pavillons non hissées" />
                        <FormControlLabel
                          value="deployed"
                          control={<Radio />}
                          onChange={this.computeScore}
                          label="Pavillons hissés en fin de match (10pts)" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>    
                  <Grid item xs={12} md={8}>
                    <FormControl component="fieldset" fullWidth>
                      <FormLabel component="legend">Estimation</FormLabel>
                      <TextField
                        fullWidth
                        label="Votre estimation"
                        type="number"
                        margin="dense"
                        name="estimate"
                        onChange={this.computeScore}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Score (sans bonus)
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {this.state.score}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Bonus
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {this.state.bonus}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography color="secondary" gutterBottom>
                          Score total
                        </Typography>
                        <Typography variant="h4" component="h2">
                          {this.state.totalScore}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
        </Container>
          </ThemeProvider>
      </div>
    );
  }
}

export default withTranslation()(App)