# Express TypeScript Backend with Prisma

A robust REST API backend built with Express.js, TypeScript, and Prisma ORM featuring authentication and note management.

## Features

- 🔐 JWT-based Authentication
- 📝 CRUD operations for Notes
- 🔍 Search functionality
- 📄 Pagination support
- ⚡ Rate limiting
- 🔒 Password validation and security
- 🎯 Input validation
- 🚫 Error handling middleware
- 📦 PostgreSQL database with Prisma ORM

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens
- bcrypt.js
- express-validator
- express-rate-limit

## Installation

1- Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2- Install dependencies:

```bash
npm install
```

3- Create a .env file in the root directory:

```.env
PORT=<port-number>
API_VERSION=v1
BASE_URL=/api
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database-name>
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
```

4- Set up the database:

```bash
npx prisma migrate dev   # Apply the migrations

npx prisma generate   # Generate the Prisma Client
```

5- Run the application:

```bash
npm run dev
```

6- Production Build:

```bash
npm run build
npm start
```

## API Endpoints

### Base URL

`http://localhost:3000/api/v1`

- Authentication:
  - `POST /api/v1/auth/signup` - Register a new user
  - `POST /api/v1/auth/signin` - Login user
  - `POST /api/v1/auth/refresh-token` - Refresh access token

- Notes:
  - `POST /api/v1/note/create-note` - Create a new note
  - `GET /api/v1/note/get-notes` - Get all notes (paginated)
  - `GET /api/v1/note/get-note/:id` - Get a specific note
  - `GET /api/v1/note/search-notes` - Search notes
  - `PUT /api/v1/note/update-note/:id` - Update a note
  - `DELETE /api/v1/note/delete-note/:id` - Delete a note
  
