import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout/Layout';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <Route exact path="/" component={Layout}/>
    </Router>
  );
}
