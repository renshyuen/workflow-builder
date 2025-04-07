import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { NodeEditForm } from '../components/NodeEditForm';


export function ActionNode({ id, data }) {
    const [isEditing, setIsEditing] = useState(false);
    const { setNodes, setEdges } = useReactFlow();

    const nodeStyle = {
        position: 'relative',
    };
    const handleStyle = {
        opacity: '0',
    };

    return (
        <>
            <div style={nodeStyle} className='react-flow__node-default'>
                <Handle style={handleStyle} type='target' position={Position.Top} />
                <div onDoubleClick={() => setIsEditing(true)}>
                    {data.label}
                </div>
                <Handle style={handleStyle} type='source' position={Position.Bottom} />  
            </div>

            <NodeEditForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                nodeId={id}
                initialLabel={data.label}
            />
        </>
    )
}