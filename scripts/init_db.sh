#!/bin/bash
echo "CREATE DATABASE securenotes CHARACTER SET utf8;" | mysql -uroot
echo "GRANT ALL ON securenotes.* TO nodeuser IDENTIFIED BY 'nodeuser';" | mysql -uroot
mysql -unodeuser -pnodeuser securenotes < schema.sql
