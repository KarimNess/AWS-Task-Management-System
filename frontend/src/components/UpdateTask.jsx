import React, { useState } from 'react';
import { updateTask } from '../api/taskAp';

function UpdateTask() {
    const [taskId, setTaskId] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskId) {
            setMessage('Task ID is required');
            return;
        }

        try {
            const response = await updateTask(taskId, formData);
            setMessage(response.message || 'Task updated');
            setTaskId('');
            setFormData({
                title: '',
                description: '',
                status: '',
                priority: '',
                due_date: ''
            });
        } catch (error) {
            setMessage('Failed to send update task event');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Update Task</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Task ID"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="priority"
                    placeholder="Priority"
                    value={formData.priority}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Update Task</button>
            </form>
            {message && (
                <p style={message.toLowerCase().includes('fail') ? styles.error : styles.success}>
                    {message}
                </p>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 500,
        margin: '40px auto',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        backgroundColor: '#f1f3f5',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center',
    },
    title: {
        marginBottom: 20,
        color: '#222',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    input: {
        padding: '12px 16px',
        borderRadius: 8,
        border: '1.5px solid #ccc',
        fontSize: 16,
        outline: 'none',
        transition: 'border-color 0.3s ease',
    },
    button: {
        padding: '12px',
        borderRadius: 8,
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 5px 12px rgba(0, 123, 255, 0.4)',
        transition: 'background-color 0.3s ease',
    },
    success: {
        marginTop: 15,
        color: 'green',
        fontWeight: '600',
    },
    error: {
        marginTop: 15,
        color: 'red',
        fontWeight: '600',
    }
};

export default UpdateTask;
