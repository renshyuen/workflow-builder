import { PositionLoggerNode } from './PositionLoggerNode.jsx';
import { EndNode } from './EndNode.jsx';
import { StartNode } from './StartNode.jsx';
import { ActionNode } from './ActionNode.jsx';

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
        data: { label: 'End' },
        position: { x: 0, y: 100 },
        style: { width: 150, height: 50 },
        type: 'end-node',
    },
];

export const nodeTypes = {
    'position-logger': PositionLoggerNode,
    'start-node': StartNode,
    'end-node': EndNode,
    'action-node': ActionNode,
    /**
     *  custom nodes here
     */
};