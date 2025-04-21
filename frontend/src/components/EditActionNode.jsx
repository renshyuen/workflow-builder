import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getConnectedEdges, useReactFlow, getIncomers, getOutgoers } from '@xyflow/react';
import '../css/editActionNode.css';


export default function EditActionNode({ nodeId, initialLabel, isOpen, onClose }) {

    const { setNodes, setEdges, getNodes } = useReactFlow();
    const [nodeLabel, setNodeLabel] = useState(initialLabel);

    const onSaveClick = (event) => {
        event.preventDefault();
        if (!nodeId) return;

        if (!nodeLabel.trim()) {
            alert('Action name input cannot be empty!');
            return;
        }

        setNodes((nodes) => nodes.map((node) => 
            node.id === nodeId ? { ...node, data: { ...node.data, label: nodeLabel } } : node)
        );

        onClose();
    };

    const onDeleteClick = () => {
        if (!nodeId) return;

        setEdges((edges) => {
            const incomers = getIncomers({ id: nodeId }, getNodes(), edges);
            const outgoers = getOutgoers({ id: nodeId }, getNodes(), edges);
            const connectedEdges = getConnectedEdges([{ id: nodeId }], edges);
            const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge));
            const newEdges = incomers.flatMap(({ id: source }) => outgoers.map(({ id: target }) => ({
                id: `${source}->${target}-${Date.now()}`,
                source,
                target,
                type: 'button-edge',
            })));

            return [...remainingEdges, ...newEdges];
        });

        setNodes((nodes) => nodes.filter(node => node.id !== nodeId));
        onClose();
    };

    return createPortal(
        <div className={`edit-action-node-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='edit-action-node-form' onSubmit={onSaveClick}>
                <div className='edit-action-node-form-header'>
                    <h3>Action</h3>
                </div>
                <div className='edit-action-node-form-body'>
                    <label>Action Name</label>
                    <input type='text' onChange={(entity) => setNodeLabel(entity.target.value)} placeholder='Enter action name..' autoFocus/>
                </div>
                <div className='edit-action-node-form-footer'>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={onClose}>Cancel</button>
                    <button type='button' onClick={onDeleteClick}>Delete</button>
                </div>
            </form>
        </div>,
        document.body
    );

}