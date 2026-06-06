import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { useLocalization } from '../../util/LocalizationContext';

// This reload icon is used to regenerate ChatGPT generated hints
const ReloadIconButton = ({ onClick, title }) => {
    const { t } = useLocalization();
    const tooltipTitle = title || t('hintsystem.regenerateHint');

    return (
        <Tooltip title={tooltipTitle}>
            <IconButton onClick={onClick} aria-label={t('hintsystem.regenerateHint')}>
                <img
                    src={`${process.env.PUBLIC_URL}/static/images/icons/reload.png`}
                    alt={t('tooltips.regenerate')}
                    style={{ width: '24px', height: '24px' }}
                />
            </IconButton>
        </Tooltip>
    );
};

export default ReloadIconButton;
