import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FontIcon from 'react-toolbox/lib/font_icon';
import PaginateNode from './PaginateNode';
import './theme.css';

@observer
export default class DashboardPagination extends Component {
    constructor(props) {
        super(props);
        [
            'createPaginateNodes',
            'incCurrentPage',
            'decCurrentPage',
            'setCurrentPage',
        ].forEach((method) => { this[method] = this[method].bind(this); });
    }

    setCurrentPage(newPage) {
        const { dataGridStore } = this.props;
        dataGridStore.setCurrentPage(newPage);
    }

    incCurrentPage() {
        const { dataGridStore } = this.props;
        const { currentPage } = dataGridStore;
        dataGridStore.setCurrentPage(currentPage + 1);
    }

    decCurrentPage() {
        const { dataGridStore } = this.props;
        const { currentPage } = dataGridStore;
        dataGridStore.setCurrentPage(currentPage - 1);
    }

    createPaginateNodes() {
        const retVal = [];
        const { dataGridStore } = this.props;
        const { currentPage, infoPerPage, dataLength } = dataGridStore;
        if (!dataGridStore.filteredDataIdx) {
            return retVal;
        }
        const numPages = Math.ceil(dataLength / infoPerPage);
        if (numPages === 1) {
            return [];
        }
        retVal.push({
            label: <FontIcon value="keyboard_arrow_left" />,
            disabled: currentPage === 1,
            onClick: this.decCurrentPage,
        });
        retVal.push({
            label: '1',
            disabled: currentPage === 1,
            active: currentPage === 1,
            onClick: this.setCurrentPage.bind(this, 1),
        });
        if (currentPage > 2) {
            retVal.push({
                label: '...',
                disabled: true,
            });
        }
        if (numPages > currentPage && currentPage > 1) {
            retVal.push({
                label: currentPage,
                disabled: true,
                active: true,
            });
        }
        if (numPages > currentPage + 1) {
            retVal.push({
                label: '...',
                disabled: true,
            });
        }
        retVal.push({
            label: numPages,
            disabled: currentPage === numPages,
            active: currentPage === numPages,
            onClick: this.setCurrentPage.bind(this, numPages),
        });
        retVal.push({
            label: <FontIcon value="keyboard_arrow_right" />,
            disabled: currentPage === numPages,
            onClick: this.incCurrentPage,
        });
        return retVal;
    }

    render() {
        return (
            <div styleName="pagination-wrapper">
                <div styleName="pagination">
                    {
                        this.createPaginateNodes().map((node, idx) => (
                            <PaginateNode {...node} key={idx} />),
                        )
                    }
                </div>
            </div>
        );
    }
}

