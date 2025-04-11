import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../css/nodeBuilder.css';


export default function NodeBuilder({ isOpen, onClose, onNodeAdd }) {

    const [selectedNodeType, setSelectedNodeType] = useState('action-node');

    const onConfirmClick = (event) => {
        event.preventDefault();
        onNodeAdd(selectedNodeType);
        onClose();
    };

    return createPortal(
        <div className={`node-builder-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='node-builder-form' onSubmit={onConfirmClick}>
                <div className='node-builder-form-header'>
                    <h3>Select Node Type</h3>
                </div>
                <div className='node-builder-form-body'>
                    <select name='node-type-dropdown' onChange={(e) => setSelectedNodeType(e.target.value)}>
                        <option value='action-node'>Action Node</option>
                        <option value='ifelse-node'>If/Else Node</option>
                    </select>
                </div>
                <div className='node-builder-form-footer'>
                    <button type='submit'>Confirm</button>
                    <button type='button' onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>,
        document.body
    );

}