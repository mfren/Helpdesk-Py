import React from 'react';
import {Route, Switch} from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import SignUp from "./components/SignUp";
import CreateReport from "./components/CreateReport";
import ViewReport from "./components/ViewReport";
import NoMatch from "./components/NoMatch";
import * as ROUTES from "./constants/routes";


// These styles create the different sections for the Navigation Bar, the main content, and the Footer Bar.
// This is done wil the CSS Flex-Box, where the top and bottom will stay static at particular sizes,
// and the ContentContainer will grow depending on the size needed.
const useStyles = makeStyles({
    mainContainer: {
        display: "flex",
        flexFlow: "column",
        height: "100%",
    },
    headerContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
    },
    contentContainer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
    },
    footerContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "40px",
    },
    switch: {
        height: "100%"
    }
});

export default function App() {
    const classes = useStyles();

    // The Navigation and Footer are set outside of the Switch, as we want them to stay
    // the same regardless of which page we are currently viewing.

    // The Switch is provided by React Router and uses the URL to determine which page to display.
    // It can also be used to send users to different pages without the need to reload.

    return (
        <div className={classes.mainContainer}>
            <div className={classes.headerContainer}>
                <Navigation/>
            </div>
            <div className={classes.contentContainer}>
                <Switch className={classes.switch}>
                    <Route exact path={ROUTES.HOME}>
                        <Home/>
                    </Route>
                    <Route path={ROUTES.SIGN_IN}>
                        <SignIn/>
                    </Route>
                    <Route path={ROUTES.SIGN_UP}>
                        <SignUp/>
                    </Route>
                    <Route path={ROUTES.NEW_REPORT}>
                        <CreateReport/>
                    </Route>
                    <Route path={ROUTES.VIEW_REPORT + ":id"} component={ViewReport}/>
                    <Route path="*">
                        <NoMatch/>
                    </Route>
                </Switch>
            </div>
            <div className={classes.footerContainer}>
                {/* TODO Write a Footer */}
            </div>
        </div>
    );
}
