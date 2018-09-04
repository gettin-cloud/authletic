import React from 'react';

import { NavLink } from '../../shared/nav-link';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  link: {
    textDecoration: 'none',
  },
});

export const MainMenu = withStyles(styles)(({ classes }) => (
  <React.Fragment>
    <Divider />
    <List>
      <NavLink exact to={'/'}>{({ active }) => (
        <ListItem button selected={active}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      )}
      </NavLink>
      <ListSubheader>Your APIs</ListSubheader>
      <NavLink to={'/auth'}>{({ active }) => (
        <ListItem button selected={active}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Authentication" />
        </ListItem>
      )}
      </NavLink>
    </List>
    <Divider />
  </React.Fragment>
));
