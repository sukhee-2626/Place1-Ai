# Place1-Ai

**Place1-Ai** is an AI-powered Career Copilot designed with a commercial UI/UX polish. It features a modern frontend and a robust backend API, utilizing Supabase for database management and authentication.

## Project Structure

This is a monorepo containing both the frontend client and the backend server.

- `/client` - A [Next.js](https://nextjs.org/) application built with React, TailwindCSS, and the App Router.
- `/server` - A Node.js backend handling API requests, migrations, and Supabase integration.
- `/supabase` - Contains Supabase edge functions, database migrations, and configuration.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- Supabase account (if running the database locally or in the cloud)

### Setup the Frontend (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setup the Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (check `package.json` for specific commands):
   ```bash
   node index.js
   ```

## Deployment on Vercel

Since this project uses a monorepo structure, deploying the Next.js frontend to Vercel requires a specific configuration:

1. Import your GitHub repository to [Vercel](https://vercel.com/).
2. In the **Configure Project** section, set the **Root Directory** to `client`.
3. Vercel will automatically detect the Framework Preset as **Next.js**.
4. Add any necessary environment variables.
5. Click **Deploy**.

## License
MIT
