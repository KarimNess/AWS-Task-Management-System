const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

// Set AWS region and topic ARN
const REGION = process.env.AWS_REGION || "us-east-1";
const TOPIC_ARN = process.env.SNS_TOPIC_ARN || "arn:aws:sns:us-east-1:347802390159:TaskEventsTopic";

// Initialize SNS client
const snsClient = new SNSClient({ region: REGION });

// Function to publish messages to SNS
const publishToSNS = async (eventType, payload) => {
    try {
        const command = new PublishCommand({
            TopicArn: TOPIC_ARN,
            Message: JSON.stringify(payload),
            MessageAttributes: {
                operation: {
                    DataType: 'String',
                    StringValue: eventType,  // Example: "create"
                },
            },
        });

        const result = await snsClient.send(command);
        console.log(`SNS publish success: ${result.MessageId}`);
        return result;
    } catch (error) {
        console.error("SNS publish failed:", error);
        throw error;
    }
};

// Handlers for Express routes
exports.createTask = async (req, res) => {
    try {
        const task = req.body;
        await publishToSNS('create', task);
        res.status(200).json({ message: "Create task event sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send create task event" });
    }
};



exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;  // get from URL like /tasks/:id
        const task = req.body;

        if (!taskId) {
            return res.status(400).json({ error: "taskId is required in URL parameters" });
        }

        // Build SNS message format to match Lambda expectation
        const snsMessage = {
            pathParameters: {
                taskId: taskId
            },
            // Include only fields to update
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date
        };

        await publishToSNS('update', snsMessage);

        res.status(200).json({ message: "Update task event sent" });
    } catch (error) {
        console.error('Failed to send update task event:', error);
        res.status(500).json({ error: "Failed to send update task event" });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;  // Get task ID from URL like /tasks/:id

        if (!taskId) {
            return res.status(400).json({ error: "taskId is required in URL parameters" });
        }

        // Format message to match Lambda expectations
        const snsMessage = {
            pathParameters: {
                taskId: taskId
            }
        };

        await publishToSNS('delete', snsMessage);

        res.status(200).json({ message: "Delete task event sent" });
    } catch (error) {
        console.error('Failed to send delete task event:', error);
        res.status(500).json({ error: "Failed to send delete task event" });
    }
};


exports.viewTask = async (req, res) => {
    try {
        const taskId = req.params.id;  // use 'id' not 'taskId'

        if (!taskId) {
            return res.status(400).json({ error: "taskId is required in URL parameters" });
        }

        await publishToSNS('view', { taskId });
        res.status(200).json({ message: "View task event sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send view task event" });
    }
};



exports.uploadFile = async (req, res) => {
    try {
        const taskId = req.params.id;
        const file = req.file; // multer puts the file here

        if (!taskId || !file) {
            return res.status(400).json({ error: "Missing task ID or file" });
        }

        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: "Only PDF files are allowed" });
        }

        // file.buffer contains the file data as a Buffer
        // file.originalname is the filename
        const snsMessage = {
            pathParameters: {
                taskId: taskId,
            },
            filename: file.originalname,
            contentType: file.mimetype,
            file: file.buffer.toString('base64'),  // base64 encode buffer for your SNS message
        };

        await publishToSNS('upload', snsMessage);

        res.status(200).json({ message: "File upload event sent to SNS" });
    } catch (error) {
        console.error('Failed to send file upload event:', error);
        res.status(500).json({ error: "Failed to send file upload event" });
    }
};

// // Add this new controller method
// exports.viewAllTasksByUUID = async (req, res) => {
//   try {
//     const createdBy = req.query.created_by;
    
//     if (!createdBy) {
//       return res.status(400).json({ error: "created_by parameter is required" });
//     }

//     // Format the message for SNS
//     const snsMessage = {
//       queryStringParameters: {
//         created_by: createdBy
//       }
//     };

//     await publishToSNS('viewAllByUUID', snsMessage);
//     res.status(200).json({ message: "View all tasks request sent" });
//   } catch (error) {
//     console.error('Failed to send view all tasks event:', error);
//     res.status(500).json({ error: "Failed to send view all tasks event" });
//   }
// };
