from datetime import datetime
from gitter import *
from static.keys import api_keys as d

from aylienapiclient import textapi
from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

from sumy.summarizers.kl import KLSummarizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.summarizers.sum_basic import SumBasicSummarizer
from sumy.summarizers.text_rank import TextRankSummarizer


import requests
import urllib
import json
import re

class Summaries:
    def __init__(self, room, from_date, to_date, num_sentences, sentence_type, formatted):
        self.gitterObject = Gitter()
        self.setSummary(room, from_date, to_date, num_sentences, sentence_type, formatted)

    def getConversation(self):
        return self.gitterObject.unformatMessages(self.room, self.from_date, self.to_date, self.formatted)

    def getunformattedConversations(self):
         return self.messages

    def setSummary(self, room, from_date, to_date, num_sentences, sentence_type, formatted):
        self.room = room
        self.from_date = from_date
        self.to_date = to_date
        self.formatted = formatted
        messages = self.getConversation()
        self.messages = messages["messages"]
        self.conversation =  messages["formatted_messages"]
        self.num_sentences = self.getNumberofSentences(num_sentences, sentence_type)

    def getNumberofSentences(self, num_sentences, sentence_type):
        if(sentence_type == 'number'):
            return num_sentences
        else:
            return int(len(self.conversation) * (num_sentences/100))


    def changeToDate(self, to_date):
        self.to_date = to_date

    def changeRoom(self, room):
        self.room = room

    def changeNumSentences(self, num):
        self.num_sentences = num

    def aylien(self):
        client = textapi.Client("7e479b2e", d["aylien"]["key"])
        summary = client.Summarize({'title': "", 'text': ". ".join(self.conversation) , 'sentences_number': self.num_sentences})
        return summary["sentences"]

    def meaningCloud(self):
        key, url, headers = d["meaning_cloud"].values()
        payload = "key=" + key + "&txt=" + urllib.parse.quote_plus(". ".join(self.conversation)) + "&sentences=" + str(self.num_sentences)
        response = requests.request("POST", url, data=payload, headers=headers)
        return [json.loads(response.text)["summary"]]

    def sumy_kl(self):
        return self.sumy(KLSummarizer)

    def sumy_lsa(self):
        return self.sumy(LsaSummarizer)

    def sumy_lexRank(self):
        return self.sumy(LexRankSummarizer)

    def sumy_luhn(self):
        return self.sumy(LuhnSummarizer)

    def sumy_textRank(self):
        return self.sumy(TextRankSummarizer)

    """
    SumBasic: a frequency-based summarization system that adjusts word frequencies as
    sentences are extracted.
    Source: http://www.cis.upenn.edu/~nenkova/papers/ipm.pdf
    """
    def sumy_sumBasic(self):
        return self.sumy(SumBasicSummarizer)

    def sumy(self, Summarizer):
        in_file, language = d["sumy"].values()
        sentences_count = self.num_sentences

        f = open(in_file, "w")
        for sentence in self.conversation:
            f.write(sentence)
            f.write("\n")
        f.close()

        parser = PlaintextParser.from_file(in_file, Tokenizer(language))
        # print(parser.document)
        stemmer = Stemmer(language)
        summarizer = Summarizer(stemmer)
        summarizer.stop_words = get_stop_words(language)

        return [" ".join(str(x).split(".")) for x in summarizer(parser.document,sentences_count)]


    def SummarizeBot(self):
        key, url, headers = d["summarize_bot"].values()
        text_for_processing = "".join(self.conversation)
        post_body = bytes(text_for_processing.encode('utf-8'))

        api_url = url + "apiKey=" + key + "&size=" + str(self.num_sentences) + "&keywords=10&fragments=15"

        print(api_url)

        r = requests.post(api_url, headers = headers, data = post_body)
        json_res = r.json()


        return [x["sentence"] for x in json_res[0]["summary"]]


#
if __name__ == '__main__':
    start = datetime.strptime("2018-9-20", '%Y-%m-%d')
    stop = datetime.strptime("2018-9-27", '%Y-%m-%d')
    s = Summaries("gitterHQ/gitter", start, stop,5,False)
    summary = s.sumy_textRank()
    #print(summary)
    for x in summary:
        print(x)

    #
    # def summarizeBot(self):
    #     api_url = "https://www.summarizebot.com/api/summarize?apiKey=YOUR_API_KEY&size=20&keywords=10&fragments=15&url=URL_FOR_PROCESSING"
    #     r = requests.get(api_url)
    #     json_res = r.json()
    #     print json_res
