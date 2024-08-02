# My Project

## Project Description

This project is a library management system developed using **Node.js** and **Express.js**. It provides REST APIs and utilizes **MySQL** for database management.

## Setup

### Database Setup

To manually set up the database tables, use the following command:

```bash
mysql -u [user_name] -p [db_name] < path/to/create_tables.sql

Replace [user_name] with your MySQL username and [db_name] with the name of your database. Provide the correct path to the create_tables.sql file.

Environment Variables
Create a .env file in the root directory of your project with the following content:

**DB_HOST=localhost**
**DB_USER=root**
**DB_PASS=**
**DB_NAME=library_db**

**PORT=3000**

This file contains the database connection details and the port number on which the application will run.

Starting the Project
Install Dependencies

Run the following command to install the necessary packages:

npm install
Start the Application

Start the project with:

npm run start

This command will launch your application on the port specified in the .env file.

Usage

After starting the project, you can interact with the API endpoints using Postman or a similar tool. For detailed information about the available endpoints, refer to the project's documentation.
