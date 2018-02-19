# README

# Getting Started
- GitHub repo: [https://github.com/StephenGrider/ReactSSRCasts](https://github.com/StephenGrider/ReactSSRCasts)
- Important links:
	+ Users API: [https://react-ssr-api.herokuapp.com](https://react-ssr-api.herokuapp.com/)

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

## Detecting Data Load Completion (40)

- using `componentDidMount()` doesn't work on server side; lifecycle methods don't run

## Solution #1 for Data Loading (41)
- one point of server-side rendering is that we can put content on the screen immediately

## Solution #2 for Data Loading (42)
- this is the popular solution to the last video's problem
- updated Routes file to use new format for server-side rendering: an array of objects

## The React Router Config Library (43)
- updated `renderer.js` so that it imports the Routes differently using the renderRoutes method
from react router

## Updating Route Uses (44)

## The MatchRoutes Function (45)
- import `matchRoutes` into `client/index.js`

## LoadData Functions (46)
- we now have to modify three files to load the data without having to render our app.
- Normally, we could just do componentDidMount() and we'd be fine

## Store Dispatch (47)
- **this is the hardest part of SSR**
- These are the steps:
	+ `index.js` (server): we are going to call the loadData function, passing in the redux store
	+ `loadData()` function (in components): manually dispatch action creator
	+ `loadData()` function (in components): we're going to pass the action to redux store
	+ `loadData()` function (in components): from this call, we'll return a promis
	+ `index.js` (server): back inside the index.js, we wait for promis to resolve
	+ `index.js` (server): then render the app
- 

## Waiting for Data Load Completion (48)
- by this point we can successfully loadData and have an array of promises

## Breather and Review (L49)
- the connect function works with the Provider tag 
- we are not using the connect tag because it only works with the Provider and in our situation, 
we need to use Redux before any rendering
- why are we using the dispatch function?


# Organization with Page Components

## The Page Approach (L50)

## Refactoring Pages (L51)

```js
// Routes.js
import React from 'react';
import HomePage from './pages/HomePage';
import UsersListPage, { loadData } from './pages/UsersListPage';

export default [
	{
		path: '/',
		// component: HomePage,
		...Home, // ES6 => we are now using the spread operator to bring the 'Home' component
		exact: true
	},
	{
		loadData, // <= ES6
		path: '/users',
		component: UsersListPage
	}
];

// pages/HomePage.js
import React from 'react';

const Home = () => {
	return (
		<div>
			<div>I'm the home BEST EVER component</div>
			<button onClick={() => console.log('Hi there!')}>Press Me!</button>
		</div>

	)
}


export default {
	component: Home
}

```
- Instead of exporting the entire 'Home' component (function), we are exporting an object with a property
`component` that has a value of the `Home` component
  - we will probably create a loadData property shortly
- Notice that the spread operator is adding the exported object's properties directly into the two Routes
objects. We are setting the load data and component properties in the components/pages themselves
- Here is the final Routes array:

```js
export default [
	{
		path: '/',
		...HomePage,
		exact: true
	},
	{
		...UsersListPage,
		path: '/users',
	}
];
```


## Refactoring Page Exports (L52)

## Client State Rehydration (L53)
- We are getting this warning: `bundle.js:2940 Warning: Did not expect server HTML to contain a <li> in <ul>`

## More on Client State Rehydration (L54)
- In the last video we realized that our client side react app is clearing out the page temporarily
because none of our server side state from the redux store is being communicated down to the browser
- We are going to take all of our state out of the redux store, dump it into the html template, and then
use that to initialize our store on the client side

## Dumping State to Templates (L55)
```js
// renderer.js

// we updated our template to include the script tag where we initialized our state
return `
	<html>
		<head></head>
		<body>
			<div id="root">${content}</div>
			<script>
			window.INITIAL_STATE = ${JSON.stringify(store.getState())}
			</script>
			<script src="bundle.js"></script>
		</body>
	</html>
`;

// client.js
// and then instead of initializing our store with a blank object, with initialized it with
// our INITIAL_STATE object
const store = createStore(reducers, window.INITIAL_STATE, applyMiddleware(thunk));

```

## Mitigating XSS Attacks (L56)
- adding `serialize` to renderer to prevent the insertion of script tags

# Authentication in a Server Side Rendering World

## Authentication Issues (L57)
- all cookies correspond to the domain, subdomain and port that issued it

## Authentication via Proxy (L58)
- the browser thinks its communicating with the API server but it's really communicating with the
render server

## Why Not JWT's? (L59)
- why not JWT?
- For JWT's to work, we'd make the request, the Renderer would ask for the JWT, the browser would give
the JWT, and then the Renderer would provide the content
- we'd essentially no longer be able to provide content right away
- this is why we are using cookies and not JWT
- To do server side rendering properly with authentication, it must be cookie-based so that the 
authentication token (cookie) is sent on the initial request

## Proxy Setup (L60)
- the goal of server side rendering or for it to be called an isomorphic web app is to write the 
exact same code that gets executed on BOTH the server and the browser
- express-http-proxy

## Renderer to API Communication (L61)
- we want axios to act differently depending on whether we are on the server or not
- instead of essentially writing an if-else statement for every action creator, we are going to do
something a little different

## Axios Instances with Redux Thunk (L62)

## Client Axios Instance (L63)
- we created an axiosInstance that has a baseURL of `/api` which means that `/api` is prepended to 
every request

```js
// client.js
const axiosInstance = axios.create({
	baseURL: '/api'
})

// action creator => index.js
// updated with the new thunk.withExtraArgument() function including the original dispatch, 
//   the getState function, and our api
export const fetchUsers = () => async (dispatch, getState, api) => {
	const res = await api.get('/users');

	dispatch({
		type: FETCH_USERS,
		payload: res
	});
}

```


## Server Axios Instance (L64)

## The Header Component (L65)

## Adding an App Component (L66)

## Building the Header (L67)

## Fetching Auth Status (L68)

## Calling FetchCurrentUser (L69)

## Connecting the Header (L70)

## Header Customization (L71)

## Header Styling (L72)

# Error Handling

# Adding Better SEO Support

# Wrapup


