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
  FormGroup
} from '@material-ui/core'
import './style.css'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { indigo } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: indigo[500],
    },
    primary: {
      main: indigo[700],
    }
  },
});


export default class App extends React.Component {

  state = {
    totalScore: 0,
    // buoys
    buoysInPort: 0,
    buoysInColoredChannel: 0,
    buoysValidPairs: 0,
    // lighthouse
    lighthouseEnabled: false,
    lighthouseDeployed: false,
    lighthouseExists: false,
    // windsock
    windsocks: 0,
    orientation: '',
    flags: '',
    estimate: 0,
  }

  computeScore = (event) => {
    let targetType = event.target.type
    let targetValue = event.target.type !== 'checkbox' ? event.target.value : event.target.checked
    if (targetType === 'number') {
      targetValue = parseInt(targetValue)
    }
    console.log(targetType, event.target.name, targetValue) 
    
    let state = {}
    state[event.target.name] = targetValue
    this.setState(state)
    
    this.setState({totalScore: Math.random()})
    
  }
  
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
        <Container>
          <div className="header">
            <div className="header-content">
              <div className="header-logos">
                <img src="http://www.eurobot.org/media/eurobot.png" className="eurobot-logo" style={{width: '10em'}} />
                <img src="https://s.werobot.fr/logo.png" className="werobot-logo" style={{width: '10em'}} />
              </div>
              <div className="header-title">
                <Typography variant="h4">
                  Eurobot 2020 score simulation
                </Typography>
                <Typography variant="h6">
                  Compute your game score online!
                </Typography>
                <Typography>
                  Created by the <a href="https://werobot.fr">We Robot</a> team to help you!
                </Typography>
              </div>
              {/*
              <img src="https://s.werobot.fr/logo.png" style={{width: '10em'}} /> 
              */}
            </div>
          </div>
          <Divider style={{marginBottom: '1em', marginTop: '1em'}} />
          <div className="form">
            <Grid container>
              <Grid item xs={12} md={8} style={{marginBottom: "1em"}}>
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
                      <RadioGroup name="windsocks" value="none">
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
                          control={<Checkbox name="lighthouseEnabled" />}
                          label="Phare allumé (3pts)"
                          onChange={this.computeScore}
                        />
                        <FormControlLabel
                          control={<Checkbox name="lighthouseDeployed" />}
                          label="Phare déployé (et allumé) (10pts)"
                          onChange={this.computeScore}
                          disabled={this.state.lightH}
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" color="red">
                        Arriver à bon port
                      </FormLabel>
                      <RadioGroup name="orientation" value="none">
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
                      <RadioGroup name="flags" value="none">
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
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total score
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {this.state.totalScore}
                    </Typography>
                  </CardContent>
                </Card>
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
