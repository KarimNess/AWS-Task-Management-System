import React, { useState } from "react";

const UploadFileButton = () => {
    const [taskId, setTaskId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadStatus("");
        setError("");
    };

    const handleUpload = async () => {
        if (!taskId.trim()) {
            setError("Please enter a Task ID");
            return;
        }
        if (!selectedFile) {
            setError("Please select a PDF file");
            return;
        }
        if (selectedFile.type !== "application/pdf") {
            setError("Only PDF files are allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setUploadStatus("Uploading...");
            setError("");

            const response = await fetch(`http://localhost:3000/tasks/upload/${taskId}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Upload failed");
            }

            setUploadStatus("File uploaded successfully!");
            setSelectedFile(null);
            setTaskId("");
        } catch (err) {
            setError(err.message);
            setUploadStatus("");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Upload PDF for Task</h2>

            <label style={styles.label}>
                Task ID:
                <input
                    type="text"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    placeholder="Enter Task ID"
                    style={styles.input}
                />
            </label>

            <label style={{ ...styles.label, marginTop: 20 }}>
                Select PDF File:
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
            </label>

            <button onClick={handleUpload} style={styles.button}>
                Upload PDF
            </button>

            {uploadStatus && <p style={{ ...styles.message, color: "green" }}>{uploadStatus}</p>}
            {error && <p style={{ ...styles.message, color: "red" }}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: 400,
        margin: "40px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        textAlign: "center",
        marginBottom: 25,
        color: "#222",
    },
    label: {
        display: "block",
        marginBottom: 10,
        fontWeight: "600",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        marginTop: 6,
        borderRadius: 6,
        border: "1.5px solid #ddd",
        fontSize: 16,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease",
    },
    fileInput: {
        marginTop: 8,
    },
    button: {
        marginTop: 25,
        width: "100%",
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
    message: {
        marginTop: 15,
        fontWeight: "600",
        textAlign: "center",
    },
};

export default UploadFileButton;
