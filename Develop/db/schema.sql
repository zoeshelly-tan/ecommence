-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

USE ecommerce_db;

CREATE TABLE category(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
category_name VARCHAR(30) NULL
);

CREATE TABLE product(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(30)NULL,
    price decimal(30)NULL,
    stock INT NOT NULL DEFAULT 50，
    category_id INT 
);

CREATE TABLE tag(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(30),

);

CREATE TABLE productTag(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_id INT
    tag_id INT

);





