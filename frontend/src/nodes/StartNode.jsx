import React from 'react';
import { Handle, Position } from '@xyflow/react';


export function StartNode({ data }) {
    return (
        <div className='react-flow__node-default' style={{
            borderRadius: '0.1rem',
            
        }}>
            <div>{data.label}</div>
            <Handle type='source' position={Position.Bottom}/>
        </div>
    )
}