import React from "react";
import { Button, Container, Typography, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { SITE_NAME } from "../config/config";

const NotFound = () => {
    const history = useHistory();

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textAlign: 'center',
    };

    const contentStyle = {
        padding: '40px',
    };

    const errorCodeStyle = {
        fontSize: '8rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #1CB0F6 0%, #58CC02 50%, #FF9600 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
        marginBottom: '16px',
    };

    const titleStyle = {
        fontSize: '1.75rem',
        fontWeight: 600,
        color: '#3C3C3C',
        marginBottom: '12px',
    };

    const descriptionStyle = {
        color: '#64748B',
        fontSize: '1.1rem',
        maxWidth: '400px',
        margin: '0 auto 32px',
        lineHeight: 1.6,
    };

    const buttonStyle = {
        background: '#58CC02',
        color: '#fff',
        padding: '12px 32px',
        borderRadius: '16px',
        fontWeight: 700,
        textTransform: 'none',
        fontSize: '1rem',
        boxShadow: '0 4px 0 0 #58A700',
        transition: 'all 0.1s ease',
    };

    return (
        <div style={containerStyle}>
            <Container maxWidth="sm">
                <Box style={contentStyle}>
                    <Typography style={errorCodeStyle}>
                        404
                    </Typography>
                    <Typography style={titleStyle}>
                        Page Not Found
                    </Typography>
                    <Typography style={descriptionStyle}>
                        Oops! The page you're looking for doesn't exist.
                        Let's get you back to learning with {SITE_NAME}.
                    </Typography>
                    <Button
                        variant="contained"
                        style={buttonStyle}
                        startIcon={<HomeIcon />}
                        onClick={() => history.push('/')}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(2px)';
                            e.currentTarget.style.boxShadow = '0 2px 0 0 #58A700';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 0 0 #58A700';
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </Container>
        </div>
    );
};

export default NotFound;
