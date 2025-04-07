import { useCallback } from 'react';
import { Background, Controls, MiniMap, ReactFlow, addEdge, useNodesState, useEdgesState } from '@xyflow/react';
import { initialNodes, nodeTypes } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import '@xyflow/react/dist/style.css';


export default function App() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );

    return (
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} colorMode="system"  fitView>
            <Background />
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
}