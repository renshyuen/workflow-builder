import React from 'react';
import { EndNode } from './EndNode.jsx';
import { StartNode } from './StartNode.jsx';
import { ActionNode } from './ActionNode.jsx';
import { IfElseNode } from './IfElseNode.jsx';

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
    'start-node': StartNode,
    'end-node': EndNode,
    'action-node': ActionNode,
    'ifelse-node': IfElseNode,
};