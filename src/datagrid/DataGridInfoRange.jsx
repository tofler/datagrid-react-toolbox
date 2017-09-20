import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './theme.css';

@observer
export default class InfoRange extends Component {
    render() {
        const { dataGridStore } = this.props;
        const { currentPage, infoPerPage, dataLength } = dataGridStore;
        const totalInfo = dataLength;
        const fromInfo = ((currentPage - 1) * infoPerPage) + 1;
        const toInfo = (
            fromInfo + infoPerPage < totalInfo
                ? ((fromInfo + infoPerPage) - 1)
                : totalInfo
        );
        return (
            totalInfo
                ? (<div styleName="info-range-wrapper">{fromInfo} &minus; {toInfo} of {totalInfo}</div>)
                : null
        );
    }
}
