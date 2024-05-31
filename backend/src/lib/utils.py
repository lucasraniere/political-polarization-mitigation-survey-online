import numpy as np

def select_group(h_count, m_count, p_count):
    groups = ['human', 'machine', 'placebo']
    counts = [h_count, m_count, p_count]
    min_count = min(counts)
    eligible_groups = [group for group, count in zip(groups, counts) if count == min_count]
    return np.random.choice(eligible_groups)


def select_tweets(tweets):
    left_tt = [tweet for tweet in tweets if tweet.startswith('L')]
    right_tt = [tweet for tweet in tweets if tweet.startswith('R')]
    left_samples = np.random.choice(left_tt, 2, replace=False)
    right_samples = np.random.choice(right_tt, 2, replace=False)
    assigned_tweets = np.concatenate((left_samples, right_samples))
    np.random.shuffle(assigned_tweets)
    return assigned_tweets
