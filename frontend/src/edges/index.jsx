import AddNodeEdge from './AddNodeEdge.tsx';


export const initialEdges = [
    {
        id: 'start->end',
        source: 'start',
        target: 'end',
        type: 'add-action-node-edge',
    },
];

export const edgeTypes = {
    'add-action-node-edge': AddNodeEdge,
};