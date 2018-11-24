import {  Route } from 'react-router-dom'
import React from 'react';
import HomepageContainer from './HomepageContainer';

export default () => (
    <Route exact path="/" component={HomepageContainer} />
)