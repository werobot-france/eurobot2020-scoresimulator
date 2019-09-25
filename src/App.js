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

  constructor(props) {
    super(props)
    let query = new URLSearchParams(window.location.search)
    this.state = {
      score: 0,
      totalScore: 5,
      bonus: 0,
      lighthouseCanBeDeployed: false,
      lighthouseCanBeEnabled: false,
      nonForfeit: true,
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
      estimate: 0,
      framed: query.get('framed') === 'true'
    }
    this.computeScore = this.computeScore.bind(this)
    this.props.i18n.changeLanguage(query.get('locale'))
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
    //console.log(targetType, event.target.name, targetValue) 
    
    let stateToUpdate = {}
    stateToUpdate[event.target.name] = targetValue
    //console.log(stateToUpdate)
    this.setState({
      [event.target.name]: targetValue
    }, () => {
      let lighthouseCanBeEnabled = this.state.lighthouseExists
      let lighthouseCanBeDeployed = this.state.lighthouseEnabled

      let totalScore = 0;
      totalScore += this.state.buoysInPort;
      totalScore += this.state.buoysInColoredChannel;
      totalScore += this.state.buoysValidPairs * 2;
      if (this.state.windsocks === 'one') {
        totalScore += 5
      }
      if (this.state.windsocks === 'both') {
        totalScore += 15
      }
      if (this.state.lighthouseExists) {
        totalScore += 2
      }
      if (this.state.lighthouseExists && this.state.lighthouseEnabled) {
        totalScore += 3
      }
      if (this.state.lighthouseExists && this.state.lighthouseDeployed && this.state.lighthouseEnabled) {
        totalScore += 10
      }
      if (this.state.orientation === 'bad') {
        totalScore += 5
      }
      if (this.state.orientation === 'onlyOne') {
        totalScore += 5
      }
      if (this.state.orientation === 'good') {
        totalScore += 10
      }
      if (this.state.flags === 'deployed') {
        totalScore += 10
      }
      let score = totalScore;
      let bonus =  (0.30 * totalScore).toFixed(0) - (Math.abs(totalScore - this.state.estimate));
      bonus =  (bonus < 0 ? 0 : bonus);
      totalScore += bonus;

      if (this.state.nonForfeit) {
        totalScore += 5; // 5 points default (nonForfeit)
      }
      
      this.setState({
        score,
        bonus,
        totalScore,
        lighthouseCanBeDeployed,
        lighthouseCanBeEnabled,
        lighthouseEnabled: this.state.lighthouseExists && this.state.lighthouseEnabled,
        lighthouseDeployed: this.state.lighthouseExists && this.state.lighthouseEnabled && this.state.lighthouseDeployed
      })
    })
  }

  switchLocale = (locale) => {
    this.props.i18n.changeLanguage(locale)
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className={(this.state.framed ? 'framed' : '')}>
        <ThemeProvider theme={theme}>
          <Container className="main-container">
            <div className="header">
              <div className="header-content">
                <div className="header-logos">
                   {/* <img 
                    src="https://www.eurobot.org/images/2020/Logo.png"
                    alt="Sail the world"
                    className="sailtheworld-logo"
                    style={{width: '10em'}} /> */}
                  <img 
                    src="/icons/icon_400.png"
                    alt="Sail the world"
                    className="eurobot-logo"
                    style={{width: '8em'}} />
                  <img
                    src="https://s.werobot.fr/logo.png"
                    alt="We Robot's logo"
                    className="werobot-logo"
                    style={{width: '8em'}} />
                </div>
                <div className="header-title">
                  {/* <Typography variant="h4">
                    {t('header.title')}
                  </Typography> */}
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
                          label={t('buoys.buoysInColoredFairway.title')+" (1pt)"}
                          type="number"
                          margin="dense"
                          name="buoysInColoredChannel"
                          onChange={this.computeScore}
                          helperText={t('buoys.buoysInColoredFairway.description')}
                        />
                        <TextField
                          fullWidth
                          label={t('buoys.buoysValidPairs.title')+" (2pts)"}
                          type="number"
                          margin="dense"
                          name="buoysValidPairs"
                          onChange={this.computeScore}
                          helperText={t('buoys.buoysValidPairs.description')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('windsocks.title')}
                        </FormLabel>
                        <RadioGroup name="windsocks" value={this.state.windsocks} 
                            onChange={this.computeScore}>
                          <FormControlLabel 
                            control={<Radio />}
                            value="none"
                            label={t('windsocks.none')} />
                          <FormControlLabel 
                            control={<Radio />}
                            value="one"
                            label={t('windsocks.one') + " (5pts)"} />
                          <FormControlLabel 
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
                            control={<Checkbox 
                              checked={this.state.lighthouseExists}
                              name="lighthouseExists"
                              onChange={this.computeScore} />}
                            label={t('lighthouse.exists')+" (2pts)"}
                          />
                          <FormControlLabel
                            control={<Checkbox 
                              checked={this.state.lighthouseEnabled}
                              disabled={!this.state.lighthouseCanBeEnabled}
                              onChange={this.computeScore}
                              name="lighthouseEnabled" />}
                            label={t('lighthouse.enabled')+" (3pts)"}
                          />
                          <FormControlLabel
                            control={<Checkbox 
                              checked={this.state.lighthouseDeployed}
                              disabled={!this.state.lighthouseCanBeDeployed || !this.state.lighthouseCanBeEnabled}
                              onChange={this.computeScore}
                              name="lighthouseDeployed" />}
                            label={t('lighthouse.deployed')+" (10pts)"}
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" color="red">
                          {t('orientation.title')}
                        </FormLabel>
                        <RadioGroup name="orientation" value={this.state.orientation}
                            onChange={this.computeScore}>
                          <FormControlLabel 
                            value="none"
                            control={<Radio />}
                            label={t('orientation.none')} />
                          <FormControlLabel
                            value="onlyOne"
                            control={<Radio />}
                            label={t('orientation.onlyOne') +" (5pts)"} />
                          <FormControlLabel
                            value="bad"
                            control={<Radio />}
                            label={t('orientation.bad') +" (5pts)"} />
                          <FormControlLabel
                            value="good"
                            control={<Radio />}
                            label={t('orientation.good') +" (10pts)"} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">
                          {t('flags.title')}
                        </FormLabel>
                        <RadioGroup name="flags" value={this.state.flags} 
                            onChange={this.computeScore}>
                          <FormControlLabel
                            value="none"
                            control={<Radio />}
                            label={t('flags.none')} />
                          <FormControlLabel
                            value="deployed"
                            control={<Radio />}
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
                    <Grid item xs={12} md={4}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">
                          {t('forfeit.title')}
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox
                              name="nonForfeit" 
                              onChange={this.computeScore}
                              checked={this.state.nonForfeit} />}
                            label={t('forfeit.nonForfeit')+" (5pts)"}
                          />
                        </FormGroup>
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