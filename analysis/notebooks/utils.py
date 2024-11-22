def get_text_type(txt_id):
    if len(txt_id)==5 and txt_id.startswith(('H', 'M', 'P')):
        return 'treated'
    elif len(txt_id)==4 and txt_id.startswith(('L', 'R')):
        return 'original'
    else:
        return 'unknown'


def is_polar(likert_v):
    likert_v = int(likert_v)
    if likert_v in (1, 2):
        return 0
    elif likert_v in (4, 5):
        return 1
    else:
        return -1


def get_polar_info(row):
    text_1 = get_text_type(row['Text1'])
    text_2 = get_text_type(row['Text2'])
    treated_polar = 'x'
    treated_likert = 'x'
    original_polar = 'x'
    original_likert = 'x'
    if text_1 == 'treated':
        treated_polar = is_polar(row['AnswerQ1'])
        treated_likert = int(row['AnswerQ1'])
    elif text_1 == 'original':
        original_polar = is_polar(row['AnswerQ1'])
        original_likert = int(row['AnswerQ1'])
    if text_2 == 'treated':
        treated_polar = is_polar(row['AnswerQ2'])
        treated_likert = int(row['AnswerQ2'])
    elif text_2 == 'original':
        original_polar = is_polar(row['AnswerQ2'])
        original_likert = int(row['AnswerQ2'])
    return treated_polar, treated_likert, original_polar, original_likert


def is_treated_less_polar(row):
    text_1 = get_text_type(row['Text1'])
    text_2 = get_text_type(row['Text2'])

    if text_1 == 'treated':
        return 1 if int(row['AnswerQ4']) == 2 else 0
    elif text_2 == 'treated':
        return 1 if int(row['AnswerQ4']) == 1 else 0
    else:
        return -1


def get_tt_bias(id):
    if len(id) == 4:
        return id[0]
    elif len(id) == 5:
        return id[1]
    else:
        return 'X'


def get_treat_diff(row):
    text_1 = get_text_type(row['Text1'])
    text_2 = get_text_type(row['Text2'])

    if text_1 == 'treated' and text_2 == 'original':
        return int(row['AnswerQ1']) - int(row['AnswerQ2'])
    elif text_1 == 'original' and text_2 == 'treated':
        return int(row['AnswerQ2']) - int(row['AnswerQ1'])
    else:
        return 999

def proc_participant_leaning(participant_leaning):
    leanings = {
        1: 'far-left',
        2: 'left',
        3:'center-left',
        4:'center',
        5:'center-right',
        6:'right',
        7:'far-right',
        8: 'not informed'
    }
    return leanings[participant_leaning]


def proc_tweet_bias(tweet_bias):
    if tweet_bias == 'L':
        return 'Left'
    elif tweet_bias == 'R':
        return 'Right'
    else:
        return 'Unknown'
