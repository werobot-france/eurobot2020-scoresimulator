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
    if (inputs.orientation === 'onlyOne') {
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
    const { t } = this.props;
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Container>
            <div className="header">
              <div className="header-content">
                <div className="header-logos">
                   {/* <img 
                    src="https://www.eurobot.org/images/2020/Logo.png"
                    alt="Sail the world"
                    className="sailtheworld-logo"
                    style={{width: '10em'}} /> */}
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
                          disabled={this.props.i18n.language === 'fr'}>
                            Français
                        </Button>
                        <Button
                          onClick={() => this.switchLocale('en')}
                          disabled={this.props.i18n.language.indexOf('en') !== -1}>
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
                <Grid item xs={12} md={9}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={6}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">
                          {t('buoys.title')}
                        </FormLabel>
                        <TextField
                          fullWidth
                          label={t('buoys.buoysInPort')+" (1pt)"}
                          type="number"
                          margin="dense"
                          name="buoysInPort"
                          onChange={this.computeScore}
                        />
                        <TextField
                          fullWidth
                          label={t('buoys.buoysInColoredFairway')+" (1pt)"}
                          type="number"
                          margin="dense"
                          name="buoysInColoredChannel"
                          onChange={this.computeScore}
                        />
                        <TextField
                          fullWidth
                          label={t('buoys.buoysValidPairs')+" (2pts)"}
                          type="number"
                          margin="dense"
                          name="buoysValidPairs"
                          onChange={this.computeScore}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('windsocks.title')}
                        </FormLabel>
                        <RadioGroup name="windsocks" value={this.inputs.windsocks}>
                          <FormControlLabel 
                            onChange={this.computeScore}
                            control={<Radio />}
                            value="none"
                            label={t('windsocks.none')} />
                          <FormControlLabel 
                            onChange={this.computeScore}
                            control={<Radio />}
                            value="one"
                            label={t('windsocks.one') + " (5pts)"} />
                          <FormControlLabel 
                            onChange={this.computeScore}
                            value="both"
                            control={<Radio />}
                            label={t('windsocks.both') + " (15pts)"} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('lighthouse.title')}
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox name="lighthouseExists" />}
                            label={t('lighthouse.exists')+" (2pts)"}
                            onChange={this.computeScore}
                          />
                          <FormControlLabel
                            control={<Checkbox 
                              disabled={!this.state.lighthouseCanBeEnabled}
                              name="lighthouseEnabled" />}
                            label={t('lighthouse.enabled')+" (3pts)"}
                            onChange={this.computeScore}
                          />
                          <FormControlLabel
                            control={<Checkbox 
                              disabled={!this.state.lighthouseCanBeDeployed || !this.state.lighthouseCanBeEnabled}
                              name="lighthouseDeployed" />}
                            label={t('lighthouse.deployed')+" (10pts)"}
                            onChange={this.computeScore}
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" color="red">
                          {t('orientation.title')}
                        </FormLabel>
                        <RadioGroup name="orientation" value={this.inputs.orientation}>
                          <FormControlLabel 
                            value="none"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('orientation.none')} />
                          <FormControlLabel
                            value="onlyOne"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('orientation.onlyOne') +" (5pts)"} />
                          <FormControlLabel
                            value="bad"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('orientation.bad') +" (5pts)"} />
                          <FormControlLabel
                            value="good"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('orientation.good') +" (10pts)"} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('flags.title')}
                        </FormLabel>
                        <RadioGroup name="flags" value={this.inputs.flags}>
                          <FormControlLabel
                            value="none"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('flags.none')} />
                          <FormControlLabel
                            value="deployed"
                            control={<Radio />}
                            onChange={this.computeScore}
                            label={t('flags.raised')+" (10pts)"} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">
                          {t('estimate.title')}
                        </FormLabel>
                        <TextField
                          fullWidth
                          label={t('estimate.value')}
                          type="number"
                          margin="dense"
                          name="estimate"
                          onChange={this.computeScore}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={7} sm={6} md={12}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            {t('score.without-bonus')}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            {this.state.score}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={5} sm={6} md={12}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            {t('score.bonus')}
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
                            {t('score.total')}
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