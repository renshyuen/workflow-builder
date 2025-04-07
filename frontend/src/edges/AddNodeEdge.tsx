import React from 'react';
import { 
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps, 
    getSmoothStepPath,
    useReactFlow } from '@xyflow/react';

export default function AddNodeEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    source,
    target,
}: EdgeProps) {
    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const handleAddClick = () => {
        /* create an unique ID for the new node */
        const newNodeId = `action-${getNodes().length + 1}`;

        /* default node dimensions */
        const NODE_WIDTH = 150;
        const NODE_HEIGHT = 50;

        const currentNodes = getNodes();
        const currentEdges = getEdges();
    
        const OFFSET_Y = 50; // Distance to move nodes vertically
    
        // Recursive function to adjust positions of downstream nodes
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

        // Recursive function to adjust positions of upstream nodes
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

        // Adjust positions of all nodes connected to the target node (downstream)
        adjustDownstreamNodes(target, OFFSET_Y);

        // Adjust positions of all nodes connected to the source node (upstream)
        adjustUpstreamNodes(source, -OFFSET_Y);

        /* create the new node right at the button's position */
        const newNode = {
            id: newNodeId,
            position: {
                x: labelX - (NODE_WIDTH / 2),
                y: labelY - (NODE_HEIGHT / 2),
            },
            data: { label: 'Action Node' },
            type: 'action-node',
        };        

        /* create new edges connecting the new node */
        const newEdges = [
            {
                id: `${source}->${newNodeId}`,
                source: source,
                target: newNodeId,
                type: 'add-action-node-edge',
            },
            {
                id: `${newNodeId}->${target}`,
                source: newNodeId,
                target: target,
                type: 'add-action-node-edge',
            },
        ];

        /* remove the original edge */
        const updatedEdges = getEdges().filter(edge => edge.id !== id);

        /* now to update the graph */
        //setNodes((nodes) => [...nodes, newNode]);
        setNodes((nodes) => [...currentNodes, newNode]);
        setEdges((edges) => [...updatedEdges, ...newEdges]);
    };

    return (
        <>
            <BaseEdge id={id} path={edgePath}/>
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transformOrigin: 'center',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className='nodrag nopan'
                >
                    <button 
                        onClick={handleAddClick}
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        +
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}