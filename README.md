vidhost-express
===============

Simple video hosting app backend based on Express 4.

Starting the application
------------------------

* Install Docker and Docker Compose
* Register your OAuth 2.0 app at [https://console.developers.google.com/]()
    * Set up `http://localhost:3000/auth/google/callback` as authorized redirect URI
    * Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `docker-compose.yml`
* `docker-compose up`
* You can trigger authentication by going to [http://localhost:3000/auth/google]()

Stopping the application
------------------------

`docker-compose down`

Rebuilding the application
--------------------------

`docker-compose build && docker-compose up`

Testing streaming
-----------------

Use `stream_test.html` - just update the ID to that of the video you want to test