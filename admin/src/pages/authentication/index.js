import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

import { AuthMenu } from './menu';


const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 3,
    backgroundColor: theme.palette.grey
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Authentication extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="headline" gutterBottom>
          Authentication
        </Typography>
        <Divider/>
        <Grid container spacing={24}>
          <Grid item>
            <AuthMenu />
          </Grid>
          <Grid item>
            <Paper className={this.props.classes.paper}>Content</Paper>
          </Grid>
        </Grid>
      </div>
  );
  }
}

Authentication = withStyles(styles)(Authentication);
export { Authentication };
