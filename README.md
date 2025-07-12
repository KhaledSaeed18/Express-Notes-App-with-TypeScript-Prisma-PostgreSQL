# Express TypeScript Backend with Prisma

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge&logo=lock&logoColor=white)](https://www.npmjs.com/package/bcryptjs)
[![Express Validator](https://img.shields.io/badge/Express_Validator-7457C2?style=for-the-badge&logo=validator&logoColor=white)](https://express-validator.github.io/)
[![Rate Limit](https://img.shields.io/badge/Rate_Limit-2EA44F?style=for-the-badge&logo=shield&logoColor=white)](https://www.npmjs.com/package/express-rate-limit)
[![CORS](https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=cors&logoColor=white)](https://www.npmjs.com/package/cors)

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
git clone https://github.com/KhaledSaeed18/Express-Notes-App-with-TypeScript-Prisma-PostgreSQL.git
cd Express-Notes-App-with-TypeScript-Prisma-PostgreSQL
```

2- Install dependencies:

```bash
pnpm install
```

3- Create a .env file in the root directory:

```.env
PORT=<port-number>
API_VERSION=v<X>
BASE_URL=/api
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database-name>
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
```

4- Set up the database:

```bash
npx prisma migrate dev   # Apply the migrations
# or pnpm prisma:migrate

npx prisma generate   # Generate the Prisma Client
# or pnpm prisma:generate
```

5- Run the application:

```bash
pnpm dev
```

6- Production Build:

```bash
pnpm build
pnpm start
```

## API Endpoints

### Base URL

`http://localhost:<port-number>/api/v<X>`

- Authentication:
  - `POST /api/v<X>/auth/signup` - Register a new user
  - `POST /api/v<X>/auth/signin` - Login user
  - `POST /api/v<X>/auth/refresh-token` - Refresh access token

- Notes:
  - `POST /api/v<X>/note/create-note` - Create a new note
  - `GET /api/v<X>/note/get-notes` - Get all notes (paginated)
  - `GET /api/v<X>/note/get-note/:id` - Get a specific note
  - `GET /api/v<X>/note/search-notes` - Search notes (paginated)
  - `PUT /api/v<X>/note/update-note/:id` - Update a note
  - `DELETE /api/v<X>/note/delete-note/:id` - Delete a note
  