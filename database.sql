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

CREATE TABLE contacts (
	id SERIAL PRIMARY KEY,
	donor BOOLEAN DEFAULT FALSE,
	org BOOLEAN DEFAULT FALSE,
	org_type org_type,
	org_id INTEGER REFERENCES contacts(id),
	org_name VARCHAR(75),
	first_name VARCHAR(35),
	last_name VARCHAR(35),
	address VARCHAR (75),
	city VARCHAR(35),
	state VARCHAR(2),
	postal_code VARCHAR(12),
	email VARCHAR(255),
	phone_number VARCHAR(20)
	CHECK ((org IS TRUE AND org_type IS NOT NULL) OR (org IS FALSE AND org_type IS NULL))
);

CREATE TABLE donations (
	id SERIAL PRIMARY KEY,
	organization_id INTEGER REFERENCES organizations(id),
	individual_id INTEGER REFERENCES individuals(id),
	date DATE,
  timestamp TIMESTAMP,
  added_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  last_update TIMESTAMP,
  UNIQUE (organization_id, date),
  UNIQUE (individual_id, date),
  CHECK ((organization_id IS NULL AND individual_id IS NOT NULL) OR (organization_id IS NOT NULL AND individual_id IS NULL))
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
	date DATE,
  timestamp TIMESTAMP,
  added_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id),
  last_update TIMESTAMP,
  UNIQUE (organization_id, date)
);

CREATE TABLE distribution_details (
	distribution_id INTEGER REFERENCES distributions(id),
	category_id INTEGER REFERENCES categories(id),
	amount NUMERIC(11,2),
	PRIMARY KEY (distribution_id, category_id)
);
