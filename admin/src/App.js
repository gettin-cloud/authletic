import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard/Dashboard';

export default function App() {
  return (
    <Dashboard />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
