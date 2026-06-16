import React, { useContext } from "react";
import { findLessonById, _lessonPlansNoEditor, ThemeContext } from "../config/config";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import BrandLogoNav from "@components/BrandLogoNav";
import Spacer from "@components/Spacer";
import { useLocalization } from "../util/LocalizationContext";

const AssignmentAlreadyLinked = (props) => {
    const lessonPlans = _lessonPlansNoEditor;
    const context = useContext(ThemeContext)
    const { t } = useLocalization();

    const _linkedLesson = +context.alreadyLinkedLesson
    const linkedLesson = !isNaN(_linkedLesson)
        ? lessonPlans[+context.alreadyLinkedLesson]
        : context.alreadyLinkedLesson.length > 1 ?
            findLessonById(context.alreadyLinkedLesson) :
            null

    console.debug("linkedLesson", linkedLesson)

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
                            {linkedLesson
                                ? <h1>{t('assignment.linkedWithLesson').replace('{lessonName}', `${linkedLesson.name} ${linkedLesson.topic}`)}</h1>
                                : <h1>{t('assignment.linkedSuccessfully')}</h1>
                            }
                            <h2>{t('assignment.newLessonInstructions')}</h2>
                            <h2>{t('assignment.previewInstructions')}</h2>
                        </center>
                        <Divider/>
                        <center>
                            <Spacer/>
                            {linkedLesson
                                && <>
                                    <p>{t('assignment.courseName')}: {linkedLesson.courseName}</p>
                                    <p>{t('assignment.lessonName')}: {linkedLesson.name} {linkedLesson.topics}</p>
                                </>
                            }
                            <Spacer height={24 * 4}/>
                        </center>
                    </Box>
                </Grid>
            </div>
        </div>
    </>
}

export default AssignmentAlreadyLinked
