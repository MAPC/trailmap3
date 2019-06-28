import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Map from './components/map.jsx';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Map} />
    </Switch>
  </div>
);

export default App;
