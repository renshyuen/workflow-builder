import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useReactFlow } from '@xyflow/react';
import '../css/editIfElseNode.css';


export default function EditIfElseNode({ nodeId, branches, isOpen, onClose }) {

    const [branchList, setBranchList] = useState((branches || []).map(branch => typeof branch === 'string' ? branch : branch.name));
    const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

    const onAddBranchClick = () => {
        setBranchList([...branchList, 'New Branch']);
    };

    const onSaveClick = (event) => {
        event.preventDefault();
        if (!nodeId) return;

        const currentNodes = getNodes();
        const ifElseNode = currentNodes.find(node => node.id === nodeId);
        const existingBranches = ifElseNode.data.branches || [];

        const updatedBranches = branchList.map((branchName, index) => {
            const existingBranch = existingBranches[index] || {};
            return {
                name: branchName,
                branchNodeId: existingBranch.branchNodeId || `branch-${nodeId}-${Date.now()}-${index}`,
                endNodeId: existingBranch.endNodeId || `end-${nodeId}-${Date.now()}-${index}`
            };
        });

        const nodesToKeep = currentNodes.filter(node => !node.id.startsWith(`${nodeId}-branch`) && !node.id.startsWith(`${nodeId}-end`));
    
        const newNodes = updatedBranches.flatMap((branch, index) => {
            const existingBranchNode = currentNodes.find(node => node.id === branch.branchNodeId);
            const existingEndNode = currentNodes.find(node => node.id === branch.endNodeId);

            return [
                {
                    id: branch.branchNodeId,
                    data: { label: branch.name },
                    position: existingBranchNode ? existingBranchNode.position : {
                        x: (ifElseNode.position.x + 200) - (index * 200),
                        y: ifElseNode.position.y + 100,
                    },
                    type: 'branch-node',
                },
                {
                    id: branch.endNodeId,
                    data: { label: 'End' },
                    position: existingEndNode ? existingEndNode.position : {
                        x: (ifElseNode.position.x + 200) - (index * 200),
                        y: ifElseNode.position.y + 200,
                    },
                    type: 'end-node',
                }
            ];
        });
    
        const newEdges = updatedBranches.flatMap(branch => [
            {
                id: `${nodeId}-${branch.branchNodeId}`,
                source: nodeId,
                target: branch.branchNodeId,
                type: 'smoothstep',
            },
            {
                id: `${branch.branchNodeId}-${branch.endNodeId}`,
                source: branch.branchNodeId,
                target: branch.endNodeId,
                type: 'button-edge',
            }
        ]);
    
        
        setNodes([ ...nodesToKeep, ...newNodes, { ...ifElseNode, data: { ...ifElseNode.data, branches: updatedBranches } }]);
        setEdges(edges => [...edges.filter(edge => !edge.source.startsWith(nodeId)), ...newEdges]);
        
        onClose();
    };

    const onDeleteClick = () => {
        if (!nodeId) return;

        const currentNodes = getNodes();
        const currentEdges = getEdges();
        const ifElseNode = currentNodes.find(node => node.id === nodeId);

        if (!ifElseNode) return;

        const newEndNode = {
            id: `end-${Date.now()}`,
            data: { label: 'End' },
            position: ifElseNode.position,
            type: 'end-node',
        };

        const incomingEdge = currentEdges.find(edge => edge.target === nodeId);

        const relatedNodes = new Set([nodeId]);
        const relatedEdges = new Set();

        const branches = ifElseNode.data.branches || [];
        branches.forEach(branch => {
            relatedNodes.add(branch.branchNodeId);
            relatedEdges.add(branch.endNodeId);
        });

        const findDownstream = (nodeId) => {
            const outgoingEdges = currentEdges.filter(edge => edge.source === nodeId);
            outgoingEdges.forEach(edge => {
                relatedEdges.add(edge.id);
                if (!relatedNodes.has(edge.target)) {
                    relatedNodes.add(edge.target);
                    findDownstream(edge.target);
                }
            });
        };

        branches.forEach(branch => {
            findDownstream(branch.branchNodeId);
            findDownstream(branch.endNodeId);
        });

        const filteredNodes = currentNodes.filter(node => !relatedNodes.has(node.id));
        const filteredEdges = currentEdges.filter(edge => !relatedNodes.has(edge.source) && !relatedNodes.has(edge.target) && !relatedEdges.has(edge.id));

        const finalNodes = [...filteredNodes, newEndNode];
        const finalEdges = filteredEdges.filter(edge => edge.id !== incomingEdge?.id);

        if (incomingEdge) {
            finalEdges.push({
                ...incomingEdge,
                target: newEndNode.id,
                id: `${incomingEdge.source}->${newEndNode.id}`,
            });
        }

        setNodes(finalNodes);
        setEdges(finalEdges);

        onClose();
    };

    return createPortal(
        <div className={`edit-ifelse-node-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='edit-ifelse-node-form' onSubmit={onSaveClick}>
                <div className='edit-ifelse-node-form-branch-section'>
                    <h3>Branches</h3>
                    {branchList.map((branch, index) => (
                        <input key={index} value={branch.name} type='text' onChange={(entity) => {
                            const newBranches = [...branchList];
                            newBranches[index] = entity.target.value;
                            setBranchList(newBranches);
                        }} placeholder='Enter branch name..' />
                    ))}
                    <a href='#' onClick={onAddBranchClick}>+ Add Branch</a>
                </div>
                <div className='edit-ifelse-node-form-else-section'>
                    <h3>Else</h3>
                </div>
                <div>
                    <button type='submit'>Save</button>
                    <button type='button' onClick={onClose}>Cancel</button>
                    <button type='button' onClick={onDeleteClick}>Delete</button>
                </div>
            </form>
        </div>,
        document.body
    );

}