import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_BASE_URL = "https://18.212.15.62:5000/tasks";

export async function createTask(data) {
  const oidcKey = 'oidc.user:https://cognito-idp.us-east-1.amazonaws.com/us-east-1_AAKNbv8oC:65rlfov95907n18k29kd87aps2';
  const authData = JSON.parse(localStorage.getItem(oidcKey));

  if (!authData?.id_token) {
    throw new Error('User not authenticated');
  }

  // Validate required fields
  if (!data.title || !data.created_by) {
    throw new Error('Title and created_by are required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id_token}`
      },
      body: JSON.stringify({
        title: data.title,
        created_by: data.created_by,
        description: data.description || null,
        status: data.status || null,
        priority: data.priority || null,
        due_date: data.due_date || null
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Network Error:', error);
    throw error;
  }
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


// export const viewAllTasksByUUID = async (uuid) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/viewall?created_by=${uuid}`);
        
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || 'Failed to fetch tasks');
//         }
        
//         return await response.json();
//     } catch (error) {
//         console.error('Error in viewAllTasksByUUID:', error);
//         throw error;
//     }
// };