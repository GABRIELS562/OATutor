/**
 * Progress Chart Component
 * Displays visual charts for student progress using pure CSS/SVG (no external chart library)
 * Mobile-responsive design for South African students
 */

import React, { useMemo } from 'react';
import { Box, Typography, Paper, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    chartContainer: {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    chartTitle: {
        color: '#fff',
        fontWeight: 700,
        marginBottom: '16px',
        fontSize: '16px',
    },
    // Bar Chart Styles
    barChartWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '200px',
        paddingTop: '20px',
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            height: '160px',
        },
    },
    barGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        maxWidth: '60px',
    },
    bar: {
        width: '30px',
        borderRadius: '8px 8px 0 0',
        transition: 'height 0.5s ease-out',
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            width: '24px',
        },
    },
    barValue: {
        position: 'absolute',
        top: '-24px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
    },
    barLabel: {
        marginTop: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '11px',
        textAlign: 'center',
    },
    // Progress Ring Styles
    progressRingWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
    },
    progressRing: {
        position: 'relative',
        width: '140px',
        height: '140px',
        [theme.breakpoints.down('xs')]: {
            width: '120px',
            height: '120px',
        },
    },
    progressRingSvg: {
        transform: 'rotate(-90deg)',
    },
    progressRingCircle: {
        fill: 'none',
        strokeLinecap: 'round',
        transition: 'stroke-dashoffset 0.5s ease-out',
    },
    progressRingBg: {
        stroke: 'rgba(255,255,255,0.1)',
    },
    progressRingValue: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
    },
    progressRingPercent: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: 1,
    },
    progressRingLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '12px',
        marginTop: '4px',
    },
    // Line Chart Styles
    lineChartWrapper: {
        height: '200px',
        position: 'relative',
        marginTop: '20px',
        [theme.breakpoints.down('xs')]: {
            height: '160px',
        },
    },
    lineChartSvg: {
        width: '100%',
        height: '100%',
    },
    gridLine: {
        stroke: 'rgba(255,255,255,0.1)',
        strokeDasharray: '4,4',
    },
    dataLine: {
        fill: 'none',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    dataPoint: {
        transition: 'r 0.2s ease',
        cursor: 'pointer',
    },
    areaFill: {
        opacity: 0.2,
    },
    xAxisLabel: {
        fill: 'rgba(255,255,255,0.6)',
        fontSize: '11px',
        textAnchor: 'middle',
    },
    yAxisLabel: {
        fill: 'rgba(255,255,255,0.6)',
        fontSize: '10px',
        textAnchor: 'end',
    },
    // Horizontal Bar Chart Styles
    horizontalBarWrapper: {
        padding: '8px 0',
    },
    horizontalBarRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
    },
    horizontalBarLabel: {
        width: '80px',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '12px',
        fontWeight: 500,
        flexShrink: 0,
        [theme.breakpoints.down('xs')]: {
            width: '60px',
            fontSize: '11px',
        },
    },
    horizontalBarTrack: {
        flex: 1,
        height: '24px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
    },
    horizontalBarFill: {
        height: '100%',
        borderRadius: '12px',
        transition: 'width 0.5s ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '8px',
        minWidth: '40px',
    },
    horizontalBarValue: {
        color: '#fff',
        fontSize: '11px',
        fontWeight: 600,
    },
    // Legend
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '16px',
        flexWrap: 'wrap',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    legendDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
    },
    legendLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '11px',
    },
    // Empty state
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
        color: 'rgba(255,255,255,0.5)',
    },
}));

/**
 * Bar Chart Component
 */
export const BarChart = ({ data, title, valueKey = 'value', labelKey = 'label', color = '#7B2FF7' }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const maxValue = useMemo(() => {
        return Math.max(...data.map(d => d[valueKey] || 0), 1);
    }, [data, valueKey]);

    if (!data || data.length === 0) {
        return (
            <Paper className={classes.chartContainer} elevation={0}>
                <Typography className={classes.chartTitle}>{title}</Typography>
                <Box className={classes.emptyState}>
                    <Typography>No data available yet</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className={classes.chartContainer} elevation={0}>
            <Typography className={classes.chartTitle}>{title}</Typography>
            <Box className={classes.barChartWrapper}>
                {data.map((item, index) => {
                    const value = item[valueKey] || 0;
                    const height = (value / maxValue) * (isMobile ? 140 : 180);
                    const barColor = item.color || color;

                    return (
                        <Box key={index} className={classes.barGroup}>
                            <Box
                                className={classes.bar}
                                style={{
                                    height: `${Math.max(height, 4)}px`,
                                    background: barColor,
                                }}
                            >
                                {value > 0 && (
                                    <span className={classes.barValue}>{value}</span>
                                )}
                            </Box>
                            <Typography className={classes.barLabel}>
                                {item[labelKey]}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

/**
 * Progress Ring Component
 */
export const ProgressRing = ({ value, maxValue = 100, title, label, color = '#7B2FF7', size = 140 }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const displaySize = isMobile ? size * 0.85 : size;
    const strokeWidth = 12;
    const radius = (displaySize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min((value / maxValue) * 100, 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Box className={classes.progressRingWrapper}>
            {title && <Typography className={classes.chartTitle}>{title}</Typography>}
            <Box className={classes.progressRing} style={{ width: displaySize, height: displaySize }}>
                <svg
                    className={classes.progressRingSvg}
                    width={displaySize}
                    height={displaySize}
                >
                    <circle
                        className={`${classes.progressRingCircle} ${classes.progressRingBg}`}
                        cx={displaySize / 2}
                        cy={displaySize / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        className={classes.progressRingCircle}
                        cx={displaySize / 2}
                        cy={displaySize / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke={color}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <Box className={classes.progressRingValue}>
                    <Typography className={classes.progressRingPercent}>
                        {Math.round(progress)}%
                    </Typography>
                    {label && (
                        <Typography className={classes.progressRingLabel}>
                            {label}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

/**
 * Line Chart Component for trends
 */
export const LineChart = ({ data, title, xKey = 'label', yKey = 'value', color = '#7B2FF7' }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const chartHeight = isMobile ? 140 : 180;
    const chartWidth = 320;
    const padding = { top: 20, right: 20, bottom: 30, left: 35 };

    const { points, areaPath, maxY } = useMemo(() => {
        if (!data || data.length === 0) {
            return { points: [], areaPath: '', maxY: 100 };
        }

        const maxY = Math.max(...data.map(d => d[yKey] || 0), 10);
        const xStep = (chartWidth - padding.left - padding.right) / Math.max(data.length - 1, 1);

        const pts = data.map((d, i) => ({
            x: padding.left + i * xStep,
            y: padding.top + (chartHeight - padding.top - padding.bottom) * (1 - (d[yKey] || 0) / maxY),
            label: d[xKey],
            value: d[yKey],
        }));

        // Create area path
        let area = `M ${pts[0]?.x || 0} ${chartHeight - padding.bottom}`;
        pts.forEach(p => {
            area += ` L ${p.x} ${p.y}`;
        });
        area += ` L ${pts[pts.length - 1]?.x || 0} ${chartHeight - padding.bottom} Z`;

        return { points: pts, areaPath: area, maxY };
    }, [data, xKey, yKey, chartHeight, chartWidth, padding]);

    if (!data || data.length === 0) {
        return (
            <Paper className={classes.chartContainer} elevation={0}>
                <Typography className={classes.chartTitle}>{title}</Typography>
                <Box className={classes.emptyState}>
                    <Typography>No data available yet</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className={classes.chartContainer} elevation={0}>
            <Typography className={classes.chartTitle}>{title}</Typography>
            <Box className={classes.lineChartWrapper}>
                <svg className={classes.lineChartSvg} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(pct => {
                        const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - pct / 100);
                        return (
                            <g key={pct}>
                                <line
                                    className={classes.gridLine}
                                    x1={padding.left}
                                    y1={y}
                                    x2={chartWidth - padding.right}
                                    y2={y}
                                />
                                <text
                                    className={classes.yAxisLabel}
                                    x={padding.left - 4}
                                    y={y + 4}
                                >
                                    {Math.round(pct * maxY / 100)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area fill */}
                    <path
                        className={classes.areaFill}
                        d={areaPath}
                        fill={color}
                    />

                    {/* Line */}
                    <polyline
                        className={classes.dataLine}
                        points={points.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke={color}
                    />

                    {/* Data points */}
                    {points.map((point, i) => (
                        <g key={i}>
                            <circle
                                className={classes.dataPoint}
                                cx={point.x}
                                cy={point.y}
                                r={4}
                                fill={color}
                            />
                            <text
                                className={classes.xAxisLabel}
                                x={point.x}
                                y={chartHeight - 8}
                            >
                                {point.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </Box>
        </Paper>
    );
};

/**
 * Horizontal Bar Chart Component
 */
export const HorizontalBarChart = ({ data, title, valueKey = 'value', labelKey = 'label', maxValue }) => {
    const classes = useStyles();

    const max = useMemo(() => {
        return maxValue || Math.max(...data.map(d => d[valueKey] || 0), 100);
    }, [data, valueKey, maxValue]);

    if (!data || data.length === 0) {
        return (
            <Paper className={classes.chartContainer} elevation={0}>
                <Typography className={classes.chartTitle}>{title}</Typography>
                <Box className={classes.emptyState}>
                    <Typography>No data available yet</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className={classes.chartContainer} elevation={0}>
            <Typography className={classes.chartTitle}>{title}</Typography>
            <Box className={classes.horizontalBarWrapper}>
                {data.map((item, index) => {
                    const value = item[valueKey] || 0;
                    const percentage = (value / max) * 100;
                    const barColor = item.color?.primary || item.color || '#7B2FF7';

                    return (
                        <Box key={index} className={classes.horizontalBarRow}>
                            <Typography className={classes.horizontalBarLabel}>
                                {item[labelKey]}
                            </Typography>
                            <Box className={classes.horizontalBarTrack}>
                                <Box
                                    className={classes.horizontalBarFill}
                                    style={{
                                        width: `${Math.max(percentage, 10)}%`,
                                        background: barColor,
                                    }}
                                >
                                    <span className={classes.horizontalBarValue}>
                                        {Math.round(value)}%
                                    </span>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

/**
 * Multi-series Bar Chart
 */
export const MultiBarChart = ({ data, title, series, labelKey = 'label' }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const maxValue = useMemo(() => {
        let max = 0;
        data.forEach(item => {
            series.forEach(s => {
                max = Math.max(max, item[s.key] || 0);
            });
        });
        return max || 1;
    }, [data, series]);

    if (!data || data.length === 0) {
        return (
            <Paper className={classes.chartContainer} elevation={0}>
                <Typography className={classes.chartTitle}>{title}</Typography>
                <Box className={classes.emptyState}>
                    <Typography>No data available yet</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper className={classes.chartContainer} elevation={0}>
            <Typography className={classes.chartTitle}>{title}</Typography>
            <Box className={classes.barChartWrapper}>
                {data.map((item, index) => (
                    <Box key={index} className={classes.barGroup} style={{ gap: '2px' }}>
                        <Box style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                            {series.map((s, sIndex) => {
                                const value = item[s.key] || 0;
                                const height = (value / maxValue) * (isMobile ? 140 : 180);
                                return (
                                    <Box
                                        key={sIndex}
                                        className={classes.bar}
                                        style={{
                                            height: `${Math.max(height, 4)}px`,
                                            background: s.color,
                                            width: isMobile ? '12px' : '14px',
                                        }}
                                        title={`${s.label}: ${value}`}
                                    />
                                );
                            })}
                        </Box>
                        <Typography className={classes.barLabel}>
                            {item[labelKey]}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box className={classes.legend}>
                {series.map((s, index) => (
                    <Box key={index} className={classes.legendItem}>
                        <Box className={classes.legendDot} style={{ background: s.color }} />
                        <Typography className={classes.legendLabel}>{s.label}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

const ProgressChartComponents = {
    BarChart,
    ProgressRing,
    LineChart,
    HorizontalBarChart,
    MultiBarChart,
};

export default ProgressChartComponents;
