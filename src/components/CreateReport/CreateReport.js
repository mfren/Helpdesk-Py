import React from "react";
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { Button, makeStyles, Paper, TextField, Tooltip, Grid, Typography, CircularProgress } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import PageLimit from "../Layouts/PageLimit";
import FormSelector from "../FormSelector";
import {withAuth} from "../Manager/withAuth";
import {withManager} from "../Manager";
import * as CONDITIONS from "../../constants/authConditions";
import * as CONFIG_VALUES from "../../constants/reportValues";
import * as ROUTES from '../../constants/routes';


const useStyles = makeStyles((theme) => ({
    formContainer: {
        height: "min-content",
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    formLayout: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonWrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}));

const CreateReportBase = props => {
    const classes = useStyles();
    
    // State variables
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [cat, setCat] = React.useState("");
    const [urg, setUrg] = React.useState("");

    // These hold the state of the object when the form is sent to the server
    // this allows me to control the Loading Wheel
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    // Form Validation, this check that every field has been filled in
    let valid, tooltip;
    let missing = [];
    if (title === "") { missing.push(" Title") }
    if (desc === "") { missing.push(" Description") }
    if (cat === "") { missing.push(" Category") }
    if (urg === "") { missing.push(" Urgency") }

    valid = missing === [];

    if (valid) { tooltip = "" }
    else {
        // We then turn the missing items into a tooltip to be displayed
        tooltip = "Please Add:" + missing.toString();
    }

    // These handlers take the data from the text fields and puts it in the state variables
    const handleChange = {
        title: event => {
            setTitle(event.target.value);
        },
        desc: event => {
            setDesc(event.target.value);
        },
        cat: event => {
            setCat(event.target.value);
        },
        urg: event => {
            setUrg(event.target.value);
        }
    };

    // This function is called when the form is submitted, it formats the data and sends it to the server
    const submit = async function(event) {

        // First we change the state of the object to indicate that we are waiting.
        // This will trigger a redraw with the loading-wheel active
        if (!loading) {
            setSuccess(false);
            setLoading(true);
        }

        // We then call the function on the manager class to send the data to the server
        // I've also added some 'then' and 'catch' functions at the end which will be called when
        // the manager returns the promise.
        props.manager.request.postForm(title, desc, urg, cat)
            .then(function (id) {
                // If the promise comes back successful, we will change the loading states
                // which will trigger a redraw without the loading wheel, and then we want to
                // push the user to the new report they've created.
                setSuccess(true);
                setLoading(false);
                props.history.push(ROUTES.VIEW_REPORT + id)
            })
            .catch(function (error) {
                // If there's an error, we want to log that message (for debugging purposes)
                // And then change the loading states to redraw the page.
                // We can use the 'success' state to draw an error-indication on screen,
                // such as a red-button or message
                console.error(error);
                setLoading(false);
            })
    };

    // Fields that use 'CONFIG_VALUES.<VALUE>' are pulling information out of the constants file for this page
    // These values can be found at 'src/constants/reportValues.js'
    return (
        <PageLimit maxWidth="md">
            <Paper elevation={3} className={classes.formContainer}>
                <Typography component="h1" variant="h4" align="center">
                    Submit New Report
                </Typography>
                <Grid container direction="column" spacing={2} className={classes.formLayout}>
                    <Grid item>
                        <TextField label="Title"
                                   margin="dense"
                                   variant="filled"
                                   onChange={handleChange.title}
                                   fullWidth 
                                   helperText={CONFIG_VALUES.TITLE_HELP}/>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs>
                                <FormSelector
                                    title="Urgency"
                                    value={urg}
                                    onChange={handleChange.urg}
                                    values={CONFIG_VALUES.URGENCY}
                                    helperText={CONFIG_VALUES.URGENCY_HELP}
                                />
                            </Grid>
                            <Grid item xs>
                                <FormSelector
                                    title="Category"
                                    value={cat}
                                    onChange={handleChange.cat}
                                    values={CONFIG_VALUES.CATEGORY}
                                    helperText={CONFIG_VALUES.CATEGORY_HELP}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <TextField label="Description"
                                   margin="dense"
                                   variant="filled"
                                   onChange={handleChange.desc}
                                   multiline
                                   rows={6} 
                                   fullWidth 
                                   helperText={CONFIG_VALUES.DESCRIPTION_HELP}/>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">

                        </Grid>
                    </Grid>
                </Grid>
                {/*
                    The following component holds the button to submit the form to the database
                    It also holds the loading wheel,
                    it will use the 'loading' state to determine certain parts of its behaviour
                 */}
                <div className={classes.buttonContainer}>
                    <Tooltip title={tooltip}>
                        <div className={classes.buttonWrapper}>
                            <Button variant="contained" color="primary" disabled={loading || !valid} onClick={submit} className={buttonClassname}>
                                Submit
                            </Button>
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </Tooltip>
                </div>
            </Paper>
        </PageLimit>
    )
};

// This statement wraps the base component with several context before exposing it as an export.
// The 'withAuth' takes a authorisation condition and a component, it will only show the component
// if the auth condition is met. Read more about this at 'src/constants/authConditions.js'
export const CreateReport = withAuth(CONDITIONS.withAnyUser)(withManager(withRouter(CreateReportBase)));