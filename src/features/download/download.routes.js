import {  Route } from 'react-router-dom'
import React from 'react';

import DownloadPage from './DownloadPage';

export default () => (
    <Route path ="*" component={DownloadPage} />
)