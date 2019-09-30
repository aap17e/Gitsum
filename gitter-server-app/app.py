#!flask/bin/python
from flask import Flask, jsonify
from summaries import *
import sqlite3


app = Flask(__name__)


@app.route('/gitter/api/v1.0/summaries/<room>/<start>/<stop>/<sentences>/<formatted>', methods=['GET'])
def get_Summaries(room=None, start=None, stop=None, sentences=None, formatted=None):
    room = 'gitterHQ/gitter'
    start = datetime.strptime("2018-10-26T14:16:42", '%Y-%m-%dT%H:%M:%S')
    stop = datetime.strptime("2018-10-30T14:16:42", '%Y-%m-%dT%H:%M:%S')
    sentences = 5
    summary_type = 'aylien'
    formatted = False

    s = Summaries(room,start, stop, sentences, formatted)

    if(summary_type == 'aylien'):
        ret = s.aylien()
    elif(summary_type == 'meaning_cloud'):
        ret = s.meaningCloud()
    elif(summary_type == 'sumy'):
        ret = s.sumy()
    else:
        ret = None

    return jsonify({'summaries': ret})

@app.route('/gitter/api/v1.0/conversation/<room>/<start>/<stop>/<sentences>/<sentence_type>/<formatted>', methods=['GET'])
def get_Conversation(room=None, start=None, stop=None, sentences=None, sentence_type=None,formatted=None):
    room = "/".join(room.split("-"))
    start = datetime.strptime(start, '%Y-%m-%d')
    stop = datetime.strptime(stop, '%Y-%m-%d')

    s = Summaries(room, start, stop, int(sentences), sentence_type, int(formatted))

    summary_list = [
    {'summary_type': 'Aylien', 'sentences': s.aylien()},
     #{'summary_type': 'Meaning-Cloud', 'sentences': s.meaningCloud()},
     #{'summary_type': 'Summarize-Bot', 'sentences': s.SummarizeBot()},
     {'summary_type': 'Sumy KL-Sum', 'sentences': s.sumy_kl()},
     {'summary_type': 'Sumy LSA', 'sentences': s.sumy_lsa()},
     {'summary_type': 'Sumy LexRank', 'sentences': s.sumy_lexRank()},
     {'summary_type': 'Sumy Luhn', 'sentences': s.sumy_luhn()},
     {'summary_type': 'Sumy TextRank', 'sentences': s.sumy_textRank()},
     ]

    ret = s.getunformattedConversations()


    # data = {'conversation': ret, 'aylien': aylien, "meaningCloud": meaningCloud, "sumy": sumy}
    return jsonify({'conversation': ret, 'summaries': summary_list})

#
# @app.route('/gitter/api/v1.0/fake', methods=['GET'])
# def get_fake():
#     with open('sample.json') as data_file:
#         data = json.load(data_file)
#
#     return jsonify(data)

@app.route('/gitter/api/v1.0/summary_ranking', methods=['GET'])
def get_summaryRanking():
    connection = sqlite3.connect("summary_rank.db")
    cursor = connection.cursor()
    command = "select * from summary_ranks"
    cursor.execute(command)

    l = []
    for summary in cursor:
        l.append(summary)

    ret = [x[0] for x in sorted(l, key=lambda x: x[1], reverse=True)]

    connection.commit()
    connection.close()
    return jsonify({'data': ret})

@app.route('/gitter/api/v1.0/chosen_summary/<chosen_summary>', methods = ['GET', 'POST', 'DELETE'])
def user(chosen_summary):
    print(chosen_summary);
    connection = sqlite3.connect("summary_rank.db")
    cursor = connection.cursor()
    command = "UPDATE summary_ranks SET won = won + 1 WHERE name = \'" + chosen_summary + "\'"
    cursor.execute(command)
    connection.commit()
    connection.close()

    return jsonify({'x':chosen_summary})

def load_DB() :
    connection = sqlite3.connect("summary_rank.db")
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS summary_ranks (name TEXT, won INT)")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Meaning-Cloud','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Summarize-Bot','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Sumy KL-Sum','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Sumy LSA','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Sumy LexRank','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Sumy Luhn','0')")
    cursor.execute("INSERT INTO summary_ranks VALUES ('Sumy TextRank','0')")
    connection.commit()
    connection.close()


if __name__ == '__main__':
    app.run(debug=True)
