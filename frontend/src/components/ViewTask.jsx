import React, { useState } from 'react';
import { viewTask } from '../api/taskAp';

function ViewTask() {
    const [taskId, setTaskId] = useState('');
    const [taskData, setTaskData] = useState(null);
    const [message, setMessage] = useState('');

    const handleView = async (e) => {
        e.preventDefault();
        setTaskData(null);
        setMessage('');

        if (!taskId) {
            setMessage('Please enter a task ID');
            return;
        }

        try {
            const data = await viewTask(taskId);
            setTaskData(data);
        } catch (error) {
            setMessage(error.message || 'Failed to fetch task');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>View Task</h2>
            <form onSubmit={handleView} style={styles.form}>
                <input
                    type="text"
                    placeholder="Enter Task ID"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>View Task</button>
            </form>

            {message && <p style={styles.error}>{message}</p>}

            {taskData && (
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>{taskData.title || 'No Title'}</h3>
                    <p><strong>Description:</strong> {taskData.description || 'N/A'}</p>
                    <p><strong>Status:</strong> {taskData.status || 'N/A'}</p>
                    <p><strong>Priority:</strong> {taskData.priority || 'N/A'}</p>
                    <p><strong>Due Date:</strong> {taskData.due_date ? new Date(taskData.due_date).toLocaleString() : 'N/A'}</p>
                    <p><strong>Created By (UUID):</strong> {taskData.created_by || 'Unknown'}</p>
                    <p><strong>Created At:</strong> {taskData.created_at ? new Date(taskData.created_at).toLocaleString() : 'N/A'}</p>
                    <p><strong>Updated At:</strong> {taskData.updated_at ? new Date(taskData.updated_at).toLocaleString() : 'N/A'}</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 600,
        margin: '40px auto',
        padding: 30,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Segoe UI', sans-serif",
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#343a40',
    },
    form: {
        display: 'flex',
        gap: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 6,
        border: '1px solid #ced4da',
        outline: 'none',
    },
    button: {
        padding: '10px 16px',
        borderRadius: 6,
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
    },
    error: {
        color: '#dc3545',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
    },
    cardTitle: {
        marginBottom: 10,
        color: '#007bff',
    },
};

export default ViewTask;
