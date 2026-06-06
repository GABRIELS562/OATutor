import React from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import BrandLogoNav from "@components/BrandLogoNav";
import Spacer from "@components/Spacer";
import { useLocalization } from "../util/LocalizationContext";

const SessionExpired = () => {
    const localization = useLocalization();
    const translate = localization?.translate || ((key) => {
        const fallbacks = {
            'sessionExpired.title': 'Oops, something went wrong!',
            'sessionExpired.subtitle': 'It looks like your session has expired.',
            'sessionExpired.studentInstructions': 'If you are a student, please reload the page or open the page from your LMS again.',
            'sessionExpired.instructorInstructions': 'If you are an instructor, please reload the page or create a new assignment.',
        };
        return fallbacks[key] || key;
    });

    return <>
        <div style={{ backgroundColor: "#F6F6F6", paddingBottom: 20 }}>
            <AppBar position="static">
                <Toolbar>
                    <Grid container spacing={0} role={"navigation"}>
                        <Grid item xs={3} key={1}>
                            <BrandLogoNav noLink={true}/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box width="75%" maxWidth={1500}>
                        <center>
                            <h1>{translate('sessionExpired.title')}</h1>
                            <h2>{translate('sessionExpired.subtitle')}</h2>
                        </center>
                        <Divider/>
                        <center>
                            <Spacer/>
                            <p>{translate('sessionExpired.studentInstructions')}</p>
                            <Spacer/>
                            <p>{translate('sessionExpired.instructorInstructions')}</p>
                            <Spacer height={24 * 3}/>
                        </center>
                    </Box>
                </Grid>
            </div>
        </div>
    </>
}

export default SessionExpired
