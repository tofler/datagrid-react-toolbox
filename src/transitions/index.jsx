import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import theme from './theme.css';

export const BaseTransition = (props) => {
    const { slow, ...others } = props;
    const transitionProps = {
        transitionAppearTimeout: slow ? 2 * 350 : 350,
        transitionEnterTimeout: slow ? 2 * 350 : 350,
        transitionLeaveTimeout: slow ? 2 * 350 : 350,
    };
    return (
        <CSSTransitionGroup
            {...transitionProps}
            {...others}
        >
            {props.children}
        </CSSTransitionGroup>
    );
};

export const HeightTransition = (props) => {
    const { slow } = props;
    const transitionProps = {
        transitionName: slow ? 'trans-height-slow' : 'trans-height-fast',
        className: theme['trans-height'],
    };
    return <BaseTransition {...transitionProps} {...props} />;
};

export const HeightAppearTransition = props => (
    <HeightTransition
        {...props}
        transitionAppear
        transitionEnter={false}
        transitionLeave={false}
    />
);

export const HeightInTransition = props => <HeightTransition {...props} transitionLeave={false} />;

export const FadeTransition = (props) => {
    const { slow } = props;
    const transitionProps = {
        transitionName: slow ? 'trans-fade-slow' : 'trans-fade-fast',
        className: theme['trans-fade'],
    };
    return <BaseTransition {...transitionProps} {...props} />;
};

export const FadeInTransition = props => <FadeTransition {...props} transitionLeave={false} />;

export const SlideTransition = (props) => {
    const { slow } = props;
    const transitionProps = {
        transitionName: slow ? 'trans-slide-slow' : 'trans-slide-fast',
        className: theme['trans-slide'],
    };
    return <BaseTransition {...transitionProps} {...props} />;
};
