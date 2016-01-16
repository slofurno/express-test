#!/bin/sh
db="test.db"

sqlite3 $db "create table accounts (id varchar(40), email varchar(90), password varchar(50), salt varchar(50));"
