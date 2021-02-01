#!/usr/bin/env python
import os
from flask import Flask, send_from_directory
import logging

app = Flask(__name__, static_folder='build')


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logging.log(logging.WARNING, "Sending")
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        logging.log(logging.WARNING, "File")
        return send_from_directory(app.static_folder, path)
    else:
        logging.log(logging.WARNING, "HTML")
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    logging.log(logging.ERROR, "Starting")
    app.run(host='0.0.0.0', use_reloader=True, port=5000, threaded=True)
