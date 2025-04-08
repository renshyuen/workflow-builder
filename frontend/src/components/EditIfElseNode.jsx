import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useReactFlow } from '@xyflow/react';
import '../css/editIfElseNode.css';


export default function EditIfElseNode({ nodeId, branches, isOpen, onClose }) {

    const [branchList, setBranchList] = useState(branches || []);
    const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

    const NODE_WIDTH = 150;
    const NODE_HEIGHT = 50;

    const onAddBranchClick = () => {
        /**
         *  Add a new empty branch input for users and update the branch list.
         */

        setBranchList([...branchList, '']);
    };

    let branchCounter = 0;
    const onSaveClick = () => {
        if (!nodeId) return;

        const currentNodes = getNodes();
        const currentEdges = getEdges();
        const ifElseNode = currentNodes.find(node => node.id === nodeId);
        const existingBranches = ifElseNode.data.branches || [];
        // const newNodes = [];
        // const newEdges = [];

        // branchList.forEach((branch, index) => {
        //     const uniqueId = Date.now() + '-' + index;
        //     const branchNodeId = `${nodeId}-branch-${uniqueId}-${branchCounter++}`;
        //     const branchEndNodeId = `${branchNodeId}-end`;

        //     newNodes.push(
        //         {
        //             id: branchNodeId,
        //             style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        //             data: { label: branch },
        //             position: {
        //                 x: currentNodes.find(node => node.id === nodeId).position.x + index * 200,
        //                 y: currentNodes.find(node => node.id === nodeId).position.y + 100,
        //             },
        //             type: 'branch-node',
        //         },
        //         {
        //             id: branchEndNodeId,
        //             style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        //             data: { label: 'End' },
        //             position: {
        //                 x: currentNodes.find(node => node.id === nodeId).position.x + index * 200,
        //                 y: currentNodes.find(node => node.id === nodeId).position.y + 200,
        //             },
        //             type: 'end-node',
        //         }
        //     );
        //     newEdges.push(
        //         {
        //             id: `${nodeId}->${branchNodeId}`,
        //             source: nodeId,
        //             target: branchNodeId,
        //             type: 'smoothstep',
        //         },
        //         {
        //             id: `${branchNodeId}->${branchEndNodeId}`,
        //             source: branchNodeId,
        //             target: branchEndNodeId,
        //             type: 'button-edge',
        //         }
        //     );    
        // });

        // setNodes(nodes => [...nodes, ...newNodes]);
        // setEdges(edges => [...edges, ...newEdges]);

        const updatedBranches = branchList.map((branchName, index) => {
            // Preserve existing node IDs if available
            const existingBranch = existingBranches[index] || {};
            return {
                name: branchName,
                branchNodeId: existingBranch.branchNodeId || `branch-${nodeId}-${Date.now()}-${index}`,
                endNodeId: existingBranch.endNodeId || `end-${nodeId}-${Date.now()}-${index}`
            };
        });
    
        // Get all nodes to keep (remove old branch nodes)
        const nodesToKeep = currentNodes.filter(node => 
            !node.id.startsWith(`${nodeId}-branch`) && 
            !node.id.startsWith(`${nodeId}-end`)
        );
    
        // Create new nodes array
        const newNodes = updatedBranches.flatMap((branch, index) => [
            {
                id: branch.branchNodeId,
                data: { label: branch.name },
                position: {
                    x: ifElseNode.position.x + (index * 200),
                    y: ifElseNode.position.y + 100,
                },
                type: 'branch-node',
            },
            {
                id: branch.endNodeId,
                data: { label: 'End' },
                position: {
                    x: ifElseNode.position.x + (index * 200),
                    y: ifElseNode.position.y + 200,
                },
                type: 'end-node',
            }
        ]);
    
        // Update edges
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
    
        // Update the If/Else node with new branch data
        setNodes([
            ...nodesToKeep,
            ...newNodes,
            {
                ...ifElseNode,
                data: {
                    ...ifElseNode.data,
                    branches: updatedBranches
                }
            }
        ]);
    
        setEdges(edges => [
            ...edges.filter(edge => !edge.source.startsWith(nodeId)),
            ...newEdges
        ]);
        
        onClose();
    };

    const onDeleteClick = () => {
        /**
         *  This deletes the whole If/Else Node and any of the following connected
         *  existing branches, as well as the end nodes connected. Replaced with an
         *  end node.
         */
    };

    return createPortal(
        <div className={`edit-ifelse-node-form-popup ${isOpen ? 'open' : ''}`}>
            <form className='edit-ifelse-node-form' onSubmit={onSaveClick}>
                <div className='edit-ifelse-node-form-branch-section'>
                    <h3>Branches</h3>
                    {branchList.map((branch, index) => (
                        <input key={index} type='text' onChange={(entity) => {
                            const newBranches = [...branchList];
                            newBranches[index] = entity.target.value;
                            setBranchList(newBranches);
                        }} placeholder='New Branch' />
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