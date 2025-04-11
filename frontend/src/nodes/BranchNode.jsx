import React from 'react';
import { Handle, Position } from '@xyflow/react';


export function BranchNode({ data }) {

    const nodeStyle = {
        position: 'relative',
        borderRadius: '2rem',
    };

    const handleStyle = {
        opacity: '0',
    };

    return(
        <div style={nodeStyle} className='react-flow__node-default'>
            <Handle style={handleStyle} type='target' position={Position.Top}/>
            {data.label}
            <Handle style={handleStyle} type='source' position={Position.Bottom}/>
        </div>
    );

}