# Express.js TypeScript Production-Ready Boilerplate

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> **A production-ready Express.js TypeScript boilerplate** featuring enterprise-grade architecture with comprehensive authentication, note management, and advanced security implementations.

This boilerplate provides a solid foundation for building scalable REST APIs using modern development practices, clean architecture principles, and industry-standard security measures. Perfect for developers who want to kickstart their projects with a well-structured, maintainable codebase.

## ✨ Key Features

### 🏗️ **Architecture & Design Patterns**

- **Object-Oriented Programming (OOP)** with TypeScript classes and interfaces
- **Repository Pattern** for data access abstraction
- **Service Layer Architecture** for business logic separation
- **Dependency Injection Container** for loose coupling
- **Clean Architecture** with proper separation of concerns
- **SOLID Principles** implementation throughout the codebase

### 🔐 **Security & Authentication**

- **JWT-based Authentication** with access and refresh tokens
- **HttpOnly Cookies** for enhanced security
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** to prevent abuse and DDoS attacks
- **Input Validation** with express-validator
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Environment Variables** protection

### 🗄️ **Database & ORM**

- **PostgreSQL** with Prisma ORM
- **Database Migrations** with version control
- **Connection Pooling** for optimal performance
- **Database Seeding** for development/testing
- **Type-Safe Database Queries** with Prisma Client

### 🛠️ **Development Experience**

- **Full TypeScript Support** with strict type checking
- **Hot Reload** with nodemon for development
- **Comprehensive Error Handling** with custom error classes
- **Request Logging** with morgan
- **API Documentation** ready structure
- **Production Build** optimization

### 🚀 **Performance & Scalability**

- **Pagination Support** for large datasets
- **Search Functionality** with optimized queries
- **Cookie Management** with security best practices
- **Efficient Database Indexing** for performance
- **Middleware Pipeline** for request processing

## 🛠️ Tech Stack

### **Backend Core**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Static type checking and enhanced developer experience

### **Database & ORM**

- **PostgreSQL** - Robust, enterprise-grade relational database
- **Prisma ORM** - Next-generation Node.js and TypeScript ORM
- **Prisma Client** - Type-safe database client

### **Authentication & Security**

- **JSON Web Tokens (JWT)** - Stateless authentication
- **bcrypt.js** - Password hashing and salting
- **Helmet.js** - Security headers middleware
- **express-rate-limit** - Rate limiting middleware
- **CORS** - Cross-origin resource sharing

### **Validation & Middleware**

- **express-validator** - Server-side validation
- **cookie-parser** - Cookie parsing middleware
- **morgan** - HTTP request logging
- **dotenv** - Environment variable management

### **Development Tools**

- **nodemon** - Development server with hot reload
- **ts-node** - TypeScript execution for Node.js
- **pnpm** - Fast, disk space efficient package manager

## 🏗️ Project Architecture

This boilerplate follows **Clean Architecture** principles with a well-defined **separation of concerns**:

### **📁 Directory Structure**

```text
src/
├── controllers/          # HTTP request handlers
│   ├── base.controller.ts   # Base controller with common methods
│   ├── auth.controller.ts   # Authentication endpoints
│   └── note.controller.ts   # Note management endpoints
├── services/             # Business logic layer
│   ├── base.service.ts      # Base service with common utilities
│   ├── auth.service.ts      # Authentication business logic
│   └── note.service.ts      # Note management business logic
├── repository/           # Data access layer
│   ├── base.repository.ts   # Base repository with common DB operations
│   ├── user.repository.ts   # User data access methods
│   └── note.repository.ts   # Note data access methods
├── middleware/           # Custom middleware functions
│   ├── auth.middleware.ts   # JWT authentication middleware
│   ├── error.middleware.ts  # Global error handling
│   ├── limiter.middleware.ts # Rate limiting
│   └── pagination.middleware.ts # Pagination helper
├── validations/          # Input validation schemas
│   ├── auth.validation.ts   # Authentication validation rules
│   └── note.validation.ts   # Note validation rules
├── utils/               # Helper functions and utilities
│   ├── generateToken.ts     # JWT token generation
│   ├── error.ts            # Custom error classes
│   └── userNames.ts        # Username generation utilities
├── types/               # TypeScript type definitions
│   └── index.ts            # Application-wide types and interfaces
├── constants/           # Application constants
│   └── index.ts            # Common constants and configuration
├── container/           # Dependency injection container
│   └── index.ts            # IoC container implementation
├── routes/              # API route definitions
│   ├── auth.routes.ts      # Authentication routes
│   └── note.routes.ts      # Note management routes
├── database/            # Database configuration
│   └── prismaClient.ts     # Prisma client setup
└── index.ts             # Application entry point
```

### **🔄 Architecture Patterns**

#### **1. Repository Pattern**

```typescript
// Abstract data access layer
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDTO): Promise<User>;
  update(id: string, userData: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
```

#### **2. Service Layer Pattern**

```typescript
// Business logic encapsulation
class AuthService {
  constructor(private userRepository: IUserRepository) {}
  
  async signup(userData: SignUpDTO): Promise<AuthResponseDTO> {
    // Business logic implementation
    // Validation, password hashing, user creation
  }
}
```

#### **3. Dependency Injection Container**

```typescript
// IoC Container for managing dependencies
class Container {
  private static instance: Container;
  
  public static getInstance(prisma: PrismaClient): Container {
    if (!Container.instance) {
      Container.instance = new Container(prisma);
    }
    return Container.instance;
  }
  
  // Dependency registration and resolution
}
```

#### **4. Controller Pattern**

```typescript
// HTTP request handling with proper error management
class AuthController extends BaseController {
  constructor(private authService: IAuthService) {
    super();
  }
  
  public signup = async (req: Request, res: Response, next: NextFunction) => {
    // Request validation, service call, response formatting
  };
}
```

### **🎯 SOLID Principles Implementation**

- **Single Responsibility Principle**: Each class has one reason to change
- **Open/Closed Principle**: Open for extension, closed for modification
- **Liskov Substitution Principle**: Derived classes must be substitutable for base classes
- **Interface Segregation Principle**: Clients shouldn't depend on interfaces they don't use
- **Dependency Inversion Principle**: Depend on abstractions, not concretions

## 🔒 Security Features

### **Authentication & Authorization**

- **JWT Token Strategy**: Access tokens (short-lived) + Refresh tokens (long-lived)
- **HttpOnly Cookies**: Prevents XSS attacks by making tokens inaccessible to client-side scripts
- **Secure Cookie Configuration**: `SameSite=Strict`, `Secure=true` in production
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Token Expiration**: Automatic token refresh mechanism

### **Input Validation & Sanitization**

- **Express-validator**: Comprehensive input validation with custom rules
- **Email Domain Blocking**: Prevents registration from disposable email services
- **Password Complexity**: Enforces strong password requirements
- **SQL Injection Prevention**: Prisma ORM provides built-in protection
- **XSS Protection**: Input sanitization and output encoding

### **Rate Limiting & DoS Protection**

- **Configurable Rate Limits**: Different limits for auth and API endpoints
- **IP-based Tracking**: Prevents abuse from specific IP addresses
- **Memory-efficient Storage**: Optimized for production environments
- **Graceful Degradation**: Proper error responses when limits are exceeded

### **Security Headers**

- **Helmet.js Integration**: Comprehensive security headers
- **CORS Configuration**: Configurable allowed origins
- **Content Security Policy**: Prevents XSS and data injection attacks
- **HSTS**: HTTP Strict Transport Security for HTTPS enforcement

## 🚨 Error Handling

### **Centralized Error Management**

```typescript
// Custom Error Classes Hierarchy
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  // Error categorization and handling
}

class ValidationError extends AppError {
  public errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  // Detailed validation error information
}
```

### **Error Categories**

- **ValidationError** (400): Input validation failures
- **AuthenticationError** (401): Authentication failures
- **AuthorizationError** (403): Permission denied
- **NotFoundError** (404): Resource not found
- **ConflictError** (409): Resource conflicts
- **InternalServerError** (500): Unexpected server errors

### **Error Response Format**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ],
  "stack": "..." // Only in development
}
```

## 📊 Database Design

### **Schema Overview**

```sql
-- Users table with optimized indexing
CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Notes table with foreign key relationships
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Optimized indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_title ON notes(title);
```

### **Database Features**

- **ACID Compliance**: Full transaction support
- **Cascade Deletes**: Automatic cleanup of related records
- **Optimized Indexing**: Enhanced query performance
- **Connection Pooling**: Efficient database connections
- **Migration System**: Version-controlled schema changes

## 🔄 Development Workflow

### **Database Operations**

```bash
# Database setup and migrations
pnpm prisma:generate      # Generate Prisma client
pnpm prisma:migrate       # Run migrations
pnpm prisma:studio        # Open Prisma Studio
pnpm prisma:db:seed       # Seed database with test data
pnpm prisma:migrate:reset # Reset and re-migrate database
```

### **Development Commands**

```bash
# Development server with hot reload
pnpm dev

# Type checking without compilation
pnpm type-check

# Production build
pnpm build

# Production server
pnpm start
```

## 🚀 Quick Start

### **Prerequisites**

- **Node.js**
- **PostgreSQL**
- **pnpm** - `npm install -g pnpm`

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/KhaledSaeed18/node-express-boilerplate.git
   cd node-express-boilerplate
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000
   API_VERSION=v1
   BASE_URL=/api
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/notes-app

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-key-here
   JWT_EXPIRE_TIME=15m
   JWT_REFRESH_EXPIRE_TIME=7d

   # Client Configuration
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   pnpm prisma:generate

   # Run database migrations
   pnpm prisma:migrate

   # Seed the database with sample data
   pnpm prisma:db:seed
   ```

5. **Start Development Server**

   ```bash
   pnpm dev
   ```

   The server will start on `http://localhost:3000`

### **Production Deployment**

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Deploy database migrations**

   ```bash
   pnpm prisma:migrate:deploy
   ```

3. **Start production server**

   ```bash
   pnpm start
   ```

## 📚 API Documentation

### **Base URL**

```text
http://localhost:3000/api/v1
```

### **Authentication Endpoints**

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | `{ "email": "user@example.com", "password": "SecurePass123!" }` |
| POST | `/auth/signin` | Login user | `{ "email": "user@example.com", "password": "SecurePass123!" }` |
| POST | `/auth/refresh-token` | Refresh access token | No body required |
| POST | `/auth/logout` | Logout user | No body required |

### **Note Management Endpoints**

| Method | Endpoint | Description | Headers | Body |
|--------|----------|-------------|---------|------|
| POST | `/note/create-note` | Create new note | `Authorization: Bearer <token>` | `{ "title": "Note Title", "content": "Note content" }` |
| GET | `/note/get-notes` | Get all notes (paginated) | `Authorization: Bearer <token>` | - |
| GET | `/note/get-note/:id` | Get specific note | `Authorization: Bearer <token>` | - |
| GET | `/note/search-notes` | Search notes | `Authorization: Bearer <token>` | Query: `?q=search term` |
| PUT | `/note/update-note/:id` | Update note | `Authorization: Bearer <token>` | `{ "title": "Updated Title", "content": "Updated content" }` |
| DELETE | `/note/delete-note/:id` | Delete note | `Authorization: Bearer <token>` | - |

### **Query Parameters**

#### **Pagination**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### **Search**

- `q`: Search query string
- `sortBy`: Sort field (title, createdAt, updatedAt)
- `sortOrder`: Sort order (asc, desc)

### **Response Format**

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  },
  "pagination": {
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false,
    "nextPage": 2,
    "previousPage": null
  }
}
```

## 🧪 Testing

### **Sample API Calls**

#### **User Registration**

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### **User Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

#### **Create Note**

```bash
curl -X POST http://localhost:3000/api/v1/note/create-note \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my first note."
  }'
```

#### **Get Notes with Pagination**

```bash
curl -X GET "http://localhost:3000/api/v1/note/get-notes?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ Development Tools

### **Prisma Studio**

Access the database GUI:

```bash
pnpm prisma:studio
```

Open `http://localhost:5555` to view and edit your database records.

### **Database Management**

```bash
# View migration status
pnpm prisma:migrate:status

# Reset database (development only)
pnpm prisma:migrate:reset

# Pull schema from existing database
pnpm prisma:db:pull

# Push schema changes without migrations
pnpm prisma:db:push

# Validate Prisma schema
pnpm prisma:validate
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - | Yes |
| `JWT_EXPIRE_TIME` | Access token expiration | 15m | No |
| `JWT_REFRESH_EXPIRE_TIME` | Refresh token expiration | 7d | No |
| `CLIENT_URL` | Frontend URL for CORS | - | Yes |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | 12 | No |

### **Database Configuration**

The application uses PostgreSQL with the following connection format:

```text
postgresql://[username]:[password]@[host]:[port]/[database]
```

Example:

```text
postgresql://myuser:mypassword@localhost:5432/notes-app
```

---

⭐ **Star this repository if you find it helpful!** ⭐
  