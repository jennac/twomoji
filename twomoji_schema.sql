CREATE SEQUENCE pksq START 1;
CREATE TYPE statusenum AS ENUM ('0', '1', '2');

CREATE TABLE "users" (
"id" int4 DEFAULT nextval('pksq'),
"username" varchar(50),
PRIMARY KEY ("id")
);

CREATE TABLE "targets" (
"id" int4 DEFAULT nextval('pksq'),
"emoji_pair" varchar(255),
"weight" int4, 
"status" statusenum,
PRIMARY KEY ("id")
);

CREATE TABLE "submissions" (
"id" int4 DEFAULT nextval('pksq'),
"user_id" int4 REFERENCES users,
"target_id" int4 REFERENCES targets,
"photo" varchar(255),
"score" int4,
"description" text,
PRIMARY KEY ("id")
);

CREATE TABLE "user_targets" (
"id" int4 DEFAULT nextval('pksq'),
"user_id" int4 REFERENCES users,
"target_id" int4 REFERENCES targets,
"points" int4,
PRIMARY KEY ("id")
);
