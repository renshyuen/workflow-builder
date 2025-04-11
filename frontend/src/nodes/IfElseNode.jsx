import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import EditIfElseNode from '../components/EditIfElseNode';


export function IfElseNode({ id, data }) {

    const [isEditing, setIsEditing] = useState(false);

    const nodeData = {
        ...data,
        branches: data.branches || [
            {
                name: 'Branch',
                branchNodeId: `${id}-branch`,
            },
            {
                name: 'Else',
                branchNodeId: `${id}-else`,
            }
        ],
    };

    const nodeStyle = {
        position: 'relative',
    };

    const handleStyle = {
        opacity: '0',
    };

    return(
        <>
            <div style={nodeStyle} className='react-flow__node-default'>
                <Handle style={handleStyle} type='target' position={Position.Top}/>
                <div>
                    {data.label}
                    <button onClick={() => setIsEditing(true)}><i className="ri-edit-box-line" aria-label='edit'></i></button>
                </div>
                <Handle style={handleStyle} type='source' position={Position.Bottom}/>
            </div>

            <EditIfElseNode nodeId={id} branches={nodeData.branches} isOpen={isEditing} onClose={() => setIsEditing(false)} />
        </>
    );

}   