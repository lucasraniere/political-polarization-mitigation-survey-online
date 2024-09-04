import os
import lib.utils as utils
from dotenv import load_dotenv
import mysql.connector

load_dotenv()
TABLE_SQLS = {
    'participants': '''CREATE TABLE IF NOT EXISTS Participants (
        ParticipantId VARCHAR(30) NOT NULL,
        TreatmentGroup VARCHAR(7) NOT NULL,
        PoliticalLeaning TINYINT(1),
        Tweet1 CHAR(4) NOT NULL,
        Tweet2 CHAR(4) NOT NULL,
        Tweet3 CHAR(4) NOT NULL,
        Tweet4 CHAR(4) NOT NULL,
        ParticipantStatus VARCHAR(9) NOT NULL,
        PRIMARY KEY (ParticipantId)
        );''',
    'sessions': '''CREATE TABLE IF NOT EXISTS Sessions (
        SessionId VARCHAR(30) NOT NULL,
        FK_ParticipantId VARCHAR(30) NOT NULL,
        PRIMARY KEY (SessionId),
        FOREIGN KEY (FK_ParticipantId) REFERENCES Participants(ParticipantId)
        );''',
    'Tweets': '''CREATE TABLE IF NOT EXISTS Tweets (
        TweetId CHAR(4) NOT NULL,
        TweetText VARCHAR(400) NOT NULL,
        PoliticalBias TINYINT(1) NOT NULL,
        TreatmentGroup VARCHAR(7) NOT NULL,
        Available TINYINT(1) NOT NULL,
        FK_ParticipantId VARCHAR(30),
        PRIMARY KEY (TweetId),
        FOREIGN KEY (FK_ParticipantId) REFERENCES Participants(ParticipantId)
        );''',
    'RephrasedTweets': '''CREATE TABLE IF NOT EXISTS RephrasedTweets (
        RepTweetId CHAR(5) NOT NULL,
        FK_TweetId CHAR(4) NOT NULL,
        RephrasedText VARCHAR(400) NOT NULL,
        TreatmentGroup VARCHAR(7) NOT NULL,
        PRIMARY KEY (RepTweetId),
        FOREIGN KEY (FK_TweetId) REFERENCES Tweets(TweetId)
        )''',
    'answers': '''CREATE TABLE IF NOT EXISTS Answers (
        AnswerId VARCHAR(30) NOT NULL,
        FK_ParticipantId VARCHAR(30) NOT NULL,
        FK_SessionId VARCHAR(30) NOT NULL,
        Text1 CHAR(5) NOT NULL,
        Text2 CHAR(5) NOT NULL,
        AnswerQ1 TINYINT(1),
        AnswerQ2 TINYINT(1),
        AnswerQ3 TINYINT(1),
        AnswerQ4 TINYINT(1),
        TimeSpent SMALLINT(5) NOT NULL,
        PRIMARY KEY (AnswerId),
        FOREIGN KEY (FK_ParticipantId) REFERENCES Participants(ParticipantId),
        FOREIGN KEY (FK_SessionId) REFERENCES Sessions(SessionId)
        )'''
}

def get_connection():
    return mysql.connector.connect(
    host = 'localhost',
    user= 'root',
    password = os.getenv('MYSQL_PASSWORD')
    )


## database creation
def create_database():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("CREATE DATABASE IF NOT EXISTS survey_db")
        create_tables()


def create_tables():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(TABLE_SQLS['participants'])
        cur.execute(TABLE_SQLS['sessions'])
        cur.execute(TABLE_SQLS['Tweets'])
        cur.execute(TABLE_SQLS['RephrasedTweets'])
        cur.execute(TABLE_SQLS['answers'])
        add_constraint(cur)


def add_constraint(cur):
    constraints = [
        ("FK_Tweet1", "Tweet1"),
        ("FK_Tweet2", "Tweet2"),
        ("FK_Tweet3", "Tweet3"),
        ("FK_Tweet4", "Tweet4"),
    ]
    for constraint_name, column_name in constraints:
        cur.execute(f'''
            ALTER TABLE Participants
            ADD CONSTRAINT {constraint_name}
            FOREIGN KEY ({column_name}) REFERENCES Tweets(TweetId)
        ''')


def add_tweet(id, text, bias, group):
    sql = ('INSERT INTO Tweets (TweetId, TweetText, PoliticalBias, TreatmentGroup, Available)'
        'VALUES (%s, %s, %s, %s, 1)')
    args = (id, text, bias, group)
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()


def add_rephrased_tweet(id, tweet_id, text, group):
    sql = ('INSERT INTO RephrasedTweets (RepTweetId, FK_TweetId, RephrasedText, TreatmentGroup)'
        'VALUES (%s, %s, %s, %s)')
    args = (id, tweet_id, text, group)
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()


## data checking
def get_group_counts():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT COUNT(*) FROM Participants WHERE TreatmentGroup='human'")
        h_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM Participants WHERE TreatmentGroup='machine'")
        m_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM Participants WHERE TreatmentGroup='placebo'")
        p_count = cur.fetchone()[0]
    return h_count, m_count, p_count


def check_participant(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT ParticipantStatus FROM Participants WHERE ParticipantId=%s", (id,))
        result = cur.fetchone()
        return {'status': result[0] if result else False}


def get_available_tweets(treatment_group):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT TweetId FROM Tweets WHERE Available=1 and TreatmentGroup=%s", (treatment_group,))
        return [row[0] for row in cur.fetchall()]


def get_participant_tweets(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT Tweet1, Tweet2, Tweet3, Tweet4 FROM Participants WHERE ParticipantId=%s", (id,))
        return cur.fetchone()


def get_participant_group(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT TreatmentGroup FROM Participants WHERE ParticipantId=%s", (id,))
        return cur.fetchone()[0]


def get_tweet(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT TweetText FROM Tweets WHERE TweetId=%s", (id,))
        return cur.fetchone()


def get_rephrased(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT RephrasedText FROM RephrasedTweets WHERE RepTweetId=%s", (id,))
        return cur.fetchone()


def get_rephrased_id(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT RepTweetId FROM RephrasedTweets WHERE FK_TweetId=%s", (id,))
        return cur.fetchone()


def get_text(id):
    if (len(id) == 4):
        return get_tweet(id)[0]
    else:
        return get_rephrased(id)[0]


def check_answer(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT Text1, Text2, TimeSpent FROM Answers WHERE AnswerId=%s", (id,))
        response = cur.fetchone()
        return {'text1': response[0], 'text2': response[1], 'time': response[2]} if response else False


def get_shuffled_texts(id, tweet_number):
    current_tweet = get_participant_tweets(id)[tweet_number-1]
    current_rephrased = get_rephrased_id(current_tweet)[0]
    shuffle_ids = utils.shuffle_texts([current_tweet, current_rephrased])
    return {'text1': shuffle_ids[0], 'text2': shuffle_ids[1]}


def get_texts(id_1, id_2):
    return {'text1': get_text(id_1), 'text2': get_text(id_2)}


def get_answer(id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT Text1, Text2, AnswerQ1, AnswerQ2, AnswerQ3, AnswerQ4, TimeSpent FROM Answers WHERE AnswerId=%s", (id,))
        response = cur.fetchone()
        return {'text1': get_text(response[0]), 'text2': get_text(response[1]),'q1': response[2], 'q2': response[3], 'q3': response[4], 'q4': response[5], 'time': response[6]} if response else False


## data manipulation
def set_assigned_tweets(p_id, t_id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        for id in t_id:
            cur.execute("UPDATE Tweets SET FK_ParticipantId=%s, Available=0 WHERE TweetId=%s", (p_id, id))
        con.commit()


def add_session(p_id, s_id):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("INSERT IGNORE INTO Sessions (SessionId, FK_ParticipantId) VALUES (%s, %s)", (s_id, p_id))
        con.commit()


def add_participant(id):
    h_count, m_count, p_count = get_group_counts()
    assigned_group = utils.select_group(h_count, m_count, p_count)
    assigned_tweets = utils.select_tweets(get_available_tweets(assigned_group))
    sql = ('INSERT INTO Participants (ParticipantId, TreatmentGroup, Tweet1, Tweet2, Tweet3, Tweet4, ParticipantStatus)'
            'VALUES (%s, %s, %s, %s, %s, %s, %s)')
    args = (id, assigned_group, assigned_tweets[0], assigned_tweets[1],
            assigned_tweets[2], assigned_tweets[3], 'started')
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()
    set_assigned_tweets(id, assigned_tweets)


def set_participant_leaning(id, leaning):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("UPDATE Participants SET PoliticalLeaning=%s, ParticipantStatus='tweet_1' WHERE ParticipantId=%s", (leaning, id))
        con.commit()


def create_answer(p_id, s_id, tweet_number):
    answer_id = p_id + 'T' + str(tweet_number)
    shuffled_text_ids = get_shuffled_texts(p_id, tweet_number)
    text_1 = get_text(shuffled_text_ids['text1'])
    text_2 = get_text(shuffled_text_ids['text2'])
    sql = ('INSERT INTO Answers (AnswerId, FK_ParticipantId, FK_SessionId, Text1, Text2, TimeSpent)'
    'VALUES (%s, %s, %s, %s, %s, %s)')
    args = (answer_id, p_id, s_id, shuffled_text_ids['text1'], shuffled_text_ids['text2'], 0)
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()
    return {'text1': text_1, 'text2': text_2}


def set_answers(a_id, answers):
    sql = ('UPDATE Answers SET AnswerQ1=%s, AnswerQ2=%s, AnswerQ3=%s, AnswerQ4=%s, TimeSpent=%s WHERE AnswerId=%s')
    args = (answers['q1'], answers['q2'], answers['q3'], answers['q4'], answers['timeSpent'],a_id)
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()


def set_participant_status(id, status):
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("UPDATE Participants SET ParticipantStatus=%s WHERE ParticipantId=%s", (status, id))
        con.commit()