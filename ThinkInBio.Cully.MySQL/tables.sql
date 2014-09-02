
delete from cyProject;
delete from cyParticipant;
delete from cyActivity;
delete from cyTask;
delete from cyTaskDelay;
delete from cyTaskReport;
delete from cyLog;
delete from cyLogVisibleUser;
delete from cyComment;


drop table cyProject;
drop table cyParticipant;
drop table cyActivity;
drop table cyTask;
drop table cyTaskDelay;
drop table cyTaskReport;
drop table cyLog;
drop table cyLogVisibleUser;
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
ALTER TABLE cyProject ADD INDEX modification_index  (modification);

create table cyParticipant
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	projectId				BIGINT			NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyParticipant ADD INDEX modification_index  (modification);

create table cyActivity
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	category				VARCHAR(32)		NOT NULL,
	name					VARCHAR(32)		NOT NULL,
	description				VARCHAR(255),
	projectId				BIGINT			NOT NULL,
	isCompleted				TINYINT(1)      NOT NULL,
	creator					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyActivity ADD INDEX modification_index  (modification);

create table cyTask
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	content					VARCHAR(255)    NOT NULL,
	activityId				BIGINT			NOT NULL,
	isUnderway				TINYINT(1)      NOT NULL,
	isCompleted				TINYINT(1)      NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	appointedDay			DATETIME,
	completion				DATETIME,
	commentCount			INT				NOT NULL default 0,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyTask ADD INDEX activity_id_index  (activityId);

create table cyTaskDelay
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	scope					TINYINT(1)      NOT NULL,
	activityId				BIGINT			NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	total					INT				NOT NULL default 0,
	delay					INT				NOT NULL default 0,
	untimed					INT				NOT NULL default 0,
	year					INT				NOT NULL,
	month					INT				NOT NULL,
	day						INT				NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyTaskDelay ADD INDEX timestamp_index  (year,month,day);
ALTER TABLE cyTaskDelay ADD INDEX activity_id_index  (activityId);

create table cyTaskReport
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	activityId				BIGINT			NOT NULL,
	staff					VARCHAR(32)		NOT NULL,
	count					INT				NOT NULL default 0,
	year					INT				NOT NULL,
	month					INT				NOT NULL,
	day						INT				NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyTaskReport ADD INDEX timestamp_index  (year,month,day);

create table cyLog
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	title					VARCHAR(255)      NOT NULL,
	content					VARCHAR(10240)    NOT NULL,
	category				VARCHAR(32)		NOT NULL,
	startTime				DATETIME		NOT NULL,
	endTime					DATETIME,
	tags					VARCHAR(128),
	commentCount			INT				NOT NULL default 0,
	visibility				TINYINT			NOT NULL default 0,
	creator					VARCHAR(32)		NOT NULL,
	creation				DATETIME		NOT NULL,
	modification			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

create table cyLogVisibleUser
(
	logId					BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	username				VARCHAR(32)		NOT NULL,
	PRIMARY KEY (logId,username)
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