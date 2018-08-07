import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './containers/home/Home';
import './App.css';

const App = () => (
  <Switch>
    <Route exact component={Home} path="/" />
  </Switch>
);

export default App;
