
drop table cyProject;
drop table cyParticipant;
drop table cyActivity;
drop table cyTask;
drop table cyLog;
drop table cyComment;

create table cyProject
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	name					VARCHAR(32)		NOT NULL,
	description				VARCHAR(255),
	isSolo					TINYINT(1)      NOT NULL,
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

create table cyLog
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	content					VARCHAR(10240)    NOT NULL,
	startTime				DATETIME		NOT NULL,
	endTime					DATETIME,
	tags					VARCHAR(128),
	commentCount			INT				NOT NULL default 0,
	creator					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

create table cyComment
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	target					TINYINT			NOT NULL,
	targetId				BIGINT			NOT NULL,
	content					VARCHAR(1024)    NOT NULL,
	creator					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);