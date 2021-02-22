import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {AppCache, AppCacheContext} from "./components/Cache";
import Manager, {ManagerContext} from "./components/Manager";

// This is an automatically generated root file for React,
// I've added my custom-contexts that wrap the whole component tree,
// as well as adding the BrowserRouter for React-Router

ReactDOM.render(
    <BrowserRouter>
        <ManagerContext.Provider value={new Manager()}>
            <AppCacheContext.Provider value={new AppCache()}>
                <App />
            </AppCacheContext.Provider>
        </ManagerContext.Provider>
    </BrowserRouter>,
    document.getElementById('root'));

registerServiceWorker();
