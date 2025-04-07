import React from 'react';
import ButtonEdge from './ButtonEdge.jsx';


export const initialEdges = [
    {
        id: 'start->end',
        source: 'start',
        target: 'end',
        type: 'button-edge',
    },
];

export const edgeTypes = {
    'button-edge': ButtonEdge,
};