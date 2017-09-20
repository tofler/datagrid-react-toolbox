import union from 'lodash/union';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import { computed, observable, action, extendObservable } from 'mobx';

const ASC = 'asc';
const DESC = 'desc';
function compare(val1, val2) {
    if (val1 > val2) {
        return 1;
    } if (val1 < val2) {
        return -1;
    }
    return 0;
}
function isColumnFixed(column) {
    let colFixed = false;
    if (Object.prototype.hasOwnProperty.call(column, 'fixed')) {
        if (typeof column.fixed === 'string' && window.matchMedia(column.fixed).matches) {
            colFixed = true;
        } else if (typeof column.fixed === 'boolean' && column.fixed) {
            colFixed = true;
        }
    }
    return colFixed;
}
function convertDataToString(cellData) {
    let retData = '';
    if (typeof (cellData) === 'object') { // array && object
        retData = (cellData.props ? JSON.stringify(cellData.props) : JSON.stringify(cellData)) || '';
    } else {
        retData = cellData.toString();
    }
    retData = retData.toLowerCase();
    return retData;
}
export default class DataGridStore {
    @observable className = '';
    @observable theme = {};
    @observable mode = null;
    @observable swipeWidth = 1000;
    @observable caption = null;
    @observable columnProperties = [];
    @observable showHeader = true;
    @observable headers = [];
    @observable data = [];
    @observable noDataMessage = 'No data found';
    @observable showInfoRange = true;
    @observable showPagination = true;
    @observable infoPerPage = 10;
    @observable showFilter = true;
    @observable sortable = true;
    @observable serverRender = false;
    @observable count = null;
    @observable onSort = null;
    @observable onPageChange = null;

    @observable fixedColumnIdxList = [];
    @observable activeSwipeIdxList = [];

    constructor(props) {
        this.setup(props);
    }

    @computed get numHiddenColumn() {
        return reduce(this.columnProperties, (x, column) => (
            x + (window.matchMedia(column.hidden ? column.hidden : '(max-width: 0)').matches ? 1 : 0)
        ), 0);
    }

    @action setup(props) {
        [
            'className',
            'theme',
            'mode',
            'swipeWidth',
            'caption',
            'subtitle',
            'showHeader',
            'showFilter',
            'showInfoRange',
            'showPagination',
            'infoPerPage',
            'noDataMessage',
            'sortable',
            'serverRender',
            'count',
            'currentPage',
            'onSort',
            'onPageChange',
        ].forEach((key) => {
            if (typeof (props[key]) !== 'undefined') {
                this[key] = props[key];
            }
        });
        if (props.columnProperties) {
            this.columnProperties = props.columnProperties;
        } else if (props.headers.length) {
            this.columnProperties = props.headers.map((item, idx) => ({
                title: item,
                name: idx,
            }));
        }
        // populate fixed and active swipe columns, if mode is SWIPE
        if (this.mode === 'SWIPE') {
            let swipeWidth = this.columnProperties.length;
            if (this.swipeWidth) {
                if (typeof this.swipeWidth === 'number') {
                    swipeWidth = this.swipeWidth;
                } else if (typeof this.swipeWidth === 'object') {
                    forEach(this.swipeWidth, (width, rule) => {
                        if (window.matchMedia(rule).matches && width < swipeWidth) {
                            swipeWidth = width;
                        }
                    });
                }
            }
            this.columnProperties.forEach((column, idx) => {
                if (isColumnFixed(column)) {
                    this.fixedColumnIdxList = union(this.fixedColumnIdxList, [idx]);
                } else if (this.activeSwipeIdxList.length < swipeWidth) {
                    this.activeSwipeIdxList = union(this.activeSwipeIdxList, [idx]);
                }
            });
        }
        // make each column sortable by default
        if (this.sortable) {
            this.columnProperties = this.columnProperties.map(column => (
                Object.prototype.hasOwnProperty.call(column, 'sortable')
                    ? column
                    : Object.assign(column, { sortable: true })
            ));
        }
        let data = props.data;
        if (typeof (data) === 'undefined' || data === null) {
            data = [];
        }
        if (data.length && Array.isArray(data[0])) {
            this.data = data.map(row => reduce(row, (x, cell, idx) => (
                Object.assign(
                    x,
                    Object.prototype.hasOwnProperty.call(this.normalizedColumnProperties, idx)
                        ? { [idx]: cell }
                        : {},
                    { _expanded: false },
                )
            ), {}));
        } else {
            this.data = data;
            this.data = this.data.map(rowData => (
                extendObservable(rowData, { _expanded: false })
            )).slice(0);
        }
    }

    @computed get normalizedColumnProperties() {
        return reduce(this.columnProperties, (x, colProp) => (
            Object.assign({}, x, { [colProp.name]: colProp })
        ), {});
    }
    @computed get fixedPlusSwipeActiveIdxList() {
        return this.fixedColumnIdxList.slice().concat(this.activeSwipeIdxList.slice());
    }

    hasFilterMatch(cellData) {
        const filter = this.filterInput.value;
        return (
            !filter
                ? true
                : (
                    cellData !== null && (
                        convertDataToString(cellData).indexOf(filter.toLowerCase()) >= 0
                    )
                )
        );
    }
    isFilteredRow(rowData) {
        return reduce(rowData, (x, cellData, name) => (
            x || (
                Object.prototype.hasOwnProperty.call(this.normalizedColumnProperties, name)
                && this.hasFilterMatch(cellData)
            )
        ), false);
    }

    @action pullActiveIdxLeft() {
        if (!this.activeSwipeIdxList.length) {
            return;
        }
        let newLeftIdx = null;
        for (let i = this.activeSwipeIdxList[0] - 1; i >= 0; i -= 1) {
            if (this.fixedColumnIdxList.indexOf(i) === -1) {
                newLeftIdx = i;
                break;
            }
        }
        if (newLeftIdx !== null) {
            this.activeSwipeIdxList.splice(0, 0, newLeftIdx);
            this.activeSwipeIdxList.splice(this.activeSwipeIdxList.length - 1, 1);
        }
    }
    @action pullActiveIdxRight() {
        if (!this.activeSwipeIdxList.length) {
            return;
        }
        let newRightIdx = null;
        const len = this.activeSwipeIdxList.length;
        for (
            let i = this.activeSwipeIdxList[len - 1] + 1;
            i < this.columnProperties.length;
            i += 1
        ) {
            if (this.fixedColumnIdxList.indexOf(i) === -1) {
                newRightIdx = i;
                break;
            }
        }
        if (newRightIdx !== null) {
            this.activeSwipeIdxList.splice(len, 0, newRightIdx);
            this.activeSwipeIdxList.splice(0, 1);
        }
    }

    @computed get filteredDataIdx() {
        let idxList = [];
        this.sortedData.forEach((rowData, rdx) => {
            if (this.isFilteredRow(rowData)) {
                idxList.push(rdx);
            } else {
                const formattedRowData = {};
                for (let cdx = 0; cdx < this.columnProperties.length; cdx += 1) {
                    const column = this.columnProperties[cdx];
                    formattedRowData[column.name] = column.formatter ?
                        column.formatter(rowData[column.name], rowData, cdx, rdx)
                        : rowData[column.name];
                }

                if (this.isFilteredRow(formattedRowData)) {
                    idxList.push(rdx);
                }
            }
        });

        idxList = uniq(idxList);
        return idxList;
    }
    @computed get dataLength() {
        return this.count || this.filteredDataIdx.length;
    }

    @action toggleHiddenRow(rowIdx) {
        this.data[rowIdx]._expanded = !this.data[rowIdx]._expanded;
    }

    @observable filterInput = {
        active: false,
        value: '',
    }
    @action toggleFilterInputActive() {
        this.filterInput.active = !this.filterInput.active;
    }
    @action updateFilterInputValue(val) {
        this.filterInput.value = val;
    }

    @observable currentPage = 1;
    @action setCurrentPage(newPage) {
        if (this.onPageChange) {
            this.onPageChange(newPage);
        }
        this.currentPage = newPage;
    }

    @observable sortInfo = {
        name: '',
        order: DESC,
    }
    @action toggleSortInfo(colName) {
        if (!this.sortable || !this.normalizedColumnProperties[colName].sortable) {
            return;
        }
        if (colName === this.sortInfo.name) {
            this.sortInfo.order = this.sortInfo.order === ASC ? DESC : ASC;
        } else {
            this.sortInfo = {
                name: colName,
                order: DESC,
            };
        }
        this.currentPage = 1;
        if (this.onSort) {
            this.onSort(this.sortInfo);
        }
    }

    @computed get sortedData() {
        if (!this.sortable || this.onSort) {
            return this.data;
        }
        if (!this.sortInfo.name) {
            return this.data;
        }
        return this.data.sort((r1, r2) => (
            this.sortInfo.order === ASC
                ? compare(get(r1, this.sortInfo.name), get(r2, this.sortInfo.name))
                : -compare(get(r1, this.sortInfo.name), get(r2, this.sortInfo.name))
        ));
    }
}
