import React from 'react';
import { Handle, Position } from '@xyflow/react';


export function StartNode({ data }) {

    const nodeStyle = {
        position: 'relative',
    };
    
    const handleStyle = {
        opacity: '0',
    };

    return (
        <div style={nodeStyle} className='react-flow__node-default'>
            <div>{data.label}</div>
            <Handle style={handleStyle} type='source' position={Position.Bottom}/>
        </div>
    )

}