import React from 'react';
import { 
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps, 
    getSmoothStepPath } from '@xyflow/react';

export default function AddEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const handleAddClick = () => {
        alert(`Add clicked on edge: ${id}`);

    }

    return (
        <>
            <BaseEdge id={id} path={edgePath}/>
            <EdgeLabelRenderer>
                <div className='nodrag nopan' style={{
                    position: 'absolute',
                    transformOrigin: 'center',
                    transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    pointerEvents: 'all',
                }}>
                    <button id='add-edge-btn' onClick={() => {
                        console.log('Click me daddy')
                    }}>
                        +
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}