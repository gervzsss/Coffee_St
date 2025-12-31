# Coffee St

A modern, full-stack e-commerce web application for a coffee shop. Built with Laravel and React, featuring a customer-facing storefront and an admin dashboard for order and product management.

## Features

### Customer Portal

- Browse product catalog with categories and search
- Product customization with variant options
- Shopping cart with real-time updates
- Order placement and tracking
- User account management
- Contact and inquiry system

### Admin Dashboard

- Sales analytics and metrics
- Product management (CRUD, availability, archiving)
- Order management with status tracking
- Customer account management (view, block/unblock)
- Inquiry and message handling

## Tech Stack

### Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum (API Authentication)
- MySQL 8.0

### Frontend

- React 19
- React Router 7
- Tailwind CSS 4
- Vite 7
- Axios
- Framer Motion

### Infrastructure

- Docker and Docker Compose
- Nginx
- Cloudinary (Image hosting)

## Prerequisites

- Docker Desktop installed and running
- Git

## Quick Start

Run the application using Docker:

```bash
docker compose up --build -d
```

This starts:

- MySQL database on port 4306
- Laravel backend on port 8000
- React frontend on port 5173

The application automatically runs database migrations and seeders on first startup.

**Verify the containers are running:**

```bash
docker compose ps
```

All services should show "running" status. To view logs:

```bash
docker compose logs -f
```

**Access the application:**

| Page             | URL                           |
| ---------------- | ----------------------------- |
| Customer Website | `http://localhost:5173`       |
| Admin Dashboard  | `http://localhost:5173/admin` |

## Stopping the Application

```bash
docker compose down
```

To remove volumes (database data):

```bash
docker compose down -v
```

## Project Structure

```text
Coffee_St/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Admin/   # Admin endpoints
│   │   │   │   └── User/    # Customer endpoints
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── frontend/                # React SPA
│   └── src/
│       ├── admin/           # Admin dashboard
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── services/
│       ├── shared/          # Shared components
│       └── user/            # Customer portal
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           └── services/
└── docker-compose.yml       # Docker configuration
```

## Default Admin Account

After the application starts, use these credentials to access the admin dashboard:

- URL: `http://localhost:5173/admin`
- Email: `admin@coffeest.com`
- Password: `admin`
