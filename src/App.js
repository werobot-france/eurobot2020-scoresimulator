import React from 'react';
import { Button, Switch, Container, Typography, Divider, TextField, Grid, FormControl, Paper, CardContent, Card } from '@material-ui/core'
import './style.css'

export default class App extends React.Component {
  
  render() {
    return (
      <div>
        <Container>
          <div className="header">
            <div className="header-content">
              <div class="header-logos">
                <img src="http://www.eurobot.org/media/eurobot.png" className="eurobot-logo" style={{width: '10em'}} />
                <img src="https://s.werobot.fr/logo.png" className="werobot-logo" style={{width: '10em'}} />
              </div>
              <div class="header-title">
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
          <Divider />
          <div class="form">
            <Grid container>
              <Grid item>
                <TextField
                  fullWidth="true"
                  label="Votre Estimation"
                  type="number"
                />
              </Grid>
              <Grid item>
                <Card>
                  <CardContent>
                    <Typography component="h5" variant="h5">
                      125
                    </Typography>
                    <Typography>
                      Points
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          <Divider />
        </Container>
      </div>
    );
  }
}
