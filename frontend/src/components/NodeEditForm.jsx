import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { createPortal } from 'react-dom';
import '../css/NodeEditForm.css';


export function NodeEditForm({ isOpen, onClose, nodeId, initialLabel }) {
    const { setNodes } = useReactFlow();
    const [nodeName, setNodeName] = useState(initialLabel);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!nodeId) return;

        setNodes((nodes) => 
            nodes.map((node) => 
                node.id === nodeId ? { ...node, data: { ...data, label: nodeName } } : node
            )
        );
        onClose();
    };

    return createPortal (
        <div className={`node-edit-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='node-edit-form' onSubmit={handleSubmit}>
                <div className='edit-form-header'>
                    <p>Edit Action</p>
                    <a href='#'>X</a>
                </div>
                <div className='edit-form-body'>
                    <label>Action Name</label>
                    <input
                        type='text'
                        placeholder='Enter action name here..'
                        autoFocus
                    />
                </div>
                <div className='edit-form-footer'>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={onClose}>Cancel</button>
                    <button type='submit'>Delete</button>
                </div>
            </form>
        </div>,
        document.body
    );
};