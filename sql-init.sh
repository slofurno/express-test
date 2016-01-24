#!/bin/sh
db="test.db"

sqlite3 $db "CREATE TABLE users (id varchar(40), email varchar(100), sex int, state text);
CREATE TABLE prints (UserId varchar(40), AdId varchar(40));
CREATE INDEX user_index on users (id);
CREATE INDEX users_state on users (state);
CREATE INDEX print_ad_user on prints (AdId, UserId);
CREATE TABLE ads (id varchar(40), AccountId varchar(40), name varchar(100), path varchar(140));
CREATE TABLE accounts (id varchar(40), email varchar(90) unique, password varchar(50), salt varchar(50), role varchar(20));
CREATE TABLE logins (AccountId varchar(40), token varchar(40), address varchar(40));
CREATE TABLE profiles (AccountId varchar(40), json text);"

