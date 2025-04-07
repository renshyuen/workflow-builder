import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { createPortal } from 'react-dom';
import '../css/NodeEditForm.css';


export function NodeEditForm({ isOpen, onClose, nodeId, initialLabel }) {
    const { setNodes, setEdges } = useReactFlow();
    const [nodeName, setNodeName] = useState(initialLabel);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!nodeId) return;

        /* prevent empty input */
        if (!nodeName.trim()) {
            alert('Action name cannot be empty');
            return;
        }

        setNodes((nodes) => 
            nodes.map((node) => 
                node.id === nodeId ? { ...node, data: { ...node.data, label: nodeName } } : node
            )
        );
        onClose();
    };

    const handleDelete = () => {
        if (!nodeId) return;
        
        setEdges((edges) => {
            const targetEdge = edges.filter((edge) => edge.target === nodeId);
            const sourceEdge = edges.filter((edge) => edge.source === nodeId);

            /* create new edges to reconnect back the nodes */
            const newEdges = targetEdge.flatMap((targetEdge) => 
                sourceEdge.map((sourceEdge) => ({
                    id: `${targetEdge.source}->${sourceEdge.target}`,
                    source: targetEdge.source,
                    target: sourceEdge.target,
                    type: sourceEdge.type, // preserve the edge type
                }))
            );

            /* remove edges connected to the deleted node */
            return edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId).concat(newEdges);
        });

        setNodes((nodes) => nodes.filter(node => node.id !== nodeId));
        onClose();
    };


    return createPortal (
        <div className={`node-edit-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='node-edit-form' onSubmit={handleSubmit}>
                <div className='edit-form-header'>
                    <p>Edit Action</p>
                </div>
                <div className='edit-form-body'>
                    <label>Action Name</label>
                    <input
                        type='text'
                        // value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        placeholder='Enter action name here..'
                        autoFocus
                    />
                </div>
                <div className='edit-form-footer'>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={onClose}>Cancel</button>
                    <button type='button' onClick={handleDelete}>Delete</button>
                </div>
            </form>
        </div>,
        document.body
    );
};