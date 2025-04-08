import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import EditActionNode from '../components/EditActionNode.jsx';

export function ActionNode({ id, data }) {

    const [isEditing, setIsEditing] = useState(false);

    const nodeStyle = {
        position: 'relative',
    };

    const handleStyle = {
        opacity: '0',
    };

    const anchorStyle = {
        textDecoration: 'none',
        cursor: 'pointer',
    };

    return(
        <>
            <div style={nodeStyle} className='react-flow__node-default'> 
                <Handle style={handleStyle} type='target' position={Position.Top}/>
                <div>
                    {data.label}
                    <a onClick={() => setIsEditing(true)} style={anchorStyle}><i className="ri-edit-box-line" aria-label='true'></i></a>
                </div>
                <Handle style={handleStyle} type='source' position={Position.Bottom}/>
            </div>
            
            <EditActionNode nodeId={id} initialLabel={data.label} isOpen={isEditing} onClose={() => setIsEditing(false)}/>
        </>
    );

}