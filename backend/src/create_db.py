import os
import pandas as pd
import db_utils as db

os.chdir(os.path.dirname(os.path.realpath(__file__)))
DATA_PATH = '../data/tweets/'


def define_bias(bias_val):
    if bias_val == -1:
        return 'L'
    elif bias_val == 0:
        return 'C'
    elif bias_val == 1:
        return 'R'
    else:
        return 'U'


def populate_tweets(tt_file_path):
    tweets = pd.read_parquet(tt_file_path)
    tweets = tweets.sample(frac=1).reset_index(drop=True)
    for idx, row in tweets.iterrows():
        tweet_id = define_bias(row['tweet_bias'])+str(idx).zfill(3)
        db.add_tweet(tweet_id, row['tweet'], row['tweet_bias'])


def main():
    db.create_database()
    populate_tweets(os.path.join(DATA_PATH+'annotated_tweets.parquet'))


if __name__ == '__main__':
    main()
