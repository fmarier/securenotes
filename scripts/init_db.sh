#!/bin/bash
echo "CREATE DATABASE securenotes CHARACTER SET utf8;" | mysql -uroot -p
echo "GRANT ALL ON securenotes.* TO nodeuser IDENTIFIED BY 'nodeuser';" | mysql -uroot -p
mysql -unodeuser -pnodeuser securenotes < schema.sql
