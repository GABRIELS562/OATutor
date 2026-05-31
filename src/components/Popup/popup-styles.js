/**
 * Angelo Tutoring - Popup/Modal Styles
 * Modern design with brand colors
 */

export const popupStyles = {
    popupContent: {
        background: '#FFFFFF',
        padding: '24px 32px 32px',
        borderRadius: '20px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '720px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        fontSize: '16px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#7B2FF7 #f1f5f9',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(123, 47, 247, 0.1)',
        outline: 'none',
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f5f9',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #7B2FF7, #F72585)',
            borderRadius: '4px',
        },
        '& ul': {
            paddingLeft: '24px',
            marginTop: '8px',
            '& li': {
                marginBottom: '6px',
                lineHeight: 1.6,
            },
        },
        '& h2': {
            color: '#1a1a2e',
            fontWeight: 700,
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(90deg, #00D4FF, #7B2FF7, #F72585) 1',
        },
        '& h3': {
            color: '#7B2FF7',
            fontWeight: 600,
            marginTop: '24px',
            marginBottom: '8px',
        },
        '& p': {
            color: '#374151',
            lineHeight: 1.7,
            marginBottom: '12px',
        },
        '& sub': {
            display: 'block',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            color: '#64748B',
            fontSize: '13px',
            '& p': {
                marginBottom: '4px',
            },
        },
        '& strong': {
            color: '#1a1a2e',
        },
    },
    button: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
    iconButton: {
        backgroundColor: 'rgba(123, 47, 247, 0.1)',
        color: '#7B2FF7',
        borderRadius: '50%',
        padding: '4px',
        fontSize: 24,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(123, 47, 247, 0.2)',
        },
    }
};
