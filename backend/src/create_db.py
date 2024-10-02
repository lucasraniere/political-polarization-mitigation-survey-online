import os
import pandas as pd
import lib.db_utils as db

os.chdir(os.path.dirname(os.path.realpath(__file__)))
DATA_PATH_TWEETS = '../data/tweets/tweets.parquet'
DATA_PATH_PARAPH = '../data/tweets/tweets_paraph.parquet'


def populate_tweets():
    tweets = pd.read_parquet(DATA_PATH_TWEETS)
    for _, row in tweets.iterrows():
        db.add_tweet(row['tweet_id'], row['tweet_text'], row['tweet_bias'], row['group'])


def populate_rephrased_tweets():
    rephrased_tweets = pd.read_parquet(DATA_PATH_PARAPH)
    for _, row in rephrased_tweets.iterrows():
        db.add_rephrased_tweet(row['rephrased_id'], row['tweet_id'], row['rephrased_text'], row['group'])


def main():
    db.create_database()
    populate_tweets()
    populate_rephrased_tweets()


if __name__ == '__main__':
    main()
