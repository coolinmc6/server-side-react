# README

# Getting Started
- GitHub repo: [https://github.com/StephenGrider/ReactSSRCasts](https://github.com/StephenGrider/ReactSSRCasts)

## Why Server Side Rendering (L3)
- Browser requests page => Browser requests JS file => Content Visible
- Browser requests page => Browser requests JS file => React app boots, requests json => Content Visible
- loading the page as soon as possible
- server side rendering is designed to content rendered for the user as soon as possible

## Server Side Rendering (SSR) Overview (L4)

![alt text][logo]

[logo]: https://github.com/coolinmc6/server-side-react/blob/master/images/L04-ssr-flowchart.png  "Server Side React Flow"

# Let's Get Coding

## App Overview (L5)
- very basic app => not much functionality

## Server Architecture Approach (L6)
- we are running two separate servers
- API Server => already built for us
- Rendering Server => **this is what we make**
- Why two back-end servers?
- We are de-coupling the business logic and data layer from the view layer
	+ Business Logic & Data Layer
		* db access
		* validation
		* authentication
		* authorization
		* logging
	+ View Layer
		* take data
		* produce HTML
- server side rendering is slow and performance is a big concern

## Boilerplate Setup (L8)

## Breather and Review (L13)
- We encountered two major problems when trying to do server side rendering:
	+ JSX on the server => **solution:** run webpack on all our server side code and then execute
	the resulting bundle
	+ Turn components into HTML => **solution:** use the 'react-dom/server' libraries 'renderToString'
	function

# Server Configuration

## Rebuilding and Restarting (L14)
- we now need to update our code so that anytime we edit a file, we re-build / re-run our server
	+ we add `--watch` to our package.json file in the scripts section
- This is the script we added to our package.json file:
	+ `"dev:server": "nodemon --watch build --exec \"node build/bundle.js\""`

## Server Side Rendering, Isomorphic JavaScript, Universal Javascript (L15)
- Server Side Rendering => generate HTML on the server
- Universal JavaScript => the same code runs on the server and the browser
- Isomorphic JavaScript => same as Universal JavaScript
- NodeJS does not currently support ES2015 (ES6) and so we notice that in our `index.js` file (server-cm) we are
using require statements BUT in our `Home.js` file we use ES2015 modules
  - the point of SSR is that we can use the same "kind" of JavaScript for both the server side code and
  client side code
- Now that we are running webpack over ALL of our code, we can use the same module systems for both
- So....we are converting our require statements in our `index.js` file into ES2015 modules:

```js
// OLD CODE
const express = require('express');
const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const Home = require('./client/components/Home').default;

// NEW CODE
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from './client/components/Home';
```

## Client Side JS (L16)
- we saw that our setup is NOT sending our JavaScript to the client as well; only our HTML

## Client Bundles (L17)
- we'll need to setup two bundles
- setting up the second bundle didn't seem to bad...it just highlights my need to learn Webpack and better
understand the configuration of this stuff

## The Public Directory (L18)


## Why Client.js (L19)

- Server => index.js
- Browser => client.js ---> designed to *only* run on the browser
- client.js is going to the be the start-up file for the client
- the client.js file runs the React app and re-boots somewhat the html and takes over the event handlers, etc.

## Client Bootup (L20)
- We render the app once on the server and then we breathe life into it on the browser using the client.js
file
- This process is known as "hydration". The warning we get says that we should use `hydrate` and not `render`

# Refactoring for Cleaner Code

## Single Script Startup (L22)
- we combined the babel module into one "base" config and then merged both the client config and the 
server config with that base file
- We also eliminated the need to have three separate `dev` commands to run our development environment

## Ignoring Files with Webpack (L23)
- **this change isn't necessary but it does speed up start-time**

## Renderer Helper (L24)
- we need to split out or React

# Adding Navigation

## BrowserRouter vs. StaticRouter (L26)
- BrowserRouter requires the URL from the address bar which we don't have for server-side rendering
- we create a Routes.js file that directs the user based on which is server-rendered and which is
client-rendered

## Route Configuration (L27)


## HTML Mismatch (L28)
- click on little "i" to disable JS, you can see the server-rendered html is different than our client
HTML because of the Routes

## Routing Tiers (L30)
- changed '/' to '*' so that it accepts all routes and they are just passed along to React Router

# Integrating Support for Redux

## The Users API (L31)
- Users API: [https://react-ssr-api.herokuapp.com](https://react-ssr-api.herokuapp.com/)
- 

## Four Big Challenges (L32)
- Four Big Redux Challenges
	+ Redux needs different configuration on browser vs. server
	+ Aspects of authentication needs to be handled on server. Normally this is only on browser
		* cookie-based authentication, much trickier with server rendering
	+ Need some way to detect when all initial data load action creators are completed on server
		* probably the biggest challenge in server side rendering with Redux
	+ Need state rehydration on the browser

## Browser Store Creation (L33)
- we need to setup two separate copies of redux
- we'll make one inside our renderer file and one in our client
-

```js
// client.js

// import necessary helpers
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

// create store
const store = createStore(reducers, {}, applyMiddleware(thunk));

// wrap app in Provider
<Provider store={store}>
	<BrowserRouter >
		<Routes />
	</BrowserRouter>
</Provider>, 
```
- `reducers` doesn't exist yet but we're going to do the server side first

## Server Store Creation (L34)
- This section involved multiple steps:
	+ create a new file called `createStore`
	+ import that file in our `index.js` file, create a store, and pass that to our renderer function
		* this isn't yet complete but it's the basic frame for it
	+ update our `renderer.js` file to receive the store

```js
// createStore.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export default () => {
	const store = createStore(reducers, {}, applyMiddleware(thunk));

	return store;
}
```
- we're going to create our store in our route handler and then pass it to the renderer
- so instead of importing that into `renderer.js`, we'll import it into `index.js` in our server

```js
// index.js
// ... CODE
import createStore from './helpers/createStore'; // NEW

const app = express();

app.use(express.static('public'));
app.get('*', (req, res) => {
	const store = createStore();	// NEW

	// some logic to initialize and load data into the store

	res.send(renderer(req, store));	// send along store 
})
```

```js
// renderer.js
// ... CODE
import { Provider } from 'react-redux'; // NEW
import Routes from '../client/Routes';

export default (req, store) => {
	const content = renderToString(
		<Provider store={store}>
			<StaticRouter location={req.path} context={{}}>
				<Routes />
			</StaticRouter>
		</Provider>
	);
}
```


## FetchUsers Action Creator (L35)

## The Users Reducer (L36)

## Reducer Imports (L37)

## UsersList Component (L38)

## Babel Polyfill (L39)



# Server Side Data Loading

# Organization with Page Components

# Authentication in a Server Side Rendering World

# Error Handling

# Adding Better SEO Support

# Wrapup


