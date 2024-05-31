import lib.db_utils as db

test_data = [
    {
        'id': 'qweqwassad',
        'session': 'asdasdasdasd',
        'leaning': 0,
    },
    {
        'id': 'asdasd123',
        'session': 'qweqweqwe',
        'leaning': 1,
    },
    {
        'id': 'zxczxc456',
        'session': 'tyutyutyu',
        'leaning': 5,
    },
    {
        'id': 'poiuyt789',
        'session': 'lkjhgfd',
        'leaning': 3,
    },
]

def main():
    for participant in test_data:
        db.add_participant(participant['id'])
        db.add_session(participant['id'], participant['session'])
        db.set_participant_leaning(participant['id'], participant['leaning'])

if __name__ == '__main__':
    main()
