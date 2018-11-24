import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
// import NotFoundPage from '../components/404/404Page/'

import HomeRoute from '../features/homepage/home.routes';
import DownloadRoute from '../features/download/download.routes';

import HomePage from '../features/homepage/HomePage';
import DownloadPageContainer from '../features/download/DownloadPageContainer';



export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route path="/download" component={DownloadPageContainer} />
		</Switch>
	</BrowserRouter>
);
