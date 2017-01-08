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
	date TIMESTAMP,
  added_by INTEGER REFERENCES user(id),
  updated_by INTEGER REFERENCES user(id),
  last_update TIMESTAMP
);

CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(35) UNIQUE,
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
	date TIMESTAMP,
  added_by INTEGER REFERENCES user(id),
  updated_by INTEGER REFERENCES user(id),
  last_update TIMESTAMP
);

CREATE TABLE distribution_details (
	distribution_id INTEGER REFERENCES distributions(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (distribution_id, category_id)
);




