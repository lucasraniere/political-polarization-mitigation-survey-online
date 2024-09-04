import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import lib.db_utils as db

os.chdir(os.path.dirname(__file__))
app = Flask(__name__)
cors = CORS(app, origins=[
    '150.165.85.100'
])
DATA_PATH = '../data/log/'


def save_2_log(message):
    with open(os.path.join(DATA_PATH + 'log.txt'), 'a') as f:
        f.write(f'{datetime.now().strftime("%Y-%m-%d %H:%M:%S")} -- {message}\n')


@app.route('/api')
def index():
    return jsonify({'message': 'Hello World!'})


@app.route('/api/check_participant/<string:id>', methods=['GET'])
def check_participant(id):
    save_2_log(f'Checking participant {id}')
    return jsonify(db.check_participant(id))


@app.route('/api/check_answer/<string:id>', methods=['GET'])
def check_answer(id):
    save_2_log(f'Checking answer {id}')
    return jsonify(db.check_answer(id))


@app.route('/api/get_tweet_ids/<string:id>', methods=['GET'])
def get_tweet_ids(id):
    save_2_log(f'Getting tweet ids for participant {id}')
    return jsonify(db.get_participant_tweets(id))


@app.route('/api/get_texts/<string:id_1>/<string:id_2>', methods=['GET'])
def get_texts(id_1, id_2):
    save_2_log(f'Getting texts for participants {id_1} and {id_2}')
    return jsonify(db.get_texts(id_1, id_2))


@app.route('/api/get_participant_group/<string:id>', methods=['GET'])
def get_participant_group(id):
    save_2_log(f'Getting participant {id} group')
    return jsonify({'group':db.get_participant_group(id)})

@app.route('/api/add_participant/', methods=['POST', 'GET'])
def add_participant():
    id = request.json['pId']
    db.add_participant(id)
    save_2_log(f'Participant {id} added')
    return jsonify({'message': f'Participant {id} added'})


@app.route('/api/add_session/', methods=['POST', 'GET'])
def add_session():
    data = request.json
    db.add_session(data['pId'], data['sId'])
    save_2_log(f'Session {data["sId"]} added')
    return jsonify({'message': f'Session {data["sId"]} added'})


@app.route('/api/set_participant_leaning/', methods=['POST', 'GET'])
def set_participant_leaning():
    data = request.json
    id = data['pId']
    p_leainig = data['leaning']
    db.set_participant_leaning(id, p_leainig)
    save_2_log(f'Participant {id} leaning set to {p_leainig}')
    return jsonify({'message': f'Participant {id} leaning set to {p_leainig}'})


@app.route('/api/create_answer/', methods=['POST', 'GET'])
def create_answer():
    data = request.json
    p_id = data['pId']
    s_id = data['sId']
    tt_number = data['tweetNumber']
    texts = db.create_answer(p_id, s_id, tt_number)
    save_2_log(f'Answer created for participant {p_id} and session {s_id}')
    return jsonify(texts)


@app.route('/api/set_answers/<string:a_id>', methods=['POST', 'PUT'])
def set_answers(a_id):
    answers = request.json
    db.set_answers(a_id, answers)
    save_2_log(f'Answer {a_id} set: {answers}')
    return jsonify({'message': 'Answer set'})


@app.route('/api/set_participant_status/', methods=['POST', 'PUT'])
def set_participant_status():
    data = request.json
    db.set_participant_status(data['pId'], data['status'])
    save_2_log(f'Participant {data["pId"]} status set to {data["status"]}')
    return jsonify({'message': f'Participant {data["pId"]} status set to {data["status"]}'})


@app.route('/api/get_answer/<string:id>', methods=['GET'])
def get_answer(id):
    save_2_log(f'Getting answer {id} from Participant {id[:-2]}')
    return jsonify(db.get_answer(id))


if __name__ == '__main__':
    app.run(debug=True)
