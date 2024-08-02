-- Creating the `users` table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Creating the `books` table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    averageScore DECIMAL(3, 2) DEFAULT -1
);

-- Creating the `borrows` table
CREATE TABLE borrows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    bookId INT,
    returnDate DATE,
    userScore INT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (bookId) REFERENCES books(id)
);
