import React from 'react';
import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import NotFoundPage from './pages/NotFoundPage';


export default [
	{
		...App, // no path for App means that it will always be displayed
		routes: [
			{
				path: '/',
				...HomePage,
				exact: true
			},
			{
				...UsersListPage,
				path: '/users',
			},
			{
				...NotFoundPage
			}
		]
	}
];


