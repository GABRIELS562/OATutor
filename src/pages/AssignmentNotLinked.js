import React  from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import BrandLogoNav from "@components/BrandLogoNav";
import Spacer from "@components/Spacer";
import { SITE_NAME } from "../config/config";
import { useLocalization } from "../util/LocalizationContext";

const AssignmentNotLinked = () => {
    const { t } = useLocalization();

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
                            <h1>{t('assignment.welcome').replace('{SITE_NAME}', SITE_NAME.replace(/\s/, ""))}</h1>
                            <h2>{t('assignment.notLinkedMessage')}</h2>
                        </center>
                        <Divider/>
                        <center>
                            <Spacer/>
                            <p>{t('assignment.checkBackLater')}</p>
                            <Spacer height={24 * 3}/>
                        </center>
                    </Box>
                </Grid>
            </div>
        </div>
    </>
}

export default AssignmentNotLinked
