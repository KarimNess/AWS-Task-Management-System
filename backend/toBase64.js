const fs = require('fs');
const path = require('path');

// Replace with your actual file path
const filePath = 'C:/Users/Ali/task-management-backend/Gap paper 3  Gap 3 Personalization.txt';

try {
    const fileContent = fs.readFileSync(filePath);
    const base64 = fileContent.toString('base64');
    console.log(base64); // Copy this and paste into Postman
} catch (error) {
    console.error('Error reading file:', error);
}
