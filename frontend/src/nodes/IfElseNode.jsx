import React from 'react';
import { Handle, Position } from '@xyflow/react';


export function IfElseNode({ data }) {

    const nodeStyle = {
        position: 'relative',
    };

    const handleStyle = {
        opacity: '0',
    };

    return(
        <div style={nodeStyle} className='react-flow__node-default'>
            <Handle style={handleStyle} type='target' position={Position.Top}/>
            <div>
                {data.label}
                <button><i className="ri-edit-box-line" aria-label='true'></i></button>
            </div>
            <Handle style={handleStyle} type='source' position={Position.Bottom}/>
        </div>
    );

}   