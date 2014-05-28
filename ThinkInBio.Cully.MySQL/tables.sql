﻿
drop table cyProject;
drop table cyParticipant;
drop table cyActivity;

create table cyProject
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	name					VARCHAR(32)		NOT NULL,
	description				VARCHAR(255),
	creator					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

create table cyParticipant
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	projectId				BIGINT			NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

create table cyActivity
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	name					VARCHAR(32)		NOT NULL,
	description				VARCHAR(255),
	projectId				BIGINT			NOT NULL,
	isCompleted				TINYINT(1)      NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);