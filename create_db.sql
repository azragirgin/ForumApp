# Create database script for Forum App

# Create the database
CREATE DATABASE IF NOT EXISTS ForumApp;
USE ForumApp;

# Create the app user and give it access to the database
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON ForumApp.* TO 'appuser'@'localhost';

CREATE TABLE IF NOT EXISTS Topics (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

# Create the tables
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS Forum (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  topic_id INT,
  user_id INT,
  FOREIGN KEY (topic_id) REFERENCES Topics(id),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

# Create the IF NOT EXISTS tables
CREATE TABLE IF NOT EXISTS Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS addposts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  topic_id INT,
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (topic_id) REFERENCES Topics(id)
);


