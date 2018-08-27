import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './Layout/Layout';

export default function App() {
  return (
    <Layout />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
