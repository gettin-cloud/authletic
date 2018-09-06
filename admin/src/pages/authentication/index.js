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
    height: 'calc(100% - 64px)'
  },
  gridContainer: {
    height: '100%'
  },
  contentGridItem: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2
  },
  menuGridItem: {
    borderRight: 'solid 1px #ddd',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
});

class Authentication extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={0} className={this.props.classes.gridContainer}>
          <Grid item className={this.props.classes.menuGridItem}>
            <AuthMenu />
          </Grid>
          <Grid item className={this.props.classes.contentGridItem}>
            <Typography variant="headline" gutterBottom>
              Users
            </Typography>
            <Divider/>
          </Grid>
        </Grid>
      </div>
  );
  }
}

Authentication = withStyles(styles)(Authentication);
export { Authentication };
