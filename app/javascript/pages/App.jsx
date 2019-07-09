import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Map from './components/map.jsx';

const App = () => (
  <Switch>
    <Route exact path="/" component={Map} />
  </Switch>
);

export default App;
