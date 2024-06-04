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


@app.route('/check_answer/<string:id>', methods=['GET'])
def check_answer(id):
    return jsonify(db.check_answer(id))


@app.route('/get_tweet_ids/<string:id>', methods=['GET'])
def get_tweet_ids(id):
    return jsonify(db.get_participant_tweets(id))


@app.route('/get_texts/<string:id_1>/<string:id_2>', methods=['GET'])
def get_texts(id_1, id_2):
    return jsonify(db.get_texts(id_1, id_2))


@app.route('/add_participant/', methods=['POST', 'GET'])
def add_participant():
    id = request.json['pId']
    db.add_participant(id)
    return jsonify({'message': f'Participant {id} added'})


@app.route('/add_session/', methods=['POST', 'GET'])
def add_session():
    data = request.json
    db.add_session(data['pId'], data['sId'])
    return jsonify({'message': f'Session {data['sId']} added'})


@app.route('/set_participant_leaning/', methods=['POST', 'GET'])
def set_participant_leaning():
    data = request.json
    id = data['pId']
    p_leainig = data['leaning']
    db.set_participant_leaning(id, p_leainig)
    return jsonify({'message': f'Participant {id} leaning set to {p_leainig}'})


@app.route('/create_answer/', methods=['POST', 'GET'])
def create_answer():
    data = request.json
    p_id = data['pId']
    s_id = data['sId']
    tt_number = data['tweetNumber']
    texts = db.create_answer(p_id, s_id, tt_number)
    return jsonify(texts)

@app.route('/set_answers/<string:a_id>', methods=['POST', 'PUT'])
def set_answers(a_id):
    answers = request.json
    db.set_answers(a_id, answers)
    return jsonify({'message': 'Answer set'})


@app.route('/set_participant_status/', methods=['POST', 'PUT'])
def set_participant_status():
    data = request.json
    db.set_participant_status(data['pId'], data['status'])
    return jsonify({'message': f'Participant {data['pId']} status set to {data['status']}'})


if __name__ == '__main__':
    app.run(debug=True)
