import React from 'react';
import CreateTask from './components/CreateTask';
import UpdateTask from './components/UpdateTask';
import DeleteTask from './components/DeleteTask';
import ViewTask from './components/ViewTask';
import UploadFileButton from './components/UploadFile';

function App() {
    return (
        <div>
            <h1>My Task Manager</h1>
            <CreateTask />
            <hr />
            <UpdateTask />
            <hr />
            <DeleteTask />
            <hr />
            <ViewTask />
            <hr />
            <UploadFileButton />
        </div>
    );
}

export default App;
