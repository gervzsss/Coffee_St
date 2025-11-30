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

### Production Mode

Run the application with optimized, production-ready containers:

```bash
docker compose up --build
```

This starts:

- MySQL database on port 4306
- Laravel backend on port 8000
- React frontend on port 5173

**Access the application:**

| Page             | URL                           |
| ---------------- | ----------------------------- |
| Customer Website | `http://localhost:5173`       |
| Admin Dashboard  | `http://localhost:5173/admin` |

Press `Ctrl + C` in the terminal to stop viewing logs. The containers will continue running in the background.

### Development Mode

Run the application with hot-reloading and debugging enabled:

```bash
docker compose -f docker-compose.dev.yml up --build
```

This starts:

- MySQL database on port 4306
- Laravel backend with debug mode on port 8000
- Nginx server on port 80
- React frontend with Vite HMR on port 5173

Development mode mounts your local source files, so changes are reflected immediately without rebuilding containers.

## Docker Compose Files

| File                     | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `docker-compose.yml`     | Production deployment with optimized builds and minimal logging        |
| `docker-compose.dev.yml` | Development environment with hot-reload, debug mode, and volume mounts |

Both configurations automatically run database migrations and seeders on first startup.

## Stopping the Application

Production:

```bash
docker compose down
```

Development:

```bash
docker compose -f docker-compose.dev.yml down
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
│   │   └── Models/
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
│       └── user/            # Customer portal
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           └── services/
├── nginx/                   # Nginx configuration
├── docker-compose.yml       # Production config
└── docker-compose.dev.yml   # Development config
```

## Default Admin Account

After the application starts, use these credentials to access the admin dashboard:

- URL: `http://localhost:5173/admin`
- Email: `admin@coffeest.com`
- Password: `password`
