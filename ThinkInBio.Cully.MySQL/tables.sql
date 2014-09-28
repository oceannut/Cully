
delete from cyProject;
delete from cyParticipant;
delete from cyActivity;
delete from cyTask;
delete from cyTaskDelay;
delete from cyTaskReport;
delete from cyLog;
delete from cyComment;
delete from cyCalendar;
delete from cyCalendarCaution;
delete from cyAttachment;
commit;


drop table cyProject;
drop table cyParticipant;
drop table cyActivity;
drop table cyTask;
drop table cyTaskDelay;
drop table cyTaskReport;
drop table cyLog;
drop table cyComment;
drop table cyCalendar;
drop table cyCalendarCaution;
drop table cyAttachment;


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
	PRIMARY KEY (id)
);
ALTER TABLE cyParticipant ADD INDEX project_id_index  (projectId);

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
ALTER TABLE cyActivity ADD INDEX project_id_index  (projectId);

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
ALTER TABLE cyTaskReport ADD INDEX activity_id_index  (activityId);

create table cyLog
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	projectId				BIGINT				NOT NULL default 0,
	title					VARCHAR(255)		NOT NULL,
	content					VARCHAR(10240)		NOT NULL,
	category				VARCHAR(32)			NOT NULL,
	tags					VARCHAR(128),
	commentCount			INT					NOT NULL default 0,
	visibility				TINYINT				NOT NULL default 0,
	creator					VARCHAR(32)			NOT NULL,
	creation				DATETIME			NOT NULL,
	modification			DATETIME			NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyLog ADD INDEX modification_index  (modification);
ALTER TABLE cyLog ADD INDEX project_id_index  (projectId);

create table cyComment
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	target					TINYINT				NOT NULL,
	targetId				BIGINT				NOT NULL,
	content					VARCHAR(1024)		NOT NULL,
	creator					VARCHAR(32)			NOT NULL,
	creation				DATETIME			NOT NULL,
	modification			DATETIME			NOT NULL,
	PRIMARY KEY (id)
);

create table cyCalendar
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	type					TINYINT				NOT NULL,
	projectId				BIGINT				NOT NULL default 0,
	content					VARCHAR(255)		NOT NULL,
	appointed				DATETIME,
	endAppointed			DATETIME,
	level					TINYINT				NOT NULL,
	_repeat					TINYINT				NOT NULL,
	caution					DATETIME,
	isCaution				TINYINT(1)			NOT NULL,
	creator					VARCHAR(32)			NOT NULL,
	creation				DATETIME			NOT NULL,
	modification			DATETIME			NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyCalendar ADD INDEX modification_index  (modification);
ALTER TABLE cyCalendar ADD INDEX project_id_index  (projectId);

create table cyCalendarCaution
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	calendarId				BIGINT	unsigned	NOT NULL,
	staff					VARCHAR(32)			NOT NULL,
	creation				DATETIME		NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyCalendarCaution ADD INDEX calendar_id_index  (calendarId);

create table cyAttachment
(
	id						BIGINT	unsigned	NOT NULL AUTO_INCREMENT,
	projectId				BIGINT				NOT NULL default 0,
	title					VARCHAR(255)		NOT NULL,
	path					VARCHAR(255)		NOT NULL,
	creation				DATETIME			NOT NULL,
	PRIMARY KEY (id)
);
ALTER TABLE cyAttachment ADD INDEX project_id_index  (projectId);