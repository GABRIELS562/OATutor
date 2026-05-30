/**
 * AITutor - Chat interface for AI tutor
 *
 * Bilingual (EN/AF), subscription-gated, with usage cap.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    CircularProgress,
    Chip,
    LinearProgress,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import RefreshIcon from '@material-ui/icons/Refresh';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import aiTutor from '../../services/AITutorService';
import SubscriptionService from '../../services/SubscriptionService';
import AIFeedback from './AIFeedback';
import { AI_TUTOR_MESSAGES, getCapResetDate } from '../../config/aiTutorConfig';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 600,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    usageInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
    },
    usageChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    messageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%',
    },
    messageWrapperUser: {
        alignSelf: 'flex-end',
    },
    messageWrapperAssistant: {
        alignSelf: 'flex-start',
    },
    message: {
        padding: theme.spacing(1.5, 2),
        borderRadius: 16,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    },
    userMessage: {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        borderBottomRightRadius: 4,
    },
    assistantMessage: {
        backgroundColor: theme.palette.grey[100],
        borderBottomLeftRadius: 4,
    },
    inputContainer: {
        padding: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
    },
    sendButton: {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        '&:disabled': {
            backgroundColor: theme.palette.grey[300],
        },
    },
    thinking: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        padding: theme.spacing(1.5, 2),
        color: theme.palette.text.secondary,
    },
    capReached: {
        padding: theme.spacing(3),
        textAlign: 'center',
        backgroundColor: theme.palette.warning.light,
    },
    lockedOverlay: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        textAlign: 'center',
    },
}));

function AITutor({ userId, language = 'en', subject = null, topicId = null, problemId = null }) {
    const classes = useStyles();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [usage, setUsage] = useState({ messagesUsed: 0, messagesCap: 100, remaining: 100 });
    const [hasAccess, setHasAccess] = useState(null);
    const [capReached, setCapReached] = useState(false);

    const msg = AI_TUTOR_MESSAGES[language] || AI_TUTOR_MESSAGES.en;

    useEffect(() => {
        checkAccess();
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkAccess = async () => {
        if (!userId) {
            setHasAccess(false);
            return;
        }

        try {
            // Check subscription
            const subAccess = await SubscriptionService.checkAccess(userId);
            if (!subAccess.hasAccess) {
                setHasAccess(false);
                return;
            }

            // Check AI cap
            const aiAccess = await aiTutor.checkAccess(userId);
            setHasAccess(aiAccess.allowed);
            setCapReached(!aiAccess.allowed && aiAccess.reason === 'cap_reached');
            setUsage({
                messagesUsed: aiAccess.used,
                messagesCap: aiAccess.cap,
                remaining: aiAccess.remaining || 0,
            });
        } catch (error) {
            console.error('Error checking AI access:', error);
            setHasAccess(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() || loading || !hasAccess) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message to UI
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const result = await aiTutor.sendMessage(
                userId,
                userMessage,
                messages,
                {
                    language,
                    subject,
                    sessionId,
                    stream: false, // Could enable streaming for better UX
                }
            );

            // Add assistant message
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: result.response,
                    messageId: result.messageId,
                },
            ]);

            // Update usage
            setUsage(result.usage);
            setSessionId(result.sessionId);

            // Check if cap reached
            if (result.usage.remaining <= 0) {
                setCapReached(true);
            }
        } catch (error) {
            console.error('AI error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: error.message || msg.networkError,
                    isError: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
    };

    // Loading state
    if (hasAccess === null) {
        return (
            <Paper className={classes.container}>
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    // No subscription
    if (!hasAccess && !capReached) {
        return (
            <Paper className={classes.container}>
                <Box className={classes.lockedOverlay}>
                    <Typography variant="h6" gutterBottom>
                        {msg.subscriptionRequired}
                    </Typography>
                </Box>
            </Paper>
        );
    }

    const usagePercent = (usage.messagesUsed / usage.messagesCap) * 100;

    return (
        <Paper className={classes.container} elevation={3}>
            {/* Header */}
            <Box className={classes.header}>
                <Box>
                    <Typography variant="h6">{msg.title}</Typography>
                    <Typography variant="body2" style={{ opacity: 0.8 }}>
                        {msg.subtitle}
                    </Typography>
                </Box>
                <Box className={classes.usageInfo}>
                    <Tooltip title={msg.capInfo(usage.messagesUsed, usage.messagesCap)}>
                        <Chip
                            size="small"
                            label={`${usage.messagesUsed}/${usage.messagesCap}`}
                            className={classes.usageChip}
                            icon={<InfoOutlinedIcon style={{ color: '#fff' }} />}
                        />
                    </Tooltip>
                    <IconButton size="small" onClick={handleNewChat} style={{ color: '#fff' }}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Usage bar */}
            <LinearProgress
                variant="determinate"
                value={usagePercent}
                color={usagePercent > 80 ? 'secondary' : 'primary'}
            />

            {/* Cap reached warning */}
            {capReached && (
                <Box className={classes.capReached}>
                    <Typography variant="body1">{msg.capReached}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {msg.resetDate(getCapResetDate().toLocaleDateString(language === 'af' ? 'af-ZA' : 'en-ZA'))}
                    </Typography>
                </Box>
            )}

            {/* Messages */}
            <Box className={classes.messagesContainer}>
                {messages.length === 0 && !loading && (
                    <Typography color="textSecondary" align="center" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        {msg.placeholder}
                    </Typography>
                )}

                {messages.map((message, index) => (
                    <Box
                        key={index}
                        className={`${classes.messageWrapper} ${
                            message.role === 'user' ? classes.messageWrapperUser : classes.messageWrapperAssistant
                        }`}
                    >
                        <Paper
                            className={`${classes.message} ${
                                message.role === 'user' ? classes.userMessage : classes.assistantMessage
                            }`}
                            elevation={0}
                        >
                            {message.content}
                        </Paper>
                        {message.role === 'assistant' && message.messageId && !message.isError && (
                            <AIFeedback
                                messageId={message.messageId}
                                userId={userId}
                                language={language}
                            />
                        )}
                    </Box>
                ))}

                {loading && (
                    <Box className={classes.thinking}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">{msg.thinking}</Typography>
                    </Box>
                )}

                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box className={classes.inputContainer}>
                <TextField
                    className={classes.input}
                    variant="outlined"
                    placeholder={msg.placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                    disabled={loading || capReached}
                    size="small"
                />
                <IconButton
                    className={classes.sendButton}
                    onClick={handleSend}
                    disabled={!input.trim() || loading || capReached}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
}

export default AITutor;
