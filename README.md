This project is a backend API built using Node.js, Express, PostgreSQL, and Prisma ORM.

## 🛠️ Tech Stack

- Express.js server
- PostgreSQL database
- Prisma for database modeling and querying
- RESTful API structure
- Swagger for API documentation
- Cloudinary for file uploads (images, profile pictures, etc.)
- Environment-based configuration

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
PORT=3000
```

### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the Application

```bash
npm run dev
```

### 6. API Documentation (Swagger)

This project includes Swagger for interactive API documentation.
Once the application is running, open the following URL in your browser:

```
http://localhost:5000/api-docs/
```

From the Swagger UI, you can:
- Explore all available API endpoints
- View request/response structures
- Test API calls directly from the browser
