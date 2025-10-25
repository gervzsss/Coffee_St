# Coffee_St Setup Guide

Welcome to Coffee_St! Follow these steps to set up the project after cloning.

## 1. Prerequisites

Before you begin, make sure you have the following installed:

- **PHP** (>=8.0 recommended)
- **Composer** (for PHP dependencies)
- **Node.js** (>=18.x recommended)
- **npm** (comes with Node.js)
- **XAMPP** (or any Apache + MySQL stack)
- **MySQL** (or MariaDB)
- **Git** (for cloning the repository)

You can download these from their official websites:

- PHP: <https://www.php.net/downloads>
- Composer: <https://getcomposer.org/download/>
- Node.js & npm: <https://nodejs.org/>
- XAMPP: <https://www.apachefriends.org/index.html>
- Git: <https://git-scm.com/downloads>

---

## 2. Clone the Repository

Open **CMD** (not PowerShell) and run:

```cmd
git clone https://github.com/gervzsss/Coffee_St.git
cd Coffee_St
```

---

## 3. Install PHP Dependencies

Run the following in CMD:

```cmd
composer install
```

---

## 4. Install Node Dependencies & Build CSS

```cmd
npm install
npm run build
```

To watch for CSS changes during development:

```cmd
npm run watch
```

---

## 5. Environment Variable Setup

Copy the example environment file using CMD:

```cmd
copy .env.example .env
```

Then open `.env` in a text editor and fill in your database credentials and any other required values. Example:

```env
DB_HOST=localhost
DB_NAME=coffee_st
DB_USER=root
DB_PASS=
```

Adjust values as needed for your local setup.

---

## 6. Database Setup

**Note:** If you have MySQL Workbench installed and running, you do not need to start MySQL via XAMPP. Otherwise, start MySQL using XAMPP before proceeding.

You can either open the `.sql` files in MySQL Workbench as scripts, or copy and paste their contents directly into a new query tab and execute.

1. Import the SQL schema using **MySQL Workbench**:
   - Open MySQL Workbench and connect to your local MySQL server.
   - Go to **File > Open SQL Script** and select `database/schema.sql`, or copy and paste its contents into a new query tab.
   - Execute the script to create the database and tables.

2. (Optional) Import sample data:
   - In MySQL Workbench, open `database/coffee_st.sql` or copy and paste its contents into a new query tab, then execute to populate sample data.

---

## 7. Local Server Setup

1. Start Apache via XAMPP.
2. Set the web root to the `public/` folder of this project.
   - Example path: `C:/xampp/htdocs/COFFEE_ST/public/`
3. Access the app at: `http://localhost/COFFEE_ST/public/`

---

## 8. Directory Structure Overview

- `public/` — Entry point, assets, and main pages
- `src/` — PHP source code (controllers, models, views, etc.)
- `database/` — SQL schema and migrations
- `dist/` — Compiled CSS
- `vendor/` — Composer dependencies
- `node_modules/` — npm dependencies

---

## 9. Running & Accessing the App

- Start Apache and MySQL via XAMPP
- Visit `http://localhost/COFFEE_ST/public/` in your browser

---

## 10. Troubleshooting & Common Issues

- **CSS not updating?** Run `npm run build` or `npm run watch`.
- **Database errors?** Check `.env` and import SQL files.
- **404 or server errors?** Ensure Apache is running and web root is set to `public/`.
- **Composer issues?** Run `composer install` again.

For further help, contact Gervy 😆.

---

Enjoy your Coffee_St development experience!
