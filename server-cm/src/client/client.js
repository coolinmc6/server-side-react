// Startup point for the client side application
import React from 'react';
import ReactDOM from 'react-dom';
// import Home from './components/Home'; => no longer need
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes'

ReactDOM.hydrate(
	<BrowserRouter >
		<Routes />
	</BrowserRouter>, 
	document.querySelector('#root'));


