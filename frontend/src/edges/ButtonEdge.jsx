import React, { useState } from 'react';
import { useReactFlow, BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import NodeBuilder from '../components/NodeBuilder.jsx';


export default function ButtonEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {

    const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    const [isNodeBuilderOpen, setIsNodeBuilderOpen] = useState(false);
    
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
    
    const edgeLabelStyle = {
        position: 'absolute',
        transformOrigin: 'center',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
    };

    const handleAddNodeClick = (nodeType) => {

        if (nodeType === 'ifelse-node') {   
            alert('If/Else Node has not been implemented yet!');
            return;
        }

        const currentNodes = getNodes();
        const currentEdges = getEdges();

        const adjustUpstreamNodes = (nodeId, offsetY, visited = new Set()) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            currentNodes.forEach((node) => {
                if (node.id === nodeId) {
                    node.position = {
                        x: node.position.x,
                        y: node.position.y + offsetY,
                    };
                }
            });

            currentEdges.forEach((edge) => {
                if (edge.target === nodeId) {
                    adjustUpstreamNodes(edge.source, offsetY, visited);
                }
            });
        };

        const adjustDownstreamNodes = (nodeId, offsetY, visited = new Set()) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            currentNodes.forEach((node) => {
                if (node.id === nodeId) {
                    node.position = {
                        x: node.position.x,
                        y: node.position.y + offsetY,
                    };
                }
            });
            
            currentEdges.forEach((edge) => {
                if (edge.source === nodeId) {
                    adjustDownstreamNodes(edge.target, offsetY, visited);
                }
            });
        };

        adjustDownstreamNodes(target, 50);
        adjustUpstreamNodes(source, -50);

        const newNodeId = `${getNodes().length + 1}`;
        const newNode = {
            id: newNodeId,
            position: {
                x: labelX - (150 / 2),
                y: labelY - (50 / 2),
            },
            data: { label: nodeType === 'action-node' ? 'Action Node' : 'If Else' },
            type: nodeType,
        };
        
        const newEdges = [
            {
                id: `${source}->${newNodeId}`,
                source: source,
                target: newNodeId,
                type: 'button-edge',
            },
            {
                id: `${newNodeId}->${target}`,
                source: newNodeId,
                target: target,
                type: 'button-edge',
            },
        ];

        const updatedEdges = getEdges().filter(edge => edge.id !== id);

        setNodes((nodes) => [...currentNodes, newNode]);
        setEdges((edges) => [...updatedEdges, ...newEdges]);

    };


    return(
        <>
            <BaseEdge id={id} path={edgePath}/>
            <EdgeLabelRenderer>
                <div className='nodrag nopan' style={edgeLabelStyle}>
                    <button onClick={() => setIsNodeBuilderOpen(true)}><i className='ri-add-line' aria-label='true'></i></button>
                </div>
            </EdgeLabelRenderer>
            {isNodeBuilderOpen && <NodeBuilder edgeId={id} isOpen={isNodeBuilderOpen} onClose={() => setIsNodeBuilderOpen(false)} onNodeAdd={handleAddNodeClick}/>}
        </>
    )

}