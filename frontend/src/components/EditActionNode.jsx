import { createPortal } from 'react-dom';
import '../css/editActionNode.css';


export default function EditActionNode({ isOpen, onClose }) {

    const onSaveClick = () => {

    };

    const onDeleteClick = () => {

    };

    return createPortal(
        <div className={`edit-action-node-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='edit-action-node-form' onSubmit={onSaveClick}>
                <div className='edit-action-node-form-header'>
                    <h3>Action</h3>
                </div>
                <div className='edit-action-node-form-body'>
                    <label for='action-name'>Action Name</label>
                    <input placeholder='Enter action name..'/>
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