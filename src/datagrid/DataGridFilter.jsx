import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { FadeTransition } from '../transitions';
import theme from './theme.css';


@observer
export default class DataGridFilter extends Component {
    constructor(props) {
        super(props);
        [
            'toggleFilter',
            'handleChange',
            'clearFilter',
        ].forEach((method) => { this[method] = this[method].bind(this); });
    }

    toggleFilter() {
        this.props.dataGridStore.toggleFilterInputActive();
    }

    handleChange(val) {
        this.props.dataGridStore.updateFilterInputValue(val);
    }

    clearFilter() {
        this.props.dataGridStore.updateFilterInputValue('');
    }

    render() {
        const { dataGridStore } = this.props;
        return dataGridStore.showFilter ? (
            <div styleName="datagrid-filter">
                <IconButton
                    icon="filter_list"
                    onMouseUp={this.toggleFilter}
                    accent={!!dataGridStore.filterInput.value}
                />
                <FadeTransition>
                    {
                        dataGridStore.filterInput.active
                            ? (
                                <div styleName="filter-input">
                                    <Input
                                        type="text"
                                        hint="filter table"
                                        name="filter"
                                        value={dataGridStore.filterInput.value}
                                        onChange={this.handleChange}
                                        onBlur={this.toggleFilter}
                                        autoFocus
                                    >
                                        {
                                            dataGridStore.filterInput.value
                                                ? <IconButton className={theme['clear-filter-button']} icon="close" onMouseUp={this.clearFilter} />
                                                : null
                                        }
                                    </Input>
                                </div>
                            ) : null
                    }
                </FadeTransition>
            </div>
        ) : null;
    }
}
