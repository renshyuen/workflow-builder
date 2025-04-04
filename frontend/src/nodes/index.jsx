import { EndNode } from './EndNode.jsx';
import { PositionLoggerNode } from './PositionLoggerNode.jsx';
import { StartNode } from './StartNode.jsx';

export const initialNodes = [
    {
        id: 'start',
        data: { label: 'Start' },
        position: { x: 0, y: 0 },
        style: { width: 150, height: 50 },
        type: 'start-node',
    },
    {
        id: 'end',
        data: { label: 'END' },
        position: { x: 0, y: 100 },
        style: { width: 150, height: 50 },
        type: 'end-node',
    },
];

export const nodeTypes = {
    'position-logger': PositionLoggerNode,
    'start-node': StartNode,
    'end-node': EndNode,
    // add any custom nodes here 
};