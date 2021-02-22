#!/usr/bin/env python
import os
from flask import Flask, send_from_directory
import logging

# I fully appreciate that this is not an adequate solution for a production environment,
# but as this is still a proof-of-concept, which will only be serving a few devices this will be fine.
# If I was deploying this properly, I would probably use an Apache Web-Server or something similar.

# This configures the Flask server to serve files from the React build directory
app = Flask(__name__, static_folder='build')


# Serve React App
@app.route('/', defaults={'path': ''})  # This will just accept all URLs
@app.route('/<path:path>')
def serve(path):
    # We need to determine whether to send a static file that is being requested,
    # or the React HTML, which will  do its own routing.

    if path != "" and os.path.exists(app.static_folder + '/' + path):
        # If the URL actually matches a file in the static folder,
        # we want to serve that file to the client.
        return send_from_directory(app.static_folder, path)
    else:
        # If they are making a request to a non-file URL, we want to send them the React file,
        # as this will do its own routing, i.e. to a 404 page or the Home-page
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    logging.log(logging.INFO, "Starting Server")

    # This is where we start the Flask server, I'll briefly explain some of the options I've used:
    #   host="0.0.0.0" - This makes sure that Flask is listening for requests
    #                    on the server's IP address rather than just 127.0.0.1
    #
    #   use_reloader=False - The reloader is a thing in Flask that reloads the website whenever there is a change
    #                        to the source-code but as this shouldn't happen in production, we can just disable it.
    #
    #   port=5000 - This is just the default port the service will run on, I needed to set this to 5000 rather than
    #               the default HTTP port 80, as I already have another service on my Raspberry Pi running on port 80.
    #
    #   threaded=True - This makes Flask multi-threaded, which will increase performance

    app.run(host='0.0.0.0', use_reloader=False, port=5000, threaded=True)
