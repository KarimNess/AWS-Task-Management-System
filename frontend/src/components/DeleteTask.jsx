import React, { useState } from 'react';
import { deleteTask } from '../api/taskAp';

function DeleteTask() {
    const [taskId, setTaskId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!taskId) {
            setMessage('Please enter a task ID');
            return;
        }

        const numericTaskId = parseInt(taskId);
        if (isNaN(numericTaskId)) {
            setMessage('Task ID must be a number');
            return;
        }

        try {
            const response = await deleteTask(numericTaskId);
            setMessage(response.message || 'Delete event sent');
            setTaskId('');
        } catch (error) {
            console.error('Delete error:', error);
            setMessage('Failed to send delete task event');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Delete Task</h2>
            <form onSubmit={handleDelete} style={styles.form}>
                <input
                    type="number"
                    placeholder="Task ID"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Delete Task</button>
            </form>
            {message && (
                <p style={message.toLowerCase().includes('failed') ? styles.error : styles.success}>
                    {message}
                </p>
            )}
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
        backgroundColor: "#dc3545",
        color: "white",
        fontWeight: "700",
        fontSize: 16,
        cursor: "pointer",
        boxShadow: "0 5px 12px rgba(220, 53, 69, 0.4)",
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

export default DeleteTask;
