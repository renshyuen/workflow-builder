import AddEdge from './AddEdge.tsx';


export const initialEdges = [
    {
        id: 'start->end',
        source: 'start',
        target: 'end',
        type: 'custom-add',
    },
];

export const edgeTypes = {
    'custom-add': AddEdge,
};