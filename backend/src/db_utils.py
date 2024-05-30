import os, utils
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

TABLE_SQLS = {
    'participants': '''CREATE TABLE IF NOT EXISTS Participants (
        ParticipantId VARCHAR(50) NOT NULL,
        TreatmentGroup VARCHAR(7) NOT NULL,
        Tweet1 CHAR(4) NOT NULL,
        Tweet2 CHAR(4) NOT NULL,
        Tweet3 CHAR(4) NOT NULL,
        Tweet4 CHAR(4) NOT NULL,
        ParticipantStatus VARCHAR(9) NOT NULL,
        PRIMARY KEY (ParticipantId)
        );''',
    'sessions': '''CREATE TABLE IF NOT EXISTS Sessions (
        SessionId VARCHAR(50) NOT NULL,
        ParticipantId VARCHAR(50) NOT NULL,
        PRIMARY KEY (SessionId),
        FOREIGN KEY (ParticipantId) REFERENCES Participants(ParticipantId)
        );''',
    'Tweets': '''CREATE TABLE IF NOT EXISTS Tweets (
        TweetId CHAR(4) NOT NULL,
        TweetText VARCHAR(280) NOT NULL,
        PoliticalBias TINYINT(1) NOT NULL,
        Available TINYINT(1) NOT NULL,
        ParticipantId VARCHAR(50),
        PRIMARY KEY (TweetId),
        FOREIGN KEY (ParticipantId) REFERENCES Participants(ParticipantId)
        );''',
    'RephrasedTweets': '''CREATE TABLE IF NOT EXISTS RephrasedTweets (
        RepTweetId CHAR(5) NOT NULL,
        TweetId CHAR(4) NOT NULL,
        RephrasedText VARCHAR(280) NOT NULL,
        TreatmentGroup VARCHAR(7) NOT NULL,
        PRIMARY KEY (RepTweetId),
        FOREIGN KEY (TweetId) REFERENCES Tweets(TweetId)
        )''',
    'answers': '''CREATE TABLE IF NOT EXISTS Answers (
        AnswerId INT NOT NULL AUTO_INCREMENT,
        ParticipantId VARCHAR(50) NOT NULL,
        SessionId VARCHAR(50) NOT NULL,
        Text1 CHAR(5) NOT NULL,
        Text2 CHAR(5) NOT NULL,
        AnswerQ1 TINYINT(1) NOT NULL,
        AnswerQ2 TINYINT(1) NOT NULL,
        AnswerQ3 TINYINT(1) NOT NULL,
        AnswerQ4 TINYINT(1) NOT NULL,
        PRIMARY KEY (AnswerId),
        FOREIGN KEY (ParticipantId) REFERENCES Participants(ParticipantId),
        FOREIGN KEY (SessionId) REFERENCES Sessions(SessionId)
        )'''
}

def get_connection():
    return mysql.connector.connect(
    host = 'localhost',
    user= 'root',
    password = os.getenv('MYSQL_PASSWORD')
    )


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


def get_available_tweets():
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute("SELECT TweetId FROM Tweets WHERE Available=1")
        return [row[0] for row in cur.fetchall()]


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


def add_tweet(id, text, bias):
    sql = ('INSERT INTO Tweets (TweetId, TweetText, PoliticalBias, Available)'
        'VALUES (%s, %s, %s, 1)')
    args = (id, text, bias)
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()


def change_assigned_tweets(p_id, t_id):
    pass


def add_participant(id):
    h_count, m_count, p_count = get_group_counts()
    assigned_group = utils.select_group(h_count, m_count, p_count)
    assigned_tweets = utils.select_tweets(get_available_tweets())
    sql = ('INSERT INTO Participants (ParticipantId, TreatmentGroup, Tweet1, Tweet2, Tweet3, Tweet4, ParticipantStatus)'
            'VALUES (%s, %s, %s, %s, %s, %s, %s)')
    args = (id, assigned_group, assigned_tweets[0], assigned_tweets[1],
            assigned_tweets[2], assigned_tweets[3], 'started')
    with get_connection() as con:
        cur = con.cursor()
        cur.execute("USE survey_db")
        cur.execute(sql, args)
        con.commit()
    for tweet in assigned_tweets:
        change_assigned_tweets(id, tweet)
