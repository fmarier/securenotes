CREATE TABLE IF NOT EXISTS account ( id INT AUTO_INCREMENT, email VARCHAR(255) NOT NULL, wrappedkey VARCHAR(1024), PRIMARY KEY (id), UNIQUE (email));
CREATE TABLE IF NOT EXISTS note ( id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, content TEXT, owner INT NOT NULL, revision INT NOT NULL DEFAULT 1, ctime INT NOT NULL, deleted INT(1) NOT NULL DEFAULT 0, PRIMARY KEY (id), FOREIGN KEY (owner) REFERENCES account(id) );