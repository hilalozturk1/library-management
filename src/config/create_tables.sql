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

INSERT INTO users (id, name) VALUES 
(2, 'Enes Faruk Meniz'),
(1, 'Eray Aslan'),
(4, 'Kadir Mutlu'),
(3, 'Sefa Eren Şahin');

INSERT INTO books (id, name, averageScore) VALUES 
(4, '1984', -1),
(5, 'Brave New World', -1),
(3, 'Dune', -1),
(2, 'I, Robot', -5.33),
(1, 'The Hitchhiker''s Guide to the Galaxy', -1);
