import React, {Fragment} from 'react';
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import {WordCount} from './pages/WordCount';

/**
 *
 * @return {*} Main application
 */
function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/" exact component={WordCount} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
