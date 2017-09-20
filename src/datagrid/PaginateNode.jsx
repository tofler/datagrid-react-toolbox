import React from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import './theme.css';

const PaginateNode = (props) => {
    const node = props;
    const nodeLabel = <span>{node.label}</span>;

    return (
        <IconButton
            styleName={'pagination-node'}
            onClick={!node.disabled ? node.onClick : null}
            icon={nodeLabel}
            disabled={node.disabled}
            primary={node.active}
        />
    );
};

export default PaginateNode;
