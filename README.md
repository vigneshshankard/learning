# learning

### **Summary of the UPSC Preparation Platform Architecture Document**

#### **Core Objectives**
- Democratize UPSC preparation by offering **free syllabus-aligned resources** (notes, quizzes, current affairs).
- Monetize advanced features (unlimited mock tests, AI-driven study plans, premium analytics) via a **yearly subscription**.

#### **Key Features**
1. **Tiered User Access**:
   - **Visitors**: Free materials, unlimited mock tests (results require registration).
   - **Regular Users**: 150 tests/month, basic analytics.
   - **Premium Users**: Unlimited tests, advanced analytics (heatmaps, peer benchmarks), AI-driven adaptive study plans.
   - **Super Admin**: Full control over content, exams, and users.

2. **Study Materials**:
   - Hierarchical structure (Subject > Topic > Subtopic).
   - Bulk uploads, version control, and anti-cheating measures (randomized questions).

3. **Exam System**:
   - Tiered test limits, real-time scoring, IP/device tracking, and analytics integration.

4. **AI/ML Integration**:
   - TensorFlow.js for adaptive study plans, predictive scoring, and peer benchmarking.

5. **Social & Gamification**:
   - Activity feeds, leaderboards, badges (e.g., "50 Mocks Completed"), and tiered chat/connection limits.

6. **Analytics**:
   - **Basic**: Score trends, accuracy.
   - **Premium**: Weakness heatmaps, efficiency tracking, predictive timelines.

#### **Technology Stack**
- **Backend**: Node.js, Express.js, Kafka (event-driven integration).
- **Databases**: PostgreSQL (structured data), MongoDB (analytics), Redis (caching, rate-limiting).
- **AI/ML**: TensorFlow.js for in-browser model inference.
- **Security**: JWT tokens, RBAC middleware, bcrypt hashing, anti-cheating tools.
- **Frontend**: React.js with Material-UI/Ant Design, WebSocket for real-time features.

#### **Monetization Strategy**
- **Freemium Model**: Free users access core features; Premium unlocks advanced tools (yearly subscription).
- **Revenue Streams**: Subscriptions, ad-free experience, and priority support.

#### **Services Overview**
1. **User Management**: Auth, roles, subscription handling.
2. **CMS**: Syllabus-aligned content, bulk uploads, version control.
3. **Exam Service**: Test creation, anti-cheating, analytics.
4. **Study Plan Service**: AI-driven adaptive plans, progress tracking.
5. **Analytics Service**: Tiered dashboards, predictive insights.
6. **Gamification/Social**: Badges, leaderboards, activity feeds.
7. **Billing/Notifications**: Subscription management, payment gateways (Stripe/Razorpay).
8. **Admin Dashboard**: Full oversight of users, content, exams, and revenue.
9. **API Gateway**: Unified entry point with rate-limiting, caching, and security.

#### **Security & Compliance**
- Role-based access control (RBAC), JWT validation, GDPR-compliant data handling.
- Anti-cheating measures: IP/device fingerprinting, randomized questions.

#### **Key Integrations**
- **Event-Driven Workflows**: Kafka for real-time updates (e.g., test completion triggers analytics updates).
- **Cross-Service Syncing**: Mock tests → analytics → study plans.

### **Microservices Overview**

#### **1. User Management Service**
- **Responsibilities**:
  - Authentication (JWT, bcrypt hashing).
  - Role-based access control (RBAC).
  - Subscription upgrades/downgrades.
  - Session handling (Redis for token invalidation).

#### **2. Content Management Service (CMS)**
- **Responsibilities**:
  - Manage syllabus-aligned study materials (Subject > Topic > Subtopic).
  - Bulk uploads, version control, and content moderation.
  - Integration with Exam and Study Plan services.

#### **3. Exam Service**
- **Responsibilities**:
  - Mock test creation (Prelims/Mains).
  - Anti-cheating measures (randomized questions, IP/device tracking).
  - Temporary storage of visitor attempts (`temp_test_results`).
  - Tiered test limits (150/month for Regular, unlimited for Premium).

#### **4. Study Plan Service**
- **Responsibilities**:
  - Generate **static plans** (Regular Users) and **AI-driven adaptive plans** (Premium Users).
  - Integrate with Analytics Service for weakness detection.
  - Use TensorFlow.js for time optimization and predictive timelines.

#### **5. Analytics Service**
- **Responsibilities**:
  - **Basic Analytics**: Score trends, accuracy, syllabus coverage.
  - **Advanced Analytics**: Weakness heatmaps, peer benchmarking, predictive scoring.
  - Admin-level metrics (question difficulty, drop-off rates).

#### **6. Gamification Service**
- **Responsibilities**:
  - Award badges (e.g., "50 Mocks Completed").
  - Track study streaks and leaderboards.
  - Assign Premium verification badges.

#### **7. Social Service**
- **Responsibilities**:
  - Activity feeds (posts, achievements, polls).
  - Tiered chat/group limits (500 friends for Regular, unlimited for Premium).
  - Safety features (profanity filter, link hiding).

#### **8. Billing Service**
- **Responsibilities**:
  - Subscription management (₹500/year plan).
  - Payment gateway integration (Stripe/Razorpay).
  - Invoice generation and prorated refunds.

#### **9. Notification Service**
- **Responsibilities**:
  - Real-time alerts (test results, study reminders).
  - Scheduled notifications (subscription renewals).
  - Multi-channel delivery (email, SMS, in-app).

#### **10. Admin Dashboard Service**
- **Responsibilities**:
  - User management (CRUD, role changes).
  - Content moderation and audit logs.
  - Platform-wide analytics (revenue, user growth).

#### **11. API Gateway Service**
- **Responsibilities**:
  - Route requests to appropriate microservices.
  - Rate-limiting, caching, and JWT validation.
  - Aggregate responses for dashboard endpoints.

#### **12. Anti-Cheating Service** (Optional, embedded in Exam Service)
- **Responsibilities**:
  - Detect duplicate sessions via IP/device fingerprinting.
  - Enforce full-screen mode during tests.

### **Key Integration Tools**
- **Event-Driven Architecture**: Kafka for cross-service communication (e.g., `Test Completed` → Analytics update).
- **Databases**: PostgreSQL (structured data), MongoDB (analytics), Redis (caching).
- **AI/ML**: TensorFlow.js for in-browser model inference (Study Plan and Analytics).

### **Latest Updates**
#### **Configuration Constants**
- **User Roles**:
  - `VISITOR`: Visitor role with limited access.
  - `REGULAR`: Regular user role with basic features.
  - `PREMIUM`: Premium user role with advanced features.
  - `SUPER_ADMIN`: Super admin role with full control.
- **Security**:
  - `JWT_SECRET`: Secret key for JWT authentication (configurable via environment variables).
  - `SALT_ROUNDS`: Number of salt rounds for password hashing (default: 12).
- **Social Login Keys**:
  - `GOOGLE`: API key for Google login (configurable via environment variables).
  - `FACEBOOK`: API key for Facebook login (configurable via environment variables).

This section reflects the latest constants and configurations added to the project.