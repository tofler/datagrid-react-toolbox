import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { observer } from 'mobx-react';
import Media from 'react-media';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { IconButton } from 'react-toolbox/lib/button';
import { HeightTransition, FadeTransition } from '../transitions';
import DataGridStore from './store';
import DataGridFilter from './DataGridFilter';
import SwipeArea from './SwipeArea';
import DataGridInfoRange from './DataGridInfoRange';
import DataGridPagination from './DataGridPagination';
import dgtheme from './theme.css';


@observer
export default class DataGrid extends Component {
    constructor(props) {
        super(props);
        [
            'renderHead',
            'renderHeadCell',
            'renderHiddenHeadCell',
            'renderHiddenColumnContent',
            'renderBodyCell',
            'renderBody',
            'renderFilterText',
            'getStyles',
            'toggleHiddenRow',
            'toggleSortInfo',
        ].forEach((method) => { this[method] = this[method].bind(this); });
    }

    componentWillMount() {
        const {
            className,
            theme,
            mode,
            swipeWidth,
            caption,
            subtitle,
            columnProperties,
            showFilter,
            showHeader,
            headers,
            data,
            noDataMessage,
            showInfoRange,
            showPagination,
            infoPerPage,
            sortable,
            serverRender,
            currentPage,
            count,
            onSort,
            onPageChange,
        } = this.props;
        this.dataGridStore = new DataGridStore({
            className,
            theme,
            mode,
            swipeWidth,
            caption,
            subtitle,
            columnProperties,
            showFilter,
            showHeader,
            headers,
            data,
            noDataMessage,
            showInfoRange,
            showPagination,
            infoPerPage,
            sortable,
            serverRender,
            currentPage,
            count,
            onSort,
            onPageChange,
        });
        window.dataGridStore = this.dataGridStore;
    }

    componentWillReceiveProps(nextProps) {
        this.dataGridStore.setup(nextProps);
    }

    getStyles(clsName) {
        return {
            className: `${dgtheme[clsName]} ${get(this.dataGridStore, `theme[${clsName}]`, '')}`,
        };
    }

    /** * actions ** */
    toggleHiddenRow(rowIdx) {
        const { dataGridStore } = this;
        dataGridStore.toggleHiddenRow(rowIdx);
    }
    toggleSortInfo(colName) {
        const { dataGridStore } = this;
        dataGridStore.toggleSortInfo(colName);
    }
    /** * end actions ** */

    /** * renders ** */
    renderHeadCell(column, columnIdx) {
        const { dataGridStore } = this;
        const {
            mode,
            fixedPlusSwipeActiveIdxList,
        } = dataGridStore;
        const swipe = mode === 'SWIPE';
        return (
            <Media query={column.hidden ? column.hidden : '(max-width: 0)'} key={column.name}>
                {
                    matches => (
                        !matches && (!swipe || fixedPlusSwipeActiveIdxList.indexOf(columnIdx) >= 0)
                            ? (
                                <TableCell
                                    tagName="th"
                                    sorted={
                                        dataGridStore.sortable && column.sortable && (
                                            dataGridStore.sortInfo.name === column.name)
                                            ? dataGridStore.sortInfo.order
                                            : null
                                    }
                                    onClick={() => this.toggleSortInfo(column.name)}
                                >
                                    <span>{column.title}</span>
                                </TableCell>
                            ) : null
                    )
                }
            </Media>
        );
    }

    renderHiddenHeadCell() {
        const dataGridStore = this.dataGridStore;
        return (
            dataGridStore.numHiddenColumn ? (
                <TableCell>
                    <span />
                </TableCell>
            ) : null
        );
    }

    renderHead() {
        const { columnProperties, showHeader } = this.dataGridStore;
        return (
            showHeader
                ? (
                    <TableHead>
                        {this.renderHiddenHeadCell()}
                        {
                            columnProperties.map((column, cdx) => (
                                this.renderHeadCell(column, cdx)
                            ))
                        }
                    </TableHead>
                ) : null
        );
    }
    /* eslint-disable class-methods-use-this */
    renderBodyCell(column, rowData, columnIdx, rowIdx) {
        const {
            mode,
            fixedPlusSwipeActiveIdxList,
        } = this.dataGridStore;
        const swipe = mode === 'SWIPE';
        return (
            <Media query={column.hidden ? column.hidden : '(max-width: 0)'} key={column.name}>
                {
                    matches => (
                        !matches && (!swipe || fixedPlusSwipeActiveIdxList.indexOf(columnIdx) >= 0)
                            ? (
                                <TableCell key={column.name}>
                                    <span>
                                        {
                                            column.formatter
                                                ? column.formatter(
                                                    rowData[column.name],
                                                    rowData,
                                                    columnIdx,
                                                    rowIdx,
                                                ) : rowData[column.name]
                                        }
                                    </span>
                                </TableCell>
                            ) : null
                    )
                }
            </Media>
        );
    }
    /* eslint-enable */

    renderHiddenColumnContent(rowData, rowIdx) {
        const dataGridStore = this.dataGridStore;
        const hiddenColumnsContent = map(dataGridStore.columnProperties, (column, columnIdx) => (
            <Media query={column.hidden ? column.hidden : '(max-width: 0)'} key={column.name}>
                {
                    matches => (
                        matches
                            ? (
                                <div {...this.getStyles('hidden-content-item')}>
                                    <span {...this.getStyles('hidden-content-item-head')}>{column.title}</span>
                                    <span {...this.getStyles('hidden-content-item-data')}>
                                        {
                                            column.formatter
                                                ? column.formatter(
                                                    rowData[column.name],
                                                    rowData,
                                                    columnIdx,
                                                    rowIdx,
                                                ) : rowData[column.name]
                                        }
                                    </span>
                                </div>
                            ) : null
                    )
                }
            </Media>
        ));
        return dataGridStore.numHiddenColumn ? hiddenColumnsContent : null;
    }

    renderBody() {
        const {
            data,
            noDataMessage,
            sortedData,
            filteredDataIdx,
            numHiddenColumn,
            columnProperties,
            currentPage,
            infoPerPage,
            serverRender,
        } = this.dataGridStore;
        const startIdx = serverRender ? 0 : (currentPage - 1) * infoPerPage;
        const endIdx = startIdx + infoPerPage;
        const numNonHiddenColumn = columnProperties.length - numHiddenColumn;
        return data.length === 0
            ? (
                <TableRow>
                    <TableCell colSpan={numNonHiddenColumn + 1}>{noDataMessage}</TableCell>
                </TableRow>
            ) : (
                reduce(filteredDataIdx.slice(startIdx, endIdx), (x, rdx) => {
                    const rowData = sortedData[rdx];
                    x.push(
                        <TableRow key={rdx} {...this.getStyles('datagrid-row')}>
                            {
                                numHiddenColumn
                                    ? (
                                        <TableCell theme={dgtheme} {...this.getStyles('hidden-content-button-cell')}>
                                            <span {...this.getStyles('hidden-content-toggle-button')}>
                                                <IconButton
                                                    icon="keyboard_arrow_right"
                                                    onClick={() => this.toggleHiddenRow(rdx)}
                                                    className={(
                                                        rowData._expanded
                                                            ? dgtheme.expanded
                                                            : dgtheme.collapsed
                                                    )}
                                                />
                                            </span>
                                        </TableCell>
                                    ) : null
                            }
                            {
                                map(columnProperties, (column, cdx) => (
                                    this.renderBodyCell(column, rowData, cdx, rdx)
                                ))
                            }
                        </TableRow>,
                    );
                    x.push(
                        <TableRow key={`${rdx}_hidden`} {...this.getStyles('datagrid-row-hidden')}>
                            <TableCell colSpan={numNonHiddenColumn + 1}>
                                <HeightTransition>
                                    {
                                        numHiddenColumn && get(rowData, '_expanded', false)
                                            ? this.renderHiddenColumnContent(rowData, rdx)
                                            : null
                                    }
                                </HeightTransition>
                            </TableCell>
                        </TableRow>,
                    );
                    return x;
                }, [])
            );
    }
    renderFilterText() {
        const { dataGridStore } = this;
        const filterText = dataGridStore.filterInput.value;
        return (
            <FadeTransition>
                {
                    filterText
                        ? <span><b>Filter:</b> {filterText}</span>
                        : null
                }
            </FadeTransition>
        );
    }
    /** * end renders ** */

    render() {
        const dataGridStore = this.dataGridStore;
        return (
            <Card {...this.getStyles('datagrid')}>
                {
                    dataGridStore.caption === null ? null : (
                        <CardTitle {...this.getStyles('datagrid-title')}>
                            <div {...this.getStyles('datagrid-title-row')}>
                                <div {...this.getStyles('datagrid-caption')}>{dataGridStore.caption}</div>
                                <div {...this.getStyles('datagrid-actions')}>
                                    {
                                        dataGridStore.showFilter
                                            ? <DataGridFilter dataGridStore={dataGridStore} />
                                            : null
                                    }
                                </div>
                            </div>
                            {dataGridStore.subtitle ? <p>{dataGridStore.subtitle}</p> : null}
                            <div {...this.getStyles('datagrid-extra-info')}>
                                {this.renderFilterText()}
                            </div>
                        </CardTitle>
                    )
                }
                <CardText {...this.getStyles('datagrid-body')}>
                    {
                        dataGridStore.mode === 'SWIPE'
                            ? <SwipeArea dataGridStore={dataGridStore} />
                            : null
                    }
                    <Table selectable={false} {...this.getStyles('datagrid-table')}>
                        {this.renderHead()}
                        {this.renderBody()}
                    </Table>
                    {
                        dataGridStore.data.length
                            ? (
                                <div {...this.getStyles('datagrid-table-info')}>
                                    {
                                        dataGridStore.showInfoRange
                                            ? <DataGridInfoRange dataGridStore={dataGridStore} />
                                            : null
                                    }
                                    {
                                        dataGridStore.showPagination
                                            ? <DataGridPagination dataGridStore={dataGridStore} />
                                            : null
                                    }
                                </div>
                            ) : null
                    }
                </CardText>
            </Card>
        );
    }
}

DataGrid.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.shape({
        datagrid: PropTypes.string,
        'datagrid-title': PropTypes.string,
        'datagrid-caption': PropTypes.string,
        'datagrid-actions': PropTypes.string,
        'datagrid-body': PropTypes.string,
        'datagrid-table': PropTypes.string,
        'datagrid-row': PropTypes.string,
        'datagrid-title-row': PropTypes.string,
        'datagrid-row-hidden': PropTypes.string,
        'hidden-content-item': PropTypes.string,
        'hidden-content-item-head': PropTypes.string,
        'hidden-content-item-data': PropTypes.string,
        'hidden-content-button-cell': PropTypes.string,
        'hidden-content-toggle-button': PropTypes.string,
        'datagrid-table-info': PropTypes.string,
        'datagrid-extra-info': PropTypes.string,
    }),
    mode: PropTypes.oneOf(['SWIPE']),
    swipeWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
    ]),
    caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    columnProperties: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        formatter: PropTypes.func,
        fixed: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        hidden: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
    })),
    showHeader: PropTypes.bool,
    headers: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
    noDataMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    showFilter: PropTypes.bool,
    showInfoRange: PropTypes.bool,
    showPagination: PropTypes.bool,
    serverRender: PropTypes.bool,
    infoPerPage: PropTypes.number,
    currentPage: PropTypes.number,
    count: PropTypes.number,
    onSort: PropTypes.func,
    onPageChange: PropTypes.func,
};
