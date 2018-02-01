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

# Refactoring for Cleaner Code

# Adding Navigation

# Integrating Support for Redux

# Server Side Data Loading

# Organization with Page Components

# Authentication in a Server Side Rendering World

# Error Handling

# Adding Better SEO Support

# Wrapup


