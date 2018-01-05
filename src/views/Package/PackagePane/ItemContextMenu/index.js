import React from 'react'
import {ContextMenu, ContextMenuTrigger, MenuItem} from 'react-contextmenu'
import PropTypes from 'prop-types'
// import api from '../../api';

import './index.less'

const MENU_TYPE = 'MULTI';

function collect(props) {
    return { name: props.name };
}

export default class ItemContextMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render() {
        const targets = [];

        const attributes = {
            'data-count': 0,
            className: 'example-multiple-targets well'
        };
        return (
            <div className="context-menu">
                <div className='pure-g'>
                    {targets.map((item, i) => (
                        <div key={i} className='pure-u-1-6'>
                            <ContextMenuTrigger
                                id={MENU_TYPE} name={item.name}
                                holdToDisplay={1000}
                                collect={collect} attributes={attributes}>
                                {item.name}
                            </ContextMenuTrigger>
                        </div>
                    ))}
                </div>
                <ContextMenu id={MENU_TYPE}>
                    <MenuItem onClick={this.handleClick} data={{ action: 'Added' }}>Add 1 count</MenuItem>
                    <MenuItem onClick={this.handleClick} data={{ action: 'Removed' }}>Remove 1 count</MenuItem>
                </ContextMenu>
            </div>
        );
    }
}

ItemContextMenu.defaultProps = {
    id: 'unique_identifier',
    cb: function(){}
};

ItemContextMenu.propTypes = {
    id: PropTypes.string,
    cb: PropTypes.func
};
