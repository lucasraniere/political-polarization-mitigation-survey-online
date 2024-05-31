import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import lib.db_utils as db

os.chdir(os.path.dirname(__file__))
app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/')
def index():
    return jsonify({'message': 'Hello World!'})


@app.route('/check_participant/<string:id>', methods=['GET'])
def check_participant(id):
    return jsonify(db.check_participant(id))


@app.route('/add_participant/<string:id>', methods=['POST', 'GET'])
def add_participant(id):
    db.add_participant(id)
    return jsonify({'message': f'Participant {id} added'})


@app.route('/add_session/<string:pid>/<string:sid>', methods=['POST', 'GET'])
def add_session(pid, sid):
    db.add_session(pid, sid)
    return jsonify({'message': f'Session {id} added'})


@app.route('/set_participant_leaning/<string:id>/<p_leainig>', methods=['POST', 'GET'])
def set_participant_leaning(id, p_leainig):
    db.set_participant_leaning(id, p_leainig)
    return jsonify({'message': f'Participant {id} leaning set to {p_leainig}'})

if __name__ == '__main__':
    app.run(debug=True)
