# API Documentation

This document provides an overview of all the APIs available in the project, including their endpoints, HTTP methods, and descriptions.

---

## Admin APIs

### List Users
- **Endpoint**: `/api/admin/users`
- **Method**: GET
- **Description**: Fetch a list of users with optional filters for role and email.
- **Query Parameters**:
  - `role` (optional): Filter by user role.
  - `email` (optional): Filter by user email.

### Change User Role
- **Endpoint**: `/api/admin/users/:id/role`
- **Method**: PUT
- **Description**: Update the role of a specific user.
- **Path Parameters**:
  - `id`: User ID.
- **Request Body**:
  ```json
  {
    "role": "newRole"
  }
  ```

---

## Analytics APIs

### Fetch Basic Analytics
- **Endpoint**: `/api/analytics/basic`
- **Method**: GET
- **Description**: Retrieve basic analytics data for the authenticated user.

### Predict Score
- **Endpoint**: `/api/analytics/predict-score`
- **Method**: POST
- **Description**: Predict the score based on study hours, coverage, and accuracy.
- **Request Body**:
  ```json
  {
    "studyHours": 5,
    "coverage": 80,
    "accuracy": 90
  }
  ```

---

## Exam APIs

### List Exams
- **Endpoint**: `/api/exams`
- **Method**: GET
- **Description**: Retrieve a paginated list of active exams.
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).

### Create or Update Exam
- **Endpoint**: `/api/exams`
- **Method**: POST
- **Description**: Create a new exam or update an existing one.
- **Request Body**:
  ```json
  {
    "id": 1, // Optional for updates
    "title": "Exam Title",
    "type": "Exam Type",
    "duration": 120,
    "maxQuestions": 50,
    "isActive": true
  }
  ```

### Generate Adaptive Study Plan
- **Endpoint**: `/api/exams/adaptive-study-plan`
- **Method**: POST
- **Description**: Generate an adaptive study plan based on user performance.
- **Request Body**:
  ```json
  {
    "userId": 123,
    "performanceData": [
      { "topic": "Polity", "accuracy": 70, "timeSpent": 15, "difficulty": 0.6 },
      { "topic": "History", "accuracy": 50, "timeSpent": 20, "difficulty": 0.8 }
    ]
  }
  ```

---

## Study Plan APIs

### Fetch Study Plan
- **Endpoint**: `/api/study-plan`
- **Method**: GET
- **Description**: Retrieve the study plan for the authenticated user.

### Update Study Plan
- **Endpoint**: `/api/study-plan`
- **Method**: PUT
- **Description**: Update the study plan for the authenticated user.
- **Request Body**:
  ```json
  {
    "topics": [
      { "name": "Polity", "hours": 10 },
      { "name": "History", "hours": 8 }
    ]
  }
  ```

---

## Notification APIs

### Send Notification
- **Endpoint**: `/api/notifications/send`
- **Method**: POST
- **Description**: Send a notification to a user or group of users.
- **Request Body**:
  ```json
  {
    "userId": 123,
    "message": "Your exam is scheduled for tomorrow."
  }
  ```

---

## User APIs

### Register User
- **Endpoint**: `/api/users/register`
- **Method**: POST
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Login User
- **Endpoint**: `/api/users/login`
- **Method**: POST
- **Description**: Authenticate a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

---

## Chat APIs

### Send Message
- **Endpoint**: `/api/chat/send`
- **Method**: POST
- **Description**: Send a message to a chat group.
- **Request Body**:
  ```json
  {
    "groupId": 1,
    "message": "Hello, team!"
  }
  ```

### Fetch Messages
- **Endpoint**: `/api/chat/messages`
- **Method**: GET
- **Description**: Retrieve messages from a chat group.
- **Query Parameters**:
  - `groupId`: ID of the chat group.
  - `limit` (optional): Number of messages to fetch.

---

## Gamification APIs

### Fetch Badges
- **Endpoint**: `/api/gamification/badges`
- **Method**: GET
- **Description**: Retrieve a list of badges earned by the user.

### Add Badge
- **Endpoint**: `/api/gamification/badges`
- **Method**: POST
- **Description**: Add a new badge to the user.
- **Request Body**:
  ```json
  {
    "userId": 123,
    "badgeName": "Top Scorer"
  }
  ```

---

## User Test Attempt APIs

### Fetch User Test Attempts
- **Endpoint**: `/api/user-test-attempts`
- **Method**: GET
- **Description**: Retrieve a list of test attempts for the authenticated user.
- **Query Parameters**:
  - `userId` (optional): Filter by user ID.
  - `examId` (optional): Filter by exam ID.

### Create User Test Attempt
- **Endpoint**: `/api/user-test-attempts`
- **Method**: POST
- **Description**: Record a new test attempt for a user.
- **Request Body**:
  ```json
  {
    "userId": 123,
    "examId": 456,
    "score": 85.5,
    "responses": { "1": "A", "2": "B" }
  }
  ```

---

## Badge APIs

### Fetch Badges
- **Endpoint**: `/api/badges`
- **Method**: GET
- **Description**: Retrieve a list of badges earned by the user.
- **Query Parameters**:
  - `userId` (optional): Filter by user ID.
  - `type` (optional): Filter by badge type.

### Add Badge
- **Endpoint**: `/api/badges`
- **Method**: POST
- **Description**: Add a new badge to the user.
- **Request Body**:
  ```json
  {
    "userId": 123,
    "type": "mocks_completed",
    "count": 1
  }
  ```

---

## Comment APIs

### Fetch Comments
- **Endpoint**: `/api/comments`
- **Method**: GET
- **Description**: Retrieve a list of comments for a specific post.
- **Query Parameters**:
  - `postId`: ID of the post.
  - `userId` (optional): Filter by user ID.

### Add Comment
- **Endpoint**: `/api/comments`
- **Method**: POST
- **Description**: Add a new comment to a post.
- **Request Body**:
  ```json
  {
    "postId": 789,
    "userId": 123,
    "content": "This is a comment."
  }
  ```

---

## Subtopic APIs

### Fetch Subtopics
- **Endpoint**: `/api/subtopics`
- **Method**: GET
- **Description**: Retrieve a list of subtopics under a specific topic.
- **Query Parameters**:
  - `topicId`: ID of the topic.

### Add Subtopic
- **Endpoint**: `/api/subtopics`
- **Method**: POST
- **Description**: Add a new subtopic under a topic.
- **Request Body**:
  ```json
  {
    "topicId": 456,
    "name": "New Subtopic"
  }
  ```

---

## Plan Version APIs

### Fetch Plan Versions
- **Endpoint**: `/api/plan-versions`
- **Method**: GET
- **Description**: Retrieve a list of plan versions for a specific study plan.
- **Query Parameters**:
  - `planId`: ID of the study plan.

### Add Plan Version
- **Endpoint**: `/api/plan-versions`
- **Method**: POST
- **Description**: Add a new version to a study plan.
- **Request Body**:
  ```json
  {
    "planId": 123,
    "focusAreas": { "Polity": 10, "History": 8 },
    "version": 2,
    "updatedBy": "user"
  }
  ```