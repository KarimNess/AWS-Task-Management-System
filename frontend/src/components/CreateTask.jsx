import React, { useState } from 'react';
import { createTask } from '../api/taskAp';

function CreateTask() {
    const [title, setTitle] = useState('');
    const [createdBy, setCreatedBy] = useState(''); // User's Cognito UUID or user id
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !createdBy) {
            setMessage('Please provide both title and created_by');
            return;
        }

        try {
            const response = await createTask({ title, created_by: createdBy });
            setMessage(response.message || 'Task creation event sent!');
            setTitle('');
            setCreatedBy('');
        } catch (error) {
            setMessage('Failed to send create task event');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create Task</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Created By (Cognito UUID)"
                    value={createdBy}
                    onChange={e => setCreatedBy(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Create Task</button>
            </form>
            {message && <p style={message.includes('Failed') ? styles.error : styles.success}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 400,
        margin: "40px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
    },
    title: {
        marginBottom: 25,
        color: "#222",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 15,
    },
    input: {
        padding: "12px 16px",
        borderRadius: 8,
        border: "1.5px solid #ddd",
        fontSize: 16,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease",
    },
    button: {
        padding: "12px",
        borderRadius: 8,
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        fontWeight: "700",
        fontSize: 16,
        cursor: "pointer",
        boxShadow: "0 5px 12px rgba(0, 123, 255, 0.4)",
        transition: "background-color 0.3s ease",
    },
    success: {
        marginTop: 20,
        color: "green",
        fontWeight: "600",
    },
    error: {
        marginTop: 20,
        color: "red",
        fontWeight: "600",
    }
};

export default CreateTask;
