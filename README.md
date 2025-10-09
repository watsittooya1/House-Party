<img width="2558" height="1315" alt="image" src="https://github.com/user-attachments/assets/6be42f6f-1015-4e08-9e1d-5a8317baf7c8" />NOTE: you won't be able to take advantage of playback or queueing after connecting your Spotify account, this app is in development mode. Spotify unfortunately will not approve this project for extension as it is a hobby project, so any users that wish to use the site's functionality will have to have their premium account email registered under the app, by me. More info here: https://developer.spotify.com/blog/2023-05-29-quota-extension

House Party is a web app that allows users to join and host common Spotify radio rooms, using only one premium account! Users can control audio playback, add songs to queue, skip songs, and even play audio from the browser.
The deployed site can be found at https://house-party.social

<img width="2558" height="1315" alt="image" src="https://github.com/user-attachments/assets/47952d0d-d306-4370-b358-d45f86a6a3b1" />

This project started out as a tutorial for me to deepen my understanding of Django and React, but turned into a full-fledged deployment as I explored different possibilities and technologies.

Users can authenticate by redirecting to Spotify's login page from the webapp, and enable audio streaming by switching the 'Current Device' setting on Spotify via the app or website.

Config notes:
create a new virtual env
create a new secret.py file with secret key
create a new spotify.credentials file with client secret and api key
install django-rest-framework, django-requests
change posix user in nginx config to owner of project directory
