
drop table cyProject;
drop table cyParticipant;
drop table cyActivity;
drop table cyTask;

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

create table cyTask
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	content					VARCHAR(255)    NOT NULL,
	activityId				BIGINT			NOT NULL,
	isUnderway				TINYINT(1)      NOT NULL,
	isCompleted				TINYINT(1)      NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	appointedDay			DATETIME,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);