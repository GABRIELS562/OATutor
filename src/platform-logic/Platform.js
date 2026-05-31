import React from "react";
import { AppBar, Toolbar, IconButton, Tooltip, Box, Typography, Hidden } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GamificationStats from "../components/gamification/GamificationStats";
import ProblemWrapper from "@components/problem-layout/ProblemWrapper.js";
import LessonSelectionWrapper from "@components/problem-layout/LessonSelectionWrapper.js";
import { withRouter } from "react-router-dom";

import {
    coursePlans,
    findLessonById,
    LESSON_PROGRESS_STORAGE_KEY,
    MIDDLEWARE_URL,
    SITE_NAME,
    ThemeContext,
    MASTERY_THRESHOLD,
    SHOW_NOT_CANVAS_WARNING,
    CANVAS_WARNING_STORAGE_KEY,
} from "../config/config.js";
import to from "await-to-js";
import { toast } from "react-toastify";
import ToastID from "../util/toastIds";
import BrandLogoNav from "@components/BrandLogoNav";
import { cleanArray } from "../util/cleanObject";
import ErrorBoundary from "@components/ErrorBoundary";
import { CONTENT_SOURCE } from "@common/global-config";
import withTranslation from '../util/withTranslation';
import { LocalizationConsumer } from '../util/LocalizationContext';
import MobileNavigation from '../components/ui/MobileNavigation';
import { ErrorDisplay, OfflineBanner } from '../components/ui/ErrorDisplay';
import { LoadingSpinner, ProblemCardSkeleton } from '../components/ui/SkeletonLoader';
import { LanguageToggleMenu } from '../components/LanguageToggle';
import { ThemeToggleButton } from '../components/ThemeToggle';

let problemPool = require(`@generated/processed-content-pool/${CONTENT_SOURCE}.json`);

let seed = Date.now().toString();

// Duolingo-style mobile responsiveness
const mobileStyles = {
    appBar: {
        background: '#FFFFFF',
        boxShadow: 'none',
        borderBottom: '2px solid #E5E5E5',
    },
    toolbar: {
        minHeight: 64,
        padding: '0 16px',
    },
    toolbarMobile: {
        minHeight: 56,
        padding: '0 8px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    lessonTitle: {
        textAlign: 'center',
        paddingTop: '3px',
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: '#3C3C3C',
        fontWeight: 700,
        fontFamily: '"Nunito", sans-serif',
    },
    lessonTitleMobile: {
        fontSize: '12px',
        maxWidth: '150px',
    },
    statsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
    },
    statsContainerMobile: {
        gap: '4px',
    },
    masteryDisplay: {
        fontSize: '12px',
        marginLeft: '8px',
        whiteSpace: 'nowrap',
        color: '#3C3C3C',
        fontWeight: 700,
    },
    masteryDisplayMobile: {
        fontSize: '10px',
        marginLeft: '4px',
    },
    progressContainer: {
        padding: '10px 20px',
        background: '#FFFFFF',
        borderBottom: '2px solid #E5E5E5',
    },
    progressContainerMobile: {
        padding: '8px 12px',
    },
    mainContent: {
        backgroundColor: '#F8FAFC',
        paddingBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    completionMessage: {
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, rgba(123, 47, 247, 0.03) 0%, rgba(255, 255, 255, 1) 100%)',
        borderRadius: '16px',
        margin: '20px auto',
        maxWidth: '600px',
    },
    completionMessageMobile: {
        padding: '24px 16px',
        margin: '12px',
        borderRadius: '12px',
    },
};

class Platform extends React.Component {
    static contextType = ThemeContext;

    constructor(props, context) {
        super(props);

        this.problemIndex = {
            problems: problemPool,
        };
        this.completedProbs = new Set();
        this.lesson = null;

        this.user = context.user || {};
        console.debug("USER: ", this.user)
        this.isPrivileged = !!this.user.privileged;
        this.context = context;

        // Add each Q Matrix skill model attribute to each step
        for (const problem of this.problemIndex.problems) {
            for (
                let stepIndex = 0;
                stepIndex < problem.steps.length;
                stepIndex++
            ) {
                const step = problem.steps[stepIndex];
                step.knowledgeComponents = cleanArray(
                    context.skillModel[step.id] || []
                );
            }
        }

        this.state = {
            currProblem: null,
            status: "courseSelection",
            seed: seed,
            isLoading: false,
            loadingMessage: "",
            error: null,
            retryCount: 0,
            isOffline: !navigator.onLine,
            isMobile: window.innerWidth <= 600,
            isTablet: window.innerWidth <= 768 && window.innerWidth > 600,
            isTransitioning: false,
        };

        this.selectLesson = this.selectLesson.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        // Add resize listener
        this.handleResize = () => {
            this.setState({
                isMobile: window.innerWidth <= 600,
                isTablet: window.innerWidth <= 768 && window.innerWidth > 600,
            });
        };
        window.addEventListener('resize', this.handleResize);

        // Add online/offline listeners
        this.handleOnline = () => this.setState({ isOffline: false });
        this.handleOffline = () => this.setState({ isOffline: true });
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);

        const { enterCourse, exitCourse } = this.props;

        const isHomePage = this.props.history.location.pathname === '/';
        if (isHomePage) {
            exitCourse();
            this.onComponentUpdate(null, null, null);
            return;
        }

        if (this.props.lessonID != null) {
            const lesson = findLessonById(this.props.lessonID)
            console.debug("lesson: ", lesson)
            this.selectLesson(lesson).then(
                (_) => {
                    console.debug(
                        "loaded lesson " + this.props.lessonID,
                        this.lesson
                    );
                }
            );

            const course = coursePlans.find(c =>
                c.lessons.some(l => l.id === this.props.lessonID)
            );

            if (course) {
                enterCourse(course.courseName, course.language);
            }

        } else if (this.props.courseNum != null) {

            const course = coursePlans[parseInt(this.props.courseNum)];
            if (course) {
                enterCourse(course.courseName, course.language);
            }

            this.selectCourse(coursePlans[parseInt(this.props.courseNum)]);
        }

        this.onComponentUpdate(null, null, null);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.context.problemID = "n/a";
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const { enterCourse, exitCourse } = this.props;

        // If navigating to home, exit course context
        if (this.props.history.location.pathname === '/' &&
            prevProps.history.location.pathname !== '/') {
            exitCourse();
        }

        // If lesson changed, update course context
        if (this.props.lessonID !== prevProps.lessonID && this.props.lessonID != null) {
            const lesson = findLessonById(this.props.lessonID);
            const course = coursePlans.find(c =>
                c.lessons.some(l => l.id === this.props.lessonID)
            );

            if (course) {
                enterCourse(course.courseName, course.language);
            }
            if (lesson) {
                this.selectLesson(lesson, false);
            }
        }

        // If course changed
        if (this.props.courseNum !== prevProps.courseNum && this.props.courseNum != null) {
            const course = coursePlans[parseInt(this.props.courseNum)];
            if (course) {
                enterCourse(course.courseName, course.language);
            }
        }

        this.onComponentUpdate(prevProps, prevState, snapshot);
    }


    onComponentUpdate(prevProps, prevState, snapshot) {
        if (
            Boolean(this.state.currProblem?.id) &&
            this.context.problemID !== this.state.currProblem.id
        ) {
            this.context.problemID = this.state.currProblem.id;
        }
        if (this.state.status !== "learning") {
            this.context.problemID = "n/a";
        }
    }

    getProgressBarData() {
        if (!this.lesson) return { completed: 0, total: 0, percent: 0 };

        // Match problems where the lesson field contains the lesson name
        const lessonName = String(this.lesson.name.replace("Lesson ", "")).trim();
        const problems = this.problemIndex.problems.filter(
            ({ lesson }) => String(lesson).toLowerCase().includes(lessonName.toLowerCase())
        );
        const completed = this.completedProbs.size;
        const total = problems.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percent };
    }

    async selectLesson(lesson, updateServer = true) {
        const context = this.context;

        // Show loading state
        this.setState({
            isLoading: true,
            loadingMessage: "Loading lesson...",
            error: null,
        });

        console.debug("lesson: ", context)
        console.debug("update server: ", updateServer)
        console.debug("context: ", context)
        if (!this._isMounted) {
            console.debug("component not mounted, returning early (1)");
            return;
        }
        if (this.isPrivileged) {
            // from canvas or other LTI Consumers
            let err, response;
            [err, response] = await to(
                fetch(`${MIDDLEWARE_URL}/setLesson`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: context?.jwt || this.context?.jwt || "",
                        lesson,
                    }),
                })
            );
            if (err || !response) {
                this.setState({
                    isLoading: false,
                    error: {
                        type: 'network',
                        message: `Error setting lesson for assignment "${this.user.resource_link_title}"`,
                    },
                });
                toast.error(
                    `Error setting lesson for assignment "${this.user.resource_link_title}"`
                );
                console.debug(err, response);
                return;
            } else {
                if (response.status !== 200) {
                    switch (response.status) {
                        case 400:
                            const responseText = await response.text();
                            let [message, ...addInfo] = responseText.split("|");
                            if (
                                Array.isArray(addInfo) &&
                                addInfo[0].length > 1
                            ) {
                                addInfo = JSON.parse(addInfo[0]);
                            }
                            switch (message) {
                                case "resource_already_linked":
                                    toast.error(
                                        `${addInfo.from} has already been linked to lesson ${addInfo.to}. Please create a new assignment.`,
                                        {
                                            toastId:
                                                ToastID.set_lesson_duplicate_error.toString(),
                                        }
                                    );
                                    this.setState({ isLoading: false });
                                    return;
                                default:
                                    toast.error(`Error: ${responseText}`, {
                                        toastId:
                                            ToastID.expired_session.toString(),
                                        closeOnClick: true,
                                    });
                                    this.setState({ isLoading: false });
                                    return;
                            }
                        case 401:
                            toast.error(
                                `Your session has either expired or been invalidated, please reload the page to try again.`,
                                {
                                    toastId: ToastID.expired_session.toString(),
                                }
                            );
                            this.props.history.push("/session-expired");
                            this.setState({ isLoading: false });
                            return;
                        case 403:
                            toast.error(
                                `You are not authorized to make this action. (Are you an instructor?)`,
                                {
                                    toastId: ToastID.not_authorized.toString(),
                                }
                            );
                            this.setState({ isLoading: false });
                            return;
                        default:
                            toast.error(
                                `Error setting lesson for assignment "${this.user.resource_link_title}." If reloading does not work, please contact us.`,
                                {
                                    toastId:
                                        ToastID.set_lesson_unknown_error.toString(),
                                }
                            );
                            this.setState({ isLoading: false });
                            return;
                    }
                } else {
                    toast.success(
                        `Successfully linked assignment "${this.user.resource_link_title}" to lesson ${lesson.id} "${lesson.topics}"`,
                        {
                            toastId: ToastID.set_lesson_success.toString(),
                        }
                    );
                    const responseText = await response.text();
                    let [, ...addInfo] = responseText.split("|");
                    this.props.history.push(
                        `/assignment-already-linked?to=${addInfo.to}`
                    );
                }
            }
        }

        this.lesson = lesson;

        const loadLessonProgress = async () => {
            const { getByKey } = this.context.browserStorage;
            return await getByKey(
                LESSON_PROGRESS_STORAGE_KEY(this.lesson.id)
            ).catch((err) => { });
        };

        try {
            const [, prevCompletedProbs] = await Promise.all([
                this.props.loadBktProgress(),
                loadLessonProgress(),
            ]);

            if (!this._isMounted) {
                console.debug("component not mounted, returning early (2)");
                return;
            }
            if (prevCompletedProbs) {
                console.debug(
                    "student has already made progress w/ problems in this lesson before",
                    prevCompletedProbs
                );
                this.completedProbs = new Set(prevCompletedProbs);
            }
            this.setState(
                {
                    currProblem: this._nextProblem(
                        this.context ? this.context : context
                    ),
                    isLoading: false,
                    error: null,
                },
                () => {
                    //console.log(this.state.currProblem);
                    //console.log(this.lesson);
                }
            );
        } catch (error) {
            console.error("Error loading lesson:", error);
            this.setState({
                isLoading: false,
                error: {
                    type: 'generic',
                    message: 'Failed to load the lesson. Please try again.',
                    details: error.message,
                },
            });
        }
    }

    selectCourse = (course, context) => {
        this.course = course;
        this.setState({
            status: "lessonSelection",
        });
    };

    handleRetry = () => {
        const { lessonID, courseNum } = this.props;
        this.setState(prev => ({
            error: null,
            retryCount: prev.retryCount + 1,
        }));

        if (lessonID) {
            const lesson = findLessonById(lessonID);
            if (lesson) {
                this.selectLesson(lesson);
            }
        } else if (courseNum != null) {
            this.selectCourse(coursePlans[parseInt(courseNum)]);
        }
    };

    _nextProblem = (context) => {
        // Show transition loading
        this.setState({ isTransitioning: true });

        seed = Date.now().toString();
        this.setState({ seed: seed });
        this.props.saveProgress();
        const problems = this.problemIndex.problems.filter(
            ({ courseName }) => !courseName.toString().startsWith("!!")
        );
        let chosenProblem;

        console.debug(
            "Platform.js: sample of available problems",
            problems.slice(0, 10)
        );

        for (const problem of problems) {
            // Calculate the mastery for this problem
            let probMastery = 1;
            let isRelevant = false;
            for (const step of problem.steps) {
                if (typeof step.knowledgeComponents === "undefined") {
                    continue;
                }
                for (const kc of step.knowledgeComponents) {
                    if (typeof context.bktParams[kc] === "undefined") {
                        console.warn("BKT Parameter " + kc + " does not exist.");
                        continue;
                    }
                    if (kc in this.lesson.learningObjectives) {
                        isRelevant = true;
                    }
                    // Multiply all the mastery priors
                    if (!(kc in context.bktParams)) {
                        console.warn("Missing BKT parameter: " + kc);
                    }
                    probMastery *= context.bktParams[kc].probMastery;
                }
            }
            if (isRelevant) {
                problem.probMastery = probMastery;
            } else {
                problem.probMastery = null;
            }
        }

        console.debug(
            `Platform.js: available problems ${problems.length}, completed problems ${this.completedProbs.size}`
        );
        chosenProblem = context.heuristic(problems, this.completedProbs);
        console.debug("Platform.js: chosen problem", chosenProblem);

        const objectives = Object.keys(this.lesson.learningObjectives);
        console.debug("Platform.js: objectives", objectives);
        let score = objectives.reduce((x, y) => {
            return x + context.bktParams[y].probMastery;
        }, 0);
        score /= objectives.length;
        this.displayMastery(score);
        //console.log(Object.keys(context.bktParams).map((skill) => (context.bktParams[skill].probMastery <= this.lesson.learningObjectives[skill])));

        // There exists a skill that has not yet been mastered (a True)
        // Note (number <= null) returns false
        if (
            !Object.keys(context.bktParams).some(
                (skill) =>
                    context.bktParams[skill].probMastery <= MASTERY_THRESHOLD
            )
        ) {
            this.setState({ status: "graduated", isTransitioning: false });
            return null;
        } else if (chosenProblem == null) {
            console.debug("no problems were chosen");
            // We have finished all the problems
            if (this.lesson && !this.lesson.allowRecycle) {
                // If we do not allow problem recycle then we have exhausted the pool
                this.setState({ status: "exhausted", isTransitioning: false });
                return null;
            } else {
                this.completedProbs = new Set();
                chosenProblem = context.heuristic(
                    problems,
                    this.completedProbs
                );
            }
        }

        if (chosenProblem) {
            this.setState({
                currProblem: chosenProblem,
                status: "learning",
                isTransitioning: false
            });
            // console.log("Next problem: ", chosenProblem.id);
            console.debug("problem information", chosenProblem);
            this.context.firebase.startedProblem(
                chosenProblem.id,
                chosenProblem.courseName,
                chosenProblem.lesson,
                this.lesson.learningObjectives
            );
            return chosenProblem;
        } else {
            this.setState({ isTransitioning: false });
            console.debug("still no chosen problem..? must be an error");
        }
    };

    problemComplete = async (context) => {
        this.completedProbs.add(this.state.currProblem.id);
        const { setByKey } = this.context.browserStorage;
        await setByKey(
            LESSON_PROGRESS_STORAGE_KEY(this.lesson.id),
            this.completedProbs
        ).catch((error) => {
            this.context.firebase.submitSiteLog(
                "site-error",
                `componentName: Platform.js`,
                {
                    errorName: error.name || "n/a",
                    errorCode: error.code || "n/a",
                    errorMsg: error.message || "n/a",
                    errorStack: error.stack || "n/a",
                },
                this.state.currProblem.id
            );
        });

        if (this.lesson.enableCompletionMode) {
            const relevantKc = {};
            Object.keys(this.lesson.learningObjectives).forEach((x) => {
                relevantKc[x] = context.bktParams[x]?.probMastery ?? 0;
            });

            // Check if all problems are completed or all skills
            const progressData = this.getProgressBarData();
            const progressPercent = progressData.percent / 100;

            const allProblemsCompleted = progressData.completed === progressData.total;
            if (allProblemsCompleted) {
                console.debug("updateCanvas called because lesson is complete");
            }

            this.updateCanvas(progressPercent, relevantKc);
            this._nextProblem(context);
        } else {
            this._nextProblem(context);
        }
    };

    updateCanvas = async (mastery, components) => {
        if (this.context.jwt) {
            console.debug("updating canvas with problem score");

            let err, response;
            [err, response] = await to(
                fetch(`${MIDDLEWARE_URL}/postScore`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: this.context?.jwt || "",
                        mastery,
                        components,
                    }),
                })
            );
            if (err || !response) {
                toast.error(
                    `An unknown error occurred trying to submit this problem. If reloading does not work, please contact us.`,
                    {
                        toastId: ToastID.submit_grade_unknown_error.toString(),
                    }
                );
                console.debug(err, response);
            } else {
                if (response.status !== 200) {
                    switch (response.status) {
                        case 400:
                            const responseText = await response.text();
                            let [message, ...addInfo] = responseText.split("|");
                            if (
                                Array.isArray(addInfo) &&
                                addInfo.length > 0 &&
                                addInfo[0]
                            ) {
                                addInfo = JSON.parse(addInfo[0]);
                            }
                            switch (message) {
                                case "lost_link_to_lms":
                                    toast.error(
                                        "It seems like the link back to your LMS has been lost. Please re-open the assignment to make sure your score is saved.",
                                        {
                                            toastId:
                                                ToastID.submit_grade_link_lost.toString(),
                                        }
                                    );
                                    return;
                                case "unable_to_handle_score":
                                    toast.warn(
                                        "Something went wrong and we can't update your score right now. Your progress will be saved locally so you may continue working.",
                                        {
                                            toastId:
                                                ToastID.submit_grade_unable.toString(),
                                            closeOnClick: true,
                                        }
                                    );
                                    return;
                                default:
                                    toast.error(`Error: ${responseText}`, {
                                        closeOnClick: true,
                                    });
                                    return;
                            }
                        case 401:
                            toast.error(
                                `Your session has either expired or been invalidated, please reload the page to try again.`,
                                {
                                    toastId: ToastID.expired_session.toString(),
                                }
                            );
                            return;
                        case 403:
                            toast.error(
                                `You are not authorized to make this action. (Are you a registered student?)`,
                                {
                                    toastId: ToastID.not_authorized.toString(),
                                }
                            );
                            return;
                        default:
                            toast.error(
                                `An unknown error occurred trying to submit this problem. If reloading does not work, please contact us.`,
                                {
                                    toastId:
                                        ToastID.set_lesson_unknown_error.toString(),
                                }
                            );
                            return;
                    }
                } else {
                    console.debug("successfully submitted grade to Canvas");
                }
            }
        } else {
            const { getByKey, setByKey } = this.context.browserStorage;
            const showWarning =
                !(await getByKey(CANVAS_WARNING_STORAGE_KEY)) &&
                SHOW_NOT_CANVAS_WARNING;
            if (showWarning) {
                toast.warn(
                    "No credentials found (did you launch this assignment from Canvas?)",
                    {
                        toastId: ToastID.warn_not_from_canvas.toString(),
                        autoClose: false,
                        onClick: () => {
                            toast.dismiss(
                                ToastID.warn_not_from_canvas.toString()
                            );
                        },
                        onClose: () => {
                            setByKey(CANVAS_WARNING_STORAGE_KEY, 1);
                        },
                    }
                );
            } else {
                // can ignore
            }
        }
    };


    displayMastery = (mastery) => {
        this.setState({ mastery: mastery });
        if (mastery >= MASTERY_THRESHOLD) {
            toast.success("You've successfully completed this assignment!", {
                toastId: ToastID.successfully_completed_lesson.toString(),
            });
        }
    };

    render() {
        const { translate } = this.props;
        const { isMobile, isLoading, loadingMessage, error, retryCount, isOffline, isTransitioning } = this.state;

        this.studentNameDisplay = this.context.studentName
            ? decodeURIComponent(this.context.studentName) + " | "
            : translate('platform.LoggedIn') + " | ";

        // Get current lesson for mobile nav
        const currentLesson = this.props.lessonID ? findLessonById(this.props.lessonID) : null;

        return (
            <div style={mobileStyles.mainContent}>
                <AppBar position="static" style={mobileStyles.appBar}>
                    <Toolbar style={{
                        ...mobileStyles.toolbar,
                        ...(isMobile ? mobileStyles.toolbarMobile : {}),
                    }}>
                        <Grid
                            container
                            spacing={0}
                            role={"navigation"}
                            alignItems={"center"}
                            style={{ flexWrap: 'nowrap' }}
                        >
                            {/* Mobile Navigation Menu */}
                            <Hidden mdUp>
                                <Grid item style={{ marginRight: '8px' }}>
                                    <MobileNavigation
                                        currentLesson={currentLesson}
                                        courseNum={this.props.courseNum}
                                    />
                                </Grid>
                            </Hidden>

                            {/* Logo - smaller on mobile */}
                            <Grid item xs={isMobile ? 6 : 4} sm={3} key={1}>
                                <BrandLogoNav
                                    isPrivileged={this.isPrivileged}
                                />
                            </Grid>

                            {/* Lesson name - hidden on mobile */}
                            <Hidden smDown>
                                <Grid item sm={6} key={2} className="lesson-title-container">
                                    <div style={mobileStyles.lessonTitle}>
                                        {Boolean(
                                            findLessonById(this.props.lessonID)
                                        )
                                            ? findLessonById(this.props.lessonID)
                                                .name +
                                            " " +
                                            findLessonById(this.props.lessonID)
                                                .topics
                                            : ""}
                                    </div>
                                </Grid>
                            </Hidden>

                            {/* Stats and navigation - takes more space on mobile */}
                            <Grid item xs={isMobile ? 6 : 8} sm={3} key={3}>
                                <div style={{
                                    ...mobileStyles.statsContainer,
                                    ...(isMobile ? mobileStyles.statsContainerMobile : {}),
                                }}>
                                    {/* Gamification Stats (compact on mobile) */}
                                    <GamificationStats
                                        compact={true}
                                        onClick={() => this.props.history.push('/dashboard')}
                                    />

                                    {/* Language Toggle */}
                                    <LanguageToggleMenu iconColor="#3C3C3C" />

                                    {/* Theme Toggle (Dark/Light) */}
                                    <ThemeToggleButton iconColor="#3C3C3C" size="small" />

                                    {/* Dashboard Button - hidden on very small screens */}
                                    {!isMobile && (
                                        <Tooltip title="My Progress Dashboard">
                                            <IconButton
                                                size="small"
                                                onClick={() => this.props.history.push('/dashboard')}
                                                style={{
                                                    color: '#3C3C3C',
                                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                                    padding: '8px',
                                                }}
                                            >
                                                <DashboardIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {/* Mastery Display - simplified on mobile */}
                                    {this.state.status !== "courseSelection" &&
                                        this.state.status !== "lessonSelection" &&
                                        (this.lesson?.showStuMastery == null ||
                                            this.lesson?.showStuMastery) && (
                                            <div style={{
                                                ...mobileStyles.masteryDisplay,
                                                ...(isMobile ? mobileStyles.masteryDisplayMobile : {}),
                                            }}>
                                                {!isMobile && this.studentNameDisplay}
                                                {isMobile ? '' : translate('platform.Mastery')}
                                                {Math.round(this.state.mastery * 100)}%
                                            </div>
                                        )}
                                </div>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

                {/* Progress Bar */}
                {this.lesson?.enableCompletionMode && (
                    <div style={{
                        ...mobileStyles.progressContainer,
                        ...(isMobile ? mobileStyles.progressContainerMobile : {}),
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: isMobile ? 11 : 12,
                            marginBottom: 4,
                            color: '#64748B',
                        }}>
                            <span>Progress</span>
                            <span>{this.getProgressBarData().percent}% ({this.getProgressBarData().completed}/{this.getProgressBarData().total})</span>
                        </div>
                        <LinearProgress
                            variant="determinate"
                            value={this.getProgressBarData().percent}
                            style={{
                                height: isMobile ? 6 : 10,
                                borderRadius: isMobile ? 3 : 5,
                            }}
                        />
                    </div>
                )}

                {/* Offline Banner */}
                {isOffline && (
                    <OfflineBanner onRetry={() => window.location.reload()} />
                )}

                {/* Loading State */}
                {isLoading && (
                    <LoadingSpinner text={loadingMessage || "Loading..."} />
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <ErrorDisplay
                        type={error.type || 'generic'}
                        title={error.title}
                        message={error.message}
                        onRetry={this.handleRetry}
                        onSecondaryAction={() => this.props.history.push('/')}
                        secondaryActionLabel="Go Home"
                        retryCount={retryCount}
                        maxRetries={3}
                        showDetails={error.details != null}
                        errorDetails={error.details}
                    />
                )}

                {/* Main Content */}
                {!isLoading && !error && (
                    <>
                        {this.state.status === "courseSelection" ? (
                            <LessonSelectionWrapper
                                selectLesson={this.selectLesson}
                                selectCourse={this.selectCourse}
                                history={this.props.history}
                                removeProgress={this.props.removeProgress}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.status === "lessonSelection" ? (
                            <LessonSelectionWrapper
                                selectLesson={this.selectLesson}
                                removeProgress={this.props.removeProgress}
                                history={this.props.history}
                                courseNum={this.props.courseNum}
                            />
                        ) : (
                            ""
                        )}
                        {this.state.status === "learning" ? (
                            <>
                                {isTransitioning ? (
                                    <Box py={4}>
                                        <ProblemCardSkeleton />
                                    </Box>
                                ) : (
                                    <ErrorBoundary
                                        componentName={"Problem"}
                                        descriptor={"problem"}
                                    >
                                        <ProblemWrapper
                                            problem={this.state.currProblem}
                                            problemComplete={this.problemComplete}
                                            lesson={this.lesson}
                                            seed={this.state.seed}
                                            lessonID={this.props.lessonID}
                                            displayMastery={this.displayMastery}
                                            progressPercent={this.getProgressBarData().percent / 100}
                                        />
                                    </ErrorBoundary>
                                )}
                            </>
                        ) : (
                            ""
                        )}
                        {this.state.status === "exhausted" ? (
                            <Box style={{
                                ...mobileStyles.completionMessage,
                                ...(isMobile ? mobileStyles.completionMessageMobile : {}),
                            }}>
                                <Typography variant={isMobile ? "h5" : "h4"} style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>
                                    Well Done!
                                </Typography>
                                <Typography style={{ color: '#64748B', lineHeight: 1.6 }}>
                                    Thank you for learning with {SITE_NAME}. You have
                                    finished all problems in this lesson.
                                </Typography>
                            </Box>
                        ) : (
                            ""
                        )}
                        {this.state.status === "graduated" ? (
                            <Box style={{
                                ...mobileStyles.completionMessage,
                                ...(isMobile ? mobileStyles.completionMessageMobile : {}),
                            }}>
                                <Typography variant={isMobile ? "h5" : "h4"} style={{ fontWeight: 600, color: '#10B981', marginBottom: 12 }}>
                                    Congratulations!
                                </Typography>
                                <Typography style={{ color: '#64748B', lineHeight: 1.6 }}>
                                    Thank you for learning with {SITE_NAME}. You have
                                    mastered all the skills for this session!
                                </Typography>
                            </Box>
                        ) : (
                            ""
                        )}
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(withTranslation((props) => (
    <LocalizationConsumer>
        {({ language, enterCourse, exitCourse }) => (
            <Platform
                {...props}
                language={language}
                enterCourse={enterCourse}
                exitCourse={exitCourse}
            />
        )}
    </LocalizationConsumer>
)));
