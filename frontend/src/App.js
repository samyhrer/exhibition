import React from 'react';
import {
  BrowserRouter,
  Match,
  Miss
} from 'react-router';
import RegisterScreen from './components/RegisterScreen';
import Terminal from './components/Terminal';

const App = () => (
  <BrowserRouter>
    <div className="App">
      <Match exactly pattern="/" component={ RegisterScreen } />
      <Match pattern="/terminal/:id" component={ Terminal } />
      <Miss component={ RegisterScreen } />
    </div>
  </BrowserRouter>
)

export default App;
