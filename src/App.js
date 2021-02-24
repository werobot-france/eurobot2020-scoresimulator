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
  Button,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import GitHubIcon from '@material-ui/icons/GitHub';
import GavelIcon from '@material-ui/icons/Gavel';
import './style.css'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { indigo, purple } from '@material-ui/core/colors';
import { withTranslation } from 'react-i18next';

const rules = {
  en: {
    master:'https://www.eurobot.org/images/2021/E2021_Rules_EN.pdf',
    junior: null
  },
  fr: {
    master: 'https://www.eurobot.org/images/2021/E2021_Rules_FR.pdf',
    junior: 'https://www.tropheesderobotique.fr/wp-content/uploads/2020/11/EJR2021_Rules_FR.pdf'
  }
}

const VERSION_KEY = 'eurobot2020_score.version'

const setQueryParam = (key, value) => {
  if (window.history.pushState) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' +key+'='+value;
      window.history.pushState({path:newurl},'',newurl);
  }
}

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

const NumberField = class NumberField extends React.Component {
  constructor(props) {
    super(props)
    this.maximum = props.maximum
    this.showDescription = props.showDescription || false

    this.state = {
      value: this.props.value,
      hasError: false,
      errorText: null
    }
  }

  handleInputFocus = (event) => {
    event.target.select()
  }

  handleKeyPress = (event) => {
    console.log(event.key)
  }

  notifyChange = () => {
    this.props.onChange({
      target: {
        type: 'number',
        value: this.state.value,
        name: this.props.name
      }
    })
  }

  setValue = (raw) => {
    let value = parseInt(raw)
    if (isNaN(value)) {
      value = 0
    }
    if (value < 0) {
      return
    }
    this.setState({ value }, this.notifyChange)
  }

  onChange = (event) => {
    this.setValue(event.target.value)
  }

  stepUp = () => {
    this.setValue(this.state.value + 1)
  }

  stepDown = () => {
    this.setValue(this.state.value - 1)
  }

  onKey = (event) => {
    if (event.key === 'ArrowUp') {
      this.stepUp()
    }
    if (event.key === 'ArrowDown') {
      this.stepDown()
    }
  }

  render() {
    const { name, label, hasExceededMaximum, maximumText, helperText } = this.props;
    return <TextField
      name={name}
      label={label}
      onChange={this.onChange}
      margin="normal"
      fullWidth
      value={this.state.value}
      onFocus={this.handleInputFocus}
      helperText={hasExceededMaximum ? maximumText : helperText}
      error={hasExceededMaximum}
      variant="outlined"
      onKeyDown={this.onKey}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={this.stepDown}
            >
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={this.stepUp}
              edge="end"
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  }
}

const App = class App extends React.Component {

  constructor(props) {
    super(props)
    let query = new URLSearchParams(window.location.search)
    let version = 'master'
    if (localStorage.getItem(VERSION_KEY) === 'junior') {
      version = localStorage.getItem(VERSION_KEY)
    }
    if (query.get('version') === 'junior' || query.get('version') === 'master') {
      version = query.get('version')
    }
    localStorage.setItem(VERSION_KEY, version)
    this.state = {
      version,
      framed: query.get('framed') === 'true',
      withoutHeader: query.get('without-header') === 'true',

      bonus: 0,
      nonForfeit: true,
      estimate: 0,
      penalties: 0,
      score: 0,
      totalScore: 5,

      // buoys
      buoysInPort: 0,
      buoysInColoredFairway: 0,
      buoysValidPairs: 0,

      // lighthouse
      lighthouseCanBeDeployed: false,
      lighthouseCanBeEnabled: false,
      lighthouseExists: false,
      lighthouseEnabled: false,
      lighthouseDeployed: false,

      // windsock
      windsocks: 'none',

      // anchor
      juniorAnchor: 'none',
      robotInGoodZone: 0,
      robotInBadZone: 0,

      flags: 'none',

      errors: {
        buoysInPort: '',
        buoysInColoredFairway: '',
        buoysValidPairs: '',

        robotInGoodZone: '',
        robotInBadZone: ''
      }
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
      let totalScore = 0;

      // Buoys
      totalScore += this.state.buoysInPort;
      totalScore += this.state.buoysInColoredFairway;
      totalScore += this.state.buoysValidPairs * 2;

      // Windsocks
      if (this.state.windsocks === 'one') {
        totalScore += 5
      }
      if (this.state.windsocks === 'both') {
        totalScore += 15
      }

      // Lighthouse
      let lighthouseCanBeEnabled = this.state.lighthouseExists
      let lighthouseCanBeDeployed = this.state.lighthouseEnabled
      if (this.state.lighthouseExists) {
        totalScore += 2
      }
      if (this.state.lighthouseExists && this.state.lighthouseEnabled) {
        totalScore += 3
      }
      if (this.state.lighthouseExists && this.state.lighthouseDeployed && this.state.lighthouseEnabled) {
        totalScore += 10
      }

      // Anchor
      if (this.state.version === 'master') {
        if ((this.state.robotInGoodZone + this.state.robotInBadZone) > 1) {
          // the team has two robots
          totalScore += 10 * this.state.robotInGoodZone
          totalScore += 3 * this.state.robotInBadZone
        } else {
          // the team has one robot
          totalScore += 20 * this.state.robotInGoodZone
          totalScore += 6 * this.state.robotInBadZone
        }
      }
      if (this.state.juniorAnchor === 'good') {
        totalScore += 20
      }
      if (this.state.juniorAnchor === 'bad') {
        totalScore += 6
      }

      // Flags
      if (this.state.flags === 'deployed') {
        totalScore += 10
      }

      let score = totalScore;
      let bonus = (0.30 * totalScore).toFixed(0) - (Math.abs(totalScore - this.state.estimate));
      bonus = (bonus < 0 ? 0 : bonus);
      totalScore += bonus;

      if (this.state.nonForfeit) {
        totalScore += 5; // 5 points default (nonForfeit)
      }

      totalScore -= 20 * this.state.penalties;

      if (totalScore < 0) {
        totalScore = 0;
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
    window.document.title = this.props.i18n.t('title')
  }

  switchVersion = (version) => {
    localStorage.setItem(VERSION_KEY, version)
    setQueryParam('version', version)
    this.setState({ version })
  }

  handleInputFocus = (event) => {
    event.target.select()
  }

  componentWillMount() {
    window.document.title = this.props.i18n.t('title')
  }

  render() {
    const { t } = this.props
    const rulesUrl = rules[this.props.i18n.language.substr(0, 2)][this.state.version]
    return (
      <div className={(this.state.framed ? 'framed' : '') + ' ' + (this.state.withoutHeader ? 'without-header' : '')}>
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
                    style={{ width: '8em' }} />
                  <img
                    src="https://s.werobot.fr/logo.png"
                    alt="We Robot's logo"
                    className="werobot-logo"
                    style={{ width: '8em' }} />
                </div>
                <div className="header-title">
                  {/* <Typography variant="h4">
                    {t('header.title')}
                  </Typography> */}
                  <div className="header-sub">
                    <div className="header-titles">
                      <div>
                        <Typography variant="h6">
                          {t('header.description')}
                        </Typography>
                        <Typography dangerouslySetInnerHTML={({ __html: t('header.author', { werobot: '<a href="https://werobot.fr">We Robot</a>' }) })}>
                        </Typography>
                      </div>
                    </div>
                    <div className="header-buttons-container">
                      <ButtonGroup size="small" color="primary" className="header-locale">
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
                      <ButtonGroup size="small" color="primary" className="header-version">
                        <Button
                          onClick={() => this.switchVersion('junior')}
                          disabled={this.state.version === 'junior'}>
                          {t('version.junior')}
                        </Button>
                        <Button
                          onClick={() => this.switchVersion('master')}
                          disabled={this.state.version === 'master'}>
                          {t('version.master')}
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
            <Divider style={{ marginBottom: '1.5em', marginTop: '1em' }} />
            <div className="form">
              <Grid container spacing={4}>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" className="textfield-list">
                              {t('buoys.title')}
                            </FormLabel>
                            <NumberField
                              name="buoysInPort"
                              label={t('buoys.inPort.title') + " (1pt)"}
                              value={this.state.buoysInPort}
                              onChange={this.computeScore}
                              hasExceededMaximum={this.state.buoysInPort > 37}
                              maximumText={t('buoys.inPort.maximum')}
                            />
                            <NumberField
                              name="buoysInColoredFairway"
                              label={t('buoys.inColoredFairway.title') + " (1pt)"}
                              value={this.state.buoysInColoredFairway}
                              helperText={t('buoys.inColoredFairway.description')}
                              onChange={this.computeScore}
                              hasExceededMaximum={this.state.buoysInColoredFairway > this.state.buoysInPort}
                              maximumText={t('buoys.inColoredFairway.maximum')}
                            />
                            <NumberField
                              name="buoysValidPairs"
                              label={t('buoys.validPairs.title') + " (2pts)"}
                              value={this.state.buoysValidPairs}
                              helperText={t('buoys.validPairs.description')}
                              onChange={this.computeScore}
                              hasExceededMaximum={this.state.buoysValidPairs > Math.floor(this.state.buoysInColoredFairway/2)}
                              maximumText={t('buoys.validPairs.maximum')}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" className="textfield-list">
                              {t('windsocks.title')}
                            </FormLabel>
                            <RadioGroup
                              name="windsocks"
                              value={this.state.windsocks}
                              onChange={this.computeScore}
                              className="custom-form-group-compact"
                            >
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
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" className="textfield-list">
                              {t('lighthouse.title')}
                            </FormLabel>
                            <FormGroup className="custom-form-group-compact">
                              <FormControlLabel
                                control={<Checkbox
                                  checked={this.state.lighthouseExists}
                                  name="lighthouseExists"
                                  onChange={this.computeScore} />}
                                label={t('lighthouse.exists') + " (2pts)"}
                              />
                              <FormControlLabel
                                control={<Checkbox
                                  checked={this.state.lighthouseEnabled}
                                  disabled={!this.state.lighthouseCanBeEnabled}
                                  onChange={this.computeScore}
                                  name="lighthouseEnabled" />}
                                label={t('lighthouse.enabled') + " (3pts)"}
                              />
                              <FormControlLabel
                                control={<Checkbox
                                  checked={this.state.lighthouseDeployed}
                                  disabled={!this.state.lighthouseCanBeDeployed || !this.state.lighthouseCanBeEnabled}
                                  onChange={this.computeScore}
                                  name="lighthouseDeployed" />}
                                label={t('lighthouse.deployed') + " (10pts)"}
                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} className="custom-division-2">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          {this.state.version === 'master' &&
                            <FormControl component="fieldset" style={{ width: '100%' }}>
                              <FormLabel component="legend" className="textfield-list">
                                {t('anchor.title')}
                              </FormLabel>
                              <NumberField
                                name="robotInGoodZone"
                                label={t('anchor.master.robotInGoodZone.title')}
                                value={this.state.robotInGoodZone}
                                showDescription={true}
                                onChange={this.computeScore}
                                hasExceededMaximum={this.state.robotInGoodZone + this.state.robotInBadZone > 2}
                                maximumText={''}
                              />
                              <NumberField
                                name="robotInBadZone"
                                label={t('anchor.master.robotInBadZone.title')}
                                value={this.state.robotInBadZone}
                                showDescription={true}
                                onChange={this.computeScore}
                                hasExceededMaximum={this.state.robotInGoodZone + this.state.robotInBadZone > 2}
                                maximumText={t('anchor.maximum')}
                              />
                            </FormControl>
                          }
                          {this.state.version === 'junior' &&
                            <FormControl component="fieldset">
                              <FormLabel component="legend" className="textfield-list">
                                {t('anchor.title')}
                              </FormLabel>
                              <RadioGroup name="juniorAnchor" value={this.state.juniorAnchor}
                                onChange={this.computeScore}>
                                <FormControlLabel
                                  value="none"
                                  control={<Radio />}
                                  label={t('anchor.junior.none')} />
                                <FormControlLabel
                                  value="bad"
                                  control={<Radio />}
                                  label={t('anchor.junior.bad') + " (6pts)"} />
                                <FormControlLabel
                                  value="good"
                                  control={<Radio />}
                                  label={t('anchor.junior.good') + " (20pts)"} />
                              </RadioGroup>
                            </FormControl>
                          }
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" className="textfield-list">
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
                                label={t('flags.raised') + " (10pts)"} />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" className="textfield-list">
                              {t('estimate.title')}
                            </FormLabel>
                            <NumberField
                              name="estimate"
                              label={t('estimate.value')}
                              value={this.state.estimate}
                              onChange={this.computeScore}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" className="textfield-list">
                              {t('forfeit.title')}
                            </FormLabel>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox
                                  name="nonForfeit"
                                  disabled
                                  onChange={this.computeScore}
                                  checked={this.state.nonForfeit} />}
                                label={t('forfeit.nonForfeit') + " (5pts)"}
                              />
                            </FormGroup>
                            <NumberField
                              name="penalties"
                              label={t('forfeit.penalties')}
                              value={this.state.penalties}
                              onChange={this.computeScore}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} className="score-container">
                  <Grid container spacing={1}>
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
            <Divider style={{ marginTop: '1.5em' }} />
            <div className="footer-container">
              <a
                className="footer-link footer-github"
                href="https://github.com/werobot-france/eurobot2020-scoresimulator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="icon">
                  <GitHubIcon />
                </div>
                <div className="description">
                  <Typography>{t('contribute.title')}</Typography>
                </div>
              </a>
              {rulesUrl !== null &&
                <a
                  className="footer-link footer-rules"
                  href={rulesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="icon">
                    <GavelIcon />
                  </div>
                  <div className="description">
                    <Typography>{t('rules.title')}</Typography>
                  </div>
                </a>
              }
            </div>
          </Container>
        </ThemeProvider>
      </div>
    );
  }
}

export default withTranslation()(App)