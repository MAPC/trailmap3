import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Map from './components/map.jsx';
import Header from './components/header';

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={Map} />
  </Switch>
  </div>
);

export default App;
