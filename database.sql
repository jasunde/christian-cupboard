CREATE EXTENSION citext;

CREATE EXTENSION tablefunc;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(35),
	last_name VARCHAR(35),
	email CITEXT UNIQUE NOT NULL,
	is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
	date_added TIMESTAMP DEFAULT current_timestamp,
	last_login TIMESTAMP
);

CREATE TYPE org_type AS ENUM ('sub_distribution', 'food_rescue', 'donor');

CREATE TABLE organizations (
	id SERIAL PRIMARY KEY,
	type org_type,
	name VARCHAR(75) NOT NULL,
	address VARCHAR (75),
	city VARCHAR(35),
	state VARCHAR(2),
	postal_code VARCHAR(12),
	email VARCHAR(255),
	phone_number VARCHAR(20)
);

CREATE TABLE individuals (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(35) NOT NULL,
	last_name VARCHAR(35) NOT NULL,
	address VARCHAR (75),
	city VARCHAR(35),
	state VARCHAR(2),
	postal_code VARCHAR(12),
	email VARCHAR(255),
	organization_id INTEGER REFERENCES organizations(id),
	phone_number VARCHAR(20)
);

CREATE TABLE donations (
	id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(id),
	individual_id INTEGER REFERENCES individuals(id),
	date TIMESTAMP
);

CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(35),
	food_rescue BOOLEAN DEFAULT FALSE,
	food_drive BOOLEAN DEFAULT FALSE,
	daily_dist BOOLEAN DEFAULT FALSE,
	sub_dist BOOLEAN DEFAULT FALSE	
);

CREATE TABLE donation_details (
	donation_id INTEGER REFERENCES donations(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (donation_id, category_id)
);

CREATE TABLE distributions (
	id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(id),
	first_name VARCHAR(35),
	last_name VARCHAR(35),
	date TIMESTAMP
);

CREATE TABLE distribution_details (
	distribution_id INTEGER REFERENCES distributions(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (distribution_id, category_id)
);



### Other scratch work: ###
- - - 

CREATE EXTENSION citext;
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(35),
	last_name VARCHAR(35),
	email CITEXT UNIQUE NOT NULL,
	is_admin BOOLEAN DEFAULT FALSE,
	date_added TIMESTAMP DEFAULT current_timestamp,
	last_login TIMESTAMP
);

INSERT INTO users(first_name, last_name, email)
VALUES('Jason', 'Sunde', 'jlaurits@gmail.com');

UPDATE users
SET is_admin = NOT is_admin
WHERE id = 1;

SELECT * FROM users;

DROP TABLE users;

CREATE TYPE org_type AS ENUM ('sub_distribution', 'food_rescue', 'donor');
CREATE TABLE organizations (
	id SERIAL PRIMARY KEY,
	type org_type,
	name VARCHAR(75) NOT NULL,
	address VARCHAR (75),
	city VARCHAR(35),
	state VARCHAR(2),
	postal_code VARCHAR(12),
	email VARCHAR(255),
	phone_number VARCHAR(20)
);

INSERT INTO organizations (type, name, address, city, state, postal_code, email, phone_number)
VALUES (
	'food_rescue',
	'Jerrys',
	'123 Road St',
	'Woodbury',
	'MN',
	'55555',
	'info@jerrys.com',
	'612-555-1234'
);

SELECT * FROM organizations;

DROP TABLE organizations;

CREATE TABLE individuals (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(35) NOT NULL,
	last_name VARCHAR(35),
	address VARCHAR (75),
	city VARCHAR(35),
	state VARCHAR(2),
	postal_code VARCHAR(12),
	email VARCHAR(255),
	organization_id INTEGER REFERENCES organizations(id),
	phone_number VARCHAR(20)
);

INSERT INTO individuals (first_name, last_name, address, city, state, postal_code, email, phone_number, organization_id)
VALUES (
	'John',
	'Smith',
	'678 Road St',
	'Woodbury',
	'MN',
	'55555',
	'john@smith.com',
	'612-555-1234',
	1
);

SELECT * FROM individuals;

SELECT first_name, last_name
FROM individuals
WHERE organization_id = 1;

DROP TABLE individuals;

CREATE TABLE donations (
	id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(id),
	individual_id INTEGER REFERENCES individuals(id),
	date TIMESTAMP
);

INSERT INTO donations (organization_id, date)
VALUES (1, current_timestamp);

SELECT * FROM donations;

CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(35),
	food_rescue BOOLEAN DEFAULT FALSE,
	food_drive BOOLEAN DEFAULT FALSE,
	daily_dist BOOLEAN DEFAULT FALSE,
	sub_dist BOOLEAN DEFAULT FALSE	
);

INSERT INTO categories (name, food_rescue)
VALUES ('Milk', true);

SELECT * FROM categories;

CREATE EXTENSION tablefunc;

CREATE TABLE donation_details (
	donation_id INTEGER REFERENCES donations(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (donation_id, category_id)
);

INSERT INTO donation_details (donation_id, category_id, amount)
VALUES (2,2,10);

UPDATE donation_details
SET amount = 25
WHERE donation_id = 1 AND category_id = 2;

SELECT donation_id, name, amount FROM donation_details
JOIN categories ON categories.id = donation_details.category_id
ORDER BY 1,2;

SELECT organizations.name, donation_id, sausage, milk, date 
FROM crosstab('SELECT donation_id, name, amount FROM donation_details
JOIN categories ON categories.id = donation_details.category_id
ORDER BY 1,2')
AS ct(donation_id INTEGER, Sausage NUMERIC, Milk NUMERIC)
JOIN donations ON ct.donation_id = donations.id
JOIN organizations ON donations.organization_id = organizations.id;

DROP TABLE donation_details;

CREATE TABLE distributions (
	id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(id),
	first_name VARCHAR(35),
	last_name VARCHAR(35),
	date TIMESTAMP
);

INSERT INTO distributions (first_name, last_name, date)
VALUES ('Angie', 'Joh', current_timestamp); 

SELECT first_name, last_name, COUNT(*) FROM distributions
GROUP BY first_name, last_name;

CREATE TABLE distribution_details (
	distribution_id INTEGER REFERENCES distributions(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (distribution_id, category_id)
);
