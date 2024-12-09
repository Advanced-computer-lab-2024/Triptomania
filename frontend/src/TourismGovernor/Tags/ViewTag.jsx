import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance'; // Update import to axiosInstance
import './ViewTag.css';

const ViewTag = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [editTagId, setEditTagId] = useState(null);
    const [editTagName, setEditTagName] = useState('');

    useEffect(() => {   
        fetchTags();
    }, []); // Empty dependency array ensures fetchTags runs on every page refresh

    const fetchTags = async () => {
        console.log('Fetching tags...');
        try {
            const response = await axiosInstance.get('/api/tourismGovernor/getTags');
            setTags(response.data.tags || []);  // Ensure tags is an array
        } catch (error) {
            console.error('Error fetching tags:', error);
            setTags([]); // Reset tags on error
        }
    };

    const handleAddTag = async () => {
        if (!newTagName.trim()) {
            alert("Tag name cannot be empty!");
            return;
        }

        try {
            await axiosInstance.post('/api/tourismGovernor/addTag', { name: newTagName });
            setNewTagName('');
            fetchTags();
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const handleUpdateTag = async () => {
        if (!editTagName.trim()) {
            alert("Tag name cannot be empty!");
            return;
        }

        try {
            await axiosInstance.put('/api/tourismGovernor/updateTag', { id: editTagId, name: editTagName });
            setEditTagId(null);
            setEditTagName('');
            fetchTags();
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            await axiosInstance.delete('/api/tourismGovernor/deleteTag', { data: { id } });
            fetchTags();
            window.location.reload(); // Refresh the page
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    return (
        <div className="container-tag">
            <h1>Manage Tags</h1>

            <div className="add-tag">
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name"
                />
                <button onClick={handleAddTag}>Add Tag</button>
            </div>

            <div className="tag-list">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <div key={tag._id} className="tag-item">
                            {editTagId === tag._id ? (
                                <input
                                    type="text"
                                    value={editTagName}
                                    onChange={(e) => setEditTagName(e.target.value)}
                                />
                            ) : (
                                <span>{tag.name}</span>
                            )}

                            <div className="tag-actions">
                                {editTagId === tag._id ? (
                                    <button onClick={handleUpdateTag}>Save</button>
                                ) : (
                                    <button onClick={() => {
                                        setEditTagId(tag._id);
                                        setEditTagName(tag.name);
                                    }}>Edit</button>
                                )}
                                <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tags found.</p>
                )}
            </div>
            <button onClick={() => history.push('/tourismGovernor/home')}>Back to Home</button>
        </div>
    );
};

export default ViewTag;
