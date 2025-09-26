## Nexus Project Management App

A full-stack web application for managing projects, mentors, cohorts, and votes. Users can create projects, assign mentors, and track approvals/declines. Built with Flask, PostgreSQL, and React, and deployed on Render.

# Features
## Backend

REST API with Flask and Flask-RESTful

PostgreSQL database with SQLAlchemy ORM

Supports CRUD operations for:

Users

Projects

Cohorts

Votes

Session and cookie management

CORS configured for frontend

## Frontend

React SPA with:

Project listing

Project creation and editing

Mentor assignment

Voting system for project approval

Fully communicates with deployed backend API

Search and filter functionality


## Deployment

Backend deployed on Render.com(https://nexus-db-2.onrender.com)

PostgreSQL database hosted on Render

Frontend can be served on any static host or local dev server(https://nexus-seven-orcin.vercel.app)

# Technology Stack
Layer	Technology
## Frontend	
React, Vite, Tailwind CSS
## Backend
Python, Flask, Flask-RESTful, SQLAlchemy, Flask-Migrate
Database	PostgreSQL
Deployment	Render.com


# Installation (Local Development)
1. Clone the repository
git clone https://github.com/your-username/nexus-app.git
cd nexus-app

2. Backend setup
cd server
python3 -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows

pip install -r requirements.txt

3. Configure environment variables

Create a .env file in the backend folder:

SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://my_database_user:password@host:port/nexus_db


DATABASE_URL points to your PostgreSQL database (deployed or local).

4. Run database migrations
flask db upgrade

5. Start the backend server
flask run


Default server runs at http://127.0.0.1:5000.

6. Frontend setup
cd ../frontend
npm install
npm run dev


Default frontend runs at http://localhost:5173.


