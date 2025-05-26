import React, { useState } from 'react';
import { 
  createTask, 
  viewTask, 
  updateTask, 
  deleteTask, 
  uploadFile 
} from '../api/taskAp';
import './TaskManager.css';

const TaskManager = ({ uuid }) => {
  // State management
  const [taskId, setTaskId] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    created_by: '',
    description: '',
    status: '',
    priority: '',
    due_date: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'

  // Handle create task
  // In your handleCreate function, replace with:
const handleCreate = async (e) => {
  e.preventDefault();
  
  if (!formData.title) {
    showMessage('Please provide a title', 'error');
    return;
  }

  try {
    console.log('Using UUID:', uuid); // Verify UUID is correct
    
    const taskData = {
      title: formData.title,
      created_by: uuid, // Using the UUID from props
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date
    };

    console.log('Sending to API:', taskData);
    const response = await createTask(taskData);
    console.log('API Response:', response);
    
    showMessage('Task created successfully!', 'success');
    resetForm();
  } catch (error) {
    console.error('API Error:', error);
    showMessage(error.message || 'Failed to create task', 'error');
  }
};
  // Handle view task by ID
  const handleViewTask = async (e) => {
    e.preventDefault();
    if (!taskId) {
      showMessage('Please enter a task ID', 'error');
      return;
    }

    try {
      const data = await viewTask(taskId);
      setSelectedTask(data);
      setFormData({
        title: data.title || '',
        created_by: data.created_by || '',
        description: data.description || '',
        status: data.status || '',
        priority: data.priority || '',
        due_date: data.due_date || ''
      });
      showMessage('Task loaded successfully', 'success');
      setActiveTab('view');
    } catch (error) {
      showMessage(error.message || 'Failed to fetch task', 'error');
    }
  };

  // Handle task update
    const handleUpdate = async (e) => {
    e.preventDefault();
    if (!taskId) {  // Now using taskId from search input instead of selectedTask.id
        showMessage('Please enter a task ID first', 'error');
        return;
    }

    try {
        await updateTask(taskId, {
        title: formData.title,
        description: formData.description, 
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date
        });
        
        showMessage('Task updated successfully', 'success');
        
        // Refresh the viewed task using the same taskId
        const data = await viewTask(taskId);
        setSelectedTask(data);
        setFormData({
        title: data.title || '',
        description: data.description || '',
        status: data.status || '',
        priority: data.priority || '',
        due_date: data.due_date || ''
        });
        
    } catch (error) {
        showMessage('Failed to update task: ' + error.message, 'error');
    }
    };

  // Handle task deletion
  const handleDelete = async () => {
    if (!taskId) return;

    try {
      await deleteTask(taskId);
      showMessage('Task deleted successfully', 'success');
      setSelectedTask(null);
      setTaskId('');
      setActiveTab('create');
    } catch (error) {
      showMessage('Failed to delete task: ' + error.message, 'error');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedTask) {
      showMessage('Please select a file first', 'error');
      return;
    }

    try {
      await uploadFile(taskId, file);
      showMessage('File uploaded successfully', 'success');
      setFile(null);
      // Refresh the task data
      const data = await viewTask(taskId);
      setSelectedTask(data);
    } catch (error) {
      showMessage(error.message || 'Upload failed', 'error');
    }
  };

  // Helper functions
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      created_by: '',
      description: '',
      status: '',
      priority: '',
      due_date: ''
    });
  };

  return (
    <div className="task-manager-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <div className={`status-message ${message.type}`}>
          {message.text}
        </div>
      </header>

      <div className="main-content">
        {/* Navigation Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Task
          </button>
          <button 
            className={`tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            View/Edit Task
          </button>
        </div>

        {/* Create Task Section */}
        {activeTab === 'create' && (
          <div className="create-task-section card">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>


              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <button type="submit" className="primary-button">
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* View/Edit Task Section */}
        {activeTab === 'view' && (
          <div className="view-task-section">
            {/* Task ID Search */}
            <div className="card task-search">
              <h2>Find Task by ID</h2>
              <form onSubmit={handleViewTask}>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Enter Task ID"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                  />
                  <button type="submit" className="primary-button">
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Task Details */}
            {selectedTask && (
              <div className="task-details-container">
                <div className="card task-info">
                  <div className="task-header">
                    <h2>{selectedTask.title}</h2>
                    <span className={`status-badge ${selectedTask.status?.toLowerCase()}`}>
                      {selectedTask.status || 'No status'}
                    </span>
                  </div>

                  <div className="task-meta">
                    <div className="meta-item">
                      <span className="meta-label">Created By:</span>
                      <span>{selectedTask.created_by}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Priority:</span>
                      <span>{selectedTask.priority || 'Not set'}</span>
                    </div>
                    {selectedTask.due_date && (
                      <div className="meta-item">
                        <span className="meta-label">Due Date:</span>
                        <span>{new Date(selectedTask.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {selectedTask.description && (
                    <div className="task-description">
                      <h3>Description</h3>
                      <p>{selectedTask.description}</p>
                    </div>
                  )}

                  {selectedTask.file_url && (
                    <div className="task-attachment">
                      <h3>Attachment</h3>
                      <a 
                        href={selectedTask.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        View PDF
                      </a>
                    </div>
                  )}

                  <div className="task-actions">
                    <button 
                      onClick={() => setActiveTab('update')}
                      className="secondary-button"
                    >
                      Edit Task
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="danger-button"
                    >
                      Delete Task
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div className="card file-upload-card">
                  <h3>Upload PDF</h3>
                  <form onSubmit={handleFileUpload}>
                    <div className="file-upload-box">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="file-upload-label">
                        {file ? file.name : 'Choose a PDF file'}
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      className="primary-button"
                      disabled={!file}
                    >
                      Upload File
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Update Task Section (Modal) */}
        {activeTab === 'update' && selectedTask && (
            <div className="modal-overlay">
                <div className="modal-content card">
                <h2>Update Task (ID: {selectedTask.id})</h2> {/* Show ID to user */}
                <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <input
                      type="text"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <input
                      type="text"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="primary-button">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('view')}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;