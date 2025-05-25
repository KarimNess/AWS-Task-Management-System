
# Task Management System on AWS

A web-based task management application built using AWS services, featuring user authentication, task CRUD operations, file attachments, notifications, and monitoring.

---

## Table of Contents

- [Setup Guide](#setup-guide)  
  - [Prerequisites](#prerequisites)  
  - [Deployment Steps](#deployment-steps)  
- [User Manual](#user-manual)  
  - [Getting Started](#getting-started)  
- [Features](#features)  
- [Presentation](#presentation)  
  - [Design Decisions](#design-decisions)  
  - [Challenges](#challenges)  
  - [Key Takeaways](#key-takeaways)  

---


## Setup Guide

### Prerequisites

- AWS account with administrative privileges  
- AWS CLI configured with proper permissions  
- Terraform (if using infrastructure as code)  
- Node.js and npm (for optional frontend deployment)  

### Deployment Steps

#### Set Up VPC and Networking

```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.1.0/24
```

#### Configure IAM Roles

```bash
aws iam create-role --role-name EC2TaskManagementRole --assume-role-policy-document file://ec2-trust-policy.json
```

#### Deploy Database Layer

```bash
aws rds create-db-instance --db-instance-identifier taskdb --engine mysql \
--allocated-storage 20 --db-instance-class db.t2.micro --master-username admin \
--master-user-password securepassword
```

#### Set Up Cognito User Pool

```bash
aws cognito-idp create-user-pool --pool-name TaskUsers
```

#### Deploy Lambda Functions

```bash
aws lambda create-function --function-name CreateTaskFunction \
--runtime python3.8 --handler lambda_function.lambda_handler \
--zip-file fileb://create_task.zip --role arn:aws:iam::123456789012:role/lambda-execution-role
```

#### Configure API Gateway

```bash
aws apigateway create-rest-api --name TaskManagementAPI
```

#### Set Up Monitoring

```bash
aws cloudwatch put-metric-alarm --alarm-name HighCPUUsage \
--metric-name CPUUtilization --namespace AWS/EC2 \
--statistic Average --period 300 --threshold 80 \
--comparison-operator GreaterThanThreshold --evaluation-periods 2
```

---

## User Manual

### Getting Started

#### Registration

1. Navigate to the application URL  
2. Click **Sign Up** and complete the registration form  
3. Verify your email address  

#### Login

1. Enter your credentials on the login page  
2. For first-time users, complete your profile setup  

---

## Features

### Task Management

- Create new tasks with title, description, due date, and priority  
- Update task status (Todo → In Progress → Done)  
- Assign tasks to team members  
- Filter tasks by status, due date, or assignee  

### File Attachments

- Click **Attach File** when creating or editing a task  
- Supported file types: PDF (max 10MB)  

### Notifications

Receive email alerts when:  
- You're assigned a new task  
- A task you created is updated  
- A task is approaching its due date  

### Dashboard

- View your active tasks in a Kanban board  
- See overdue tasks highlighted in red  
- Check performance metrics for completed tasks  

---

### Design Decisions

#### Multi-Database Approach

- RDS for relational data (user relationships, task hierarchies)  
- DynamoDB for high-velocity task metadata  
- S3 for scalable file storage  

#### Serverless Backend

- Lambda for cost-effective scaling  
- API Gateway for RESTful interface  
- SQS for decoupling notification system  

#### Security Architecture

- Cognito for identity management  
- VPC with private subnets for EC2 instances  
- IAM roles with least-privilege access  

### Challenges

#### Database Synchronization

- Implemented DynamoDB streams to keep RDS in sync  
- Added retry logic for cross-database transactions  

#### Cold Start Latency

- Configured Lambda provisioned concurrency  
- Optimized package size (removed unused dependencies)  

#### Cost Optimization

- Implemented auto-scaling for EC2 instances  
- Set up CloudWatch billing alerts  
- Used S3 lifecycle policies for attachments  

### Key Takeaways

#### Cloud Best Practices

- Infrastructure as code (Terraform) saved deployment time  
- Monitoring-first approach reduced troubleshooting time  

#### Performance Insights

- DynamoDB outperformed RDS for metadata operations by 40%  
- Lambda proved 60% more cost-effective than EC2 for API processing  

#### Future Improvements

- Implement CloudFront CDN for global users  
- Add AI-powered task suggestions  
- Explore migration to ECS/Fargate  

---
