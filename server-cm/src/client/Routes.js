import React from 'react';
import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminsListPage from './pages/AdminsListPage';

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
				...AdminsListPage, 
				path: '/admins'
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


