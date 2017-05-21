CREATE TABLE videos (
    id serial NOT NULL PRIMARY KEY,
    author varchar(255),
    title varchar(1024),
    description text,
    path varchar(1024),
    size bigint
);

CREATE TABLE comments (
    id serial NOT NULL PRIMARY KEY,
    video_id integer NOT NULL,
    author varchar(255),
    content text
);
