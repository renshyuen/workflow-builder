import React, { useState } from 'react';
import { useReactFlow, BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import NodeBuilder from '../components/NodeBuilder.jsx';
import EditIfElseNode from '../components/EditIfElseNode.jsx';


export default function ButtonEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {

    const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    const [isNodeBuilderOpen, setIsNodeBuilderOpen] = useState(false);
    const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
    
    const edgeLabelStyle = {
        position: 'absolute',
        transformOrigin: 'center',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
    };

    const handleAddNodeClick = (nodeType) => {

        const NODE_WIDTH = 150;
        const NODE_HEIGHT = 50;
        const OFFSET_Y = 50;
        const NODE_INSERTION_POSITION_X = labelX - (NODE_WIDTH / 2);
        const NODE_INSERTION_POSITION_Y = labelY - (NODE_HEIGHT / 2);
        const BRANCH_NODE_INSERTION_POSITION_X = NODE_INSERTION_POSITION_X;
        const BRANCH_NODE_INSERTION_POSITION_Y = NODE_INSERTION_POSITION_Y + 100;
        const ELSE_NODE_INSERTION_POSITION_X = NODE_INSERTION_POSITION_X + 200;
        const ELSE_NODE_INSERTION_POSITION_Y = NODE_INSERTION_POSITION_Y + 100;
        const currentEdges = getEdges();
        const currentNodes = getNodes();

        /**
         *  This is a recursive graph traversal mini-helper function 
         *  for me to find all the downstream nodes and edges.
         */
        const findDownStream = (nodeId, visitedNodes = new Set(), visitedEdges = new Set()) => {
            if (visitedNodes.has(nodeId)) return;

            visitedNodes.add(nodeId);

            currentEdges.forEach((edge) => {
                if (edge.source === nodeId) {
                    visitedEdges.add(edge.id);
                    findDownStream(edge.target, visitedNodes, visitedEdges);
                }
            });
        };

        if (nodeType === 'ifelse-node') { 
            const ifElseNodeId = `ifelse-${Date.now()}`;
            const branchNodeId = `branch-${Date.now()}`;
            const branchEndNodeId = `branchEnd-${Date.now()}`;
            const elseNodeId = `else-${Date.now()}`;
            const elseEndNodeId = `elseEnd-${Date.now()}`;

            const downstreamNodes = new Set();
            const downstreamEdges = new Set();
            findDownStream(target, downstreamNodes, downstreamEdges);
            setNodes((nodes) => nodes.filter((node) => !downstreamNodes.has(node.id)));
            setEdges((edges) => edges.filter((edge) => !downstreamEdges.has(edge.id)));

            const newNodes = [
                {
                    id: ifElseNodeId,
                    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
                    data: {
                        label: 'If Else',
                        branches: [
                            {
                                name: 'Branch',
                                branchNodeId: branchNodeId,
                                endNodeId: branchEndNodeId
                            },
                            {
                                name: 'Else',
                                branchNodeId: elseNodeId,
                                endNodeId: elseEndNodeId
                            }
                        ]
                    },
                    position: {
                        x: NODE_INSERTION_POSITION_X,
                        y: NODE_INSERTION_POSITION_Y,
                    },
                    type: 'ifelse-node',
                },
                {
                    id: branchNodeId,
                    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
                    data: { label: 'Branch' },
                    position: {
                        x: BRANCH_NODE_INSERTION_POSITION_X,
                        y: BRANCH_NODE_INSERTION_POSITION_Y,
                    },
                    type: 'branch-node',
                },
                {
                    id: branchEndNodeId,
                    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
                    data: { label: 'End' },
                    position: {
                        x: BRANCH_NODE_INSERTION_POSITION_X,
                        y: BRANCH_NODE_INSERTION_POSITION_Y + 100,
                    },
                    type: 'end-node',
                },
                {
                    id: elseNodeId,
                    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
                    data: { label: 'Else' },
                    position: {
                        x: ELSE_NODE_INSERTION_POSITION_X,
                        y: ELSE_NODE_INSERTION_POSITION_Y,
                    },
                    type: 'branch-node',
                },
                {
                    id: elseEndNodeId,
                    style: { width: NODE_WIDTH, height: NODE_HEIGHT },
                    data: { label: 'End' },
                    position: {
                        x: ELSE_NODE_INSERTION_POSITION_X,
                        y: ELSE_NODE_INSERTION_POSITION_Y + 100,
                    },
                    type: 'end-node',
                },
            ];
            const newEdges = [
                {
                    id: `${source}->${ifElseNodeId}-${Date.now()}`,
                    source: source,
                    target: ifElseNodeId,
                    type: 'button-edge',
                },
                {
                    id: `${ifElseNodeId}->${branchNodeId}-${Date.now()}`,
                    source: ifElseNodeId,
                    target: branchNodeId,
                    type: 'smoothstep',
                },
                {
                    id: `${branchNodeId}->${branchEndNodeId}-${Date.now()}`,
                    source: branchNodeId,
                    target: branchEndNodeId,
                    type: 'button-edge',
                },
                {
                    id: `${ifElseNodeId}->${elseNodeId}-${Date.now()}`,
                    source: ifElseNodeId,
                    target: elseNodeId,
                    type: 'smoothstep',
                },
                {
                    id: `${elseNodeId}->${elseEndNodeId}-${Date.now()}`,
                    source: elseNodeId,
                    target: elseEndNodeId,
                    type: 'button-edge',
                },
            ];

            setNodes((nodes) => [...nodes, ...newNodes]);
            setEdges((edges) => [...edges, ...newEdges]);

            return;
        }

        setEdges(edges => edges.filter(edge => edge.id !== id));

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            style: { width: 150, height: 50 },
            data: { label: nodeType === 'action-node' ? 'Action Node' : 'If/Else Node' },
            position: {
                x: NODE_INSERTION_POSITION_X,
                y: NODE_INSERTION_POSITION_Y,
            },
            type: 'action-node',
        };
        const newEdges = [
            {
                id: `edge-${source}->${newNodeId}-${Date.now()}`,
                source: source,
                target: newNodeId,
                type: 'button-edge',
            },
            {
                id: `edge-${newNodeId}->${target}-${Date.now()}`,
                source: newNodeId,
                target: target,
                type: 'button-edge',
            },
        ];

        setNodes((nodes) => [...currentNodes, newNode]);
        setEdges((edges) => [...edges, ...newEdges]); 

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