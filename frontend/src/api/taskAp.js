import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/tasks";

export async function createTask(data) {
    const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
}

export const deleteTask = async (taskId) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${taskId}`);
    return response.data;
};

export async function uploadFile(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/${taskId}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
    }

    return response.json();
}

export const updateTask = async (taskId, updatedFields) => {
    const response = await fetch(`${API_BASE_URL}/update/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return await response.json();
};

export async function viewTask(taskId) {
    const response = await fetch(`https://qt0299fe15.execute-api.us-east-1.amazonaws.com/deploy/tasks/${taskId}`);

    if (!response.ok) {
        let errorMessage = 'Failed to fetch task';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // ignore JSON parsing error here
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export const viewAllTasks = async () => {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return await response.json();
};