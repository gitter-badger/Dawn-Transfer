import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React from 'react';
// import NotFoundPage from '../components/404/404Page/'

import HomeRoute from '../features/homepage/home.routes'

export default () => (

    <BrowserRouter>
        <Switch>
            <HomeRoute/>
        </Switch>
    </BrowserRouter>

)
