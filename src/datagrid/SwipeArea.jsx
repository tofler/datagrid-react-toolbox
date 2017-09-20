import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from 'react-toolbox/lib/button';
import theme from './theme.css';

@observer
export default class SwipeArea extends Component {
    constructor(props) {
        super(props);
        [
            'swipeLeft',
            'swipeRight',
        ].forEach((method) => { this[method] = this[method].bind(this); });
    }

    swipeLeft() {
        const { dataGridStore } = this.props;
        dataGridStore.pullActiveIdxLeft();
    }

    swipeRight() {
        const { dataGridStore } = this.props;
        dataGridStore.pullActiveIdxRight();
    }

    render() {
        const { dataGridStore } = this.props;
        const {
            fixedPlusSwipeActiveIdxList,
            columnProperties,
        } = dataGridStore;
        return (
            fixedPlusSwipeActiveIdxList.length >= columnProperties.length
                ? null
                : (
                    <div styleName="swipe-area">
                        <IconButton icon="keyboard_arrow_left" onClick={this.swipeLeft} />
                        {
                            columnProperties.map((col, idx) => (
                                <span
                                    key={col.name}
                                    className={`${theme['swipe-area-column']} ${fixedPlusSwipeActiveIdxList.indexOf(idx) >= 0 ? theme.active : ''}`}
                                />
                            ))
                        }
                        <IconButton icon="keyboard_arrow_right" onClick={this.swipeRight} />
                    </div>
                )
        );
    }
}
