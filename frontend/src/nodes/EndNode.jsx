import React from 'react';
import { Handle, Position } from '@xyflow/react';


export function EndNode({ data }) {
    const nodeStyle = {
        position: 'relative',
        borderRadius: '2rem',
    };
    const handleStyle = {
        opacity: '0',
    };

    return (
        <div style={nodeStyle} className='react-flow__node-default'>
            <div>{data.label}</div>
            <Handle style={handleStyle} type='target' position={Position.Top}/>
        </div>
    )
}