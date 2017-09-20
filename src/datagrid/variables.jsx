let breakpoints = require('react-toolbox/lib/utils/breakpoints');

breakpoints = breakpoints.default;

const cssVariables = {
    vars: {
        /* Note that you can use global colors and variables */
        'color-primary': 'var(--palette-blue-grey-600)',
        'color-primary-dark': 'var(--palette-blue-grey-700)',
        'color-accent': 'var(--palette-yellow-700)',
        'color-accent-dark': 'var(--palette-yellow-900)',
        'color-primary-contrast': 'var(--color-dark-contrast)',
        'color-accent-contrast': 'var(--color-dark-contrast)',
        'color-icon-white': 'rgba(255, 255, 255, 0.8)',
        'color-tofler-red': '#d61008',
        'color-error': '#d61008',
        'color-success': '#080',
        'color-warning': '#e6a800',
        'color-text': '#414c59',
        'color-text-secondary': 'rgba(0, 0, 0, 0.54)',
        'color-text-disabled': 'rgba(0, 0, 0, 0.38)',
        'color-border-gray': 'rgba(0, 0, 0, 0.2)',
        'color-bg-gray': '#fafafa',
        'color-link-blue': '#039be5',
        'color-shell': 'rgba(0, 0, 0, 0.05)',
        'gutter-size': '15px',
        'size-icon': '24px',
        'appBar-height': '56px',
        'height-sm-dialog': '410px',
    },
    media: {
        // media query breakpoints
        '--xs-and-up': '(min-width : 0px)',
        '--sm-and-up': `(min-width : ${breakpoints.xs + 1}px)`,
        '--md-and-up': `(min-width : ${breakpoints.sm + 1}px)`,
        '--lg-and-up': `(min-width : ${breakpoints.md + 1}px)`,
        '--xl-and-up': `(min-width : ${breakpoints.lg + 1}px)`,
        '--xs-and-down': `(max-width : ${breakpoints.xs}px)`,
        '--sm-and-down': `(max-width : ${breakpoints.sm}px)`,
        '--md-and-down': `(max-width : ${breakpoints.md}px)`,
        '--lg-and-down': `(max-width : ${breakpoints.lg}px)`,
        // entire range below
        // '--xl-and-down': `(max-width : ${breakpoints.xl}px)`,
        '--xs-only': `(max-width : ${breakpoints.xs}px)`,
        '--sm-only': `(min-width : ${breakpoints.xs + 1}px) and (max-width : ${breakpoints.sm}px)`,
        '--md-only': `(min-width : ${breakpoints.sm + 1}px) and (max-width : ${breakpoints.md}px)`,
        '--lg-only': `(min-width : ${breakpoints.md + 1}px) and (max-width : ${breakpoints.lg}px)`,
        '--xl-only': `(min-width : ${breakpoints.lg + 1}px)`,
    },
    mixins: {
        'reset-color': {
            color: 'var(--color-text) !important',
        },
    },
};
cssVariables.hasNavDrawer = cssVariables.media['--md-and-down'];
cssVariables.noNavDrawer = cssVariables.media['--lg-and-up'];
cssVariables.hasFABButton = cssVariables.media['--xs-only'];
cssVariables.noFABButton = cssVariables.media['--sm-and-up'];

module.exports = cssVariables;
