
import requests, json
import urllib.parse
import re
from time import sleep
from datetime import datetime


class Gitter(object):
    rest_api_url = "https://api.gitter.im/v1/"
    stream_api_url = "https://stream.gitter.im/v1/"

    def __init__(self):
        self.api_token = "a6372a5caf8dd9a6daf85e04f0be87cb9db78a65"
        # Same headers are used for all requests:
        self.headers = {
            "Content-Type" : "application/json; charset=utf-8",
            "Accept" : "application/json",
            "Authorization" : "Bearer {}".format(self.api_token)
        }
        user_info = self.getUser()
        self.user_id = user_info[0].get("id")
        if not self.user_id:
            raise ValueError("could not connect to Gitter with given auth token")

    def getUser(self):
        return self._get("user")

    def getRooms(self):
        return self._get("user/{}/rooms".format(self.user_id))

    def getChannels(self):
        return self._get("user/{}/rooms".format(self.user_id))

    def getRepos(self):
        return self._get("user/{}/repos".format(self.user_id))

    def joinRoom(self, room_name):
        return self._post("rooms", uri=room_name)

    def leaveRoom(self, room_name):
        room_id = self.roomIdFromName(room_name)
        uri = "rooms/{}/users/{}".format(room_id, self.user_id)
        return self._delete(uri)

    def sendMessage(self, room_name, message):
        room_id = self.roomIdFromName(room_name)
        return self._post("rooms/{}/chatMessages".format(room_id), text=message)

    def roomStream(self, room_name):
        room_id = self.roomIdFromName(room_name)
        return self._stream("rooms/{}/chatMessages".format(room_id))

    def roomIdFromName(self, room_name):
        room = self._post("rooms", uri=room_name)
        if("error" in room):
            return -1
        return room["id"]

    def listMessagesCursor(self, room_name, sleep_time=1.0):
        def iter_check(d):
          if not d:
            raise StopIteration()
          return d[0].get("id")


        room_id = self.roomIdFromName(room_name)

        if(room_id == -1):
            return 0;

        # yield first batch of <= 100 message objects
        url_f = "rooms/{0}/chatMessages?limit=100"
        data = self._get(url_f.format(room_id))

        before_id = iter_check(data)
        for message in reversed(data):
          yield message

        # yield consecutive batches
        url_f = "rooms/{0}/chatMessages?limit=100&beforeId={1}"
        while True:
          #sleep(sleep_time)
          data = self._get(url_f.format(room_id, before_id))
          if "error" in data:
              sleep(2)
              continue
          before_id = iter_check(data)
          for message in reversed(data):
            yield message

        raise StopIteration()

    def _stream(self, path):
        """ Makes a GET request to the given path, returning the response
            if successful and None otherwise.
        """
        if path[0] == "/":
          path = path[1:]
        url = urllib.parse.urljoin(self.stream_api_url, path)
        return requests.get(url, headers=self.headers, stream=True)


    def _get(self, path):
        if path[0] == "/":
          path = path[1:]
        url = urllib.parse.urljoin(self.rest_api_url, path)
        r = requests.get(url, headers=self.headers)

        try:
          response = json.loads(r.content)
        except ValueError:
          return None
        return response

    def _post(self, path, **json_data):
        """ Makes a POST request to the given path with the given data,
            returning the response if successful and None otherwise.
        """
        if path[0] == "/":
          path = path[1:]
        url = urllib.parse.urljoin(self.rest_api_url, path)
        r = requests.post(url, headers=self.headers, json=json_data)
        try:
          response = json.loads(r.content)
        except ValueError:
          return None
        return response

    def _delete(self, path):
        """ Makes a DELETE request to the given path, returning the
            response if successful and None otherwise.
        """
        if path[0] == "/":
          path = path[1:]
        url = urllib.parse.urljoin(self.rest_api_url, path)
        r = requests.delete(url, headers=self.headers)
        try:
          response = json.loads(r.content)
        except ValueError:
          return None
        return response

    def getMessages(self, message, formatted):
        if(formatted):
            user = message["fromUser"]["username"]
            t = message["sent"]
            text = re.sub("\```.*\```", " **Ommitted Code** ", message["text"], flags=re.DOTALL)
            ret = re.split('[?.!]',text) #need to keep stop
            # ret = [ user+"~~"+str(t)+"~~"+x+".\n" for x in ret if x != '']
            for i in range(len(ret)):
                if(ret[i][0:6] == ":point"):
                    x = ret[i].split("@")
                    if(len(x) > 1):
                        ret[i] = s[1]

            ret = [ x+".\n" for x in ret if x != '']
            return ret

        return [message["text"] + "\n"]

    def unformatMessages(self,room_name,from_time, to_time, formatted):
        messages = []
        formatted_messages = []

        for message in self.listMessagesCursor(room_name):
            print(message["sent"])
            message["sent"] = message["sent"].split(".")[0]
            message["sent"] = datetime.strptime(message["sent"], '%Y-%m-%dT%H:%M:%S')

            if(message["sent"] < from_time):
                break

            if(message["sent"].date() >= from_time.date() and message["sent"].date() <= to_time.date()):
                messages.append(message)
                m = self.getMessages(message, formatted)
                formatted_messages.extend(m)

        return {"messages": messages[::-1], "formatted_messages": formatted_messages[::-1]}

    def formatMessages(self,room_name,from_time, to_time, formatted):
        messages = []
        for message in self.listMessagesCursor(room_name):
            message["sent"] = message["sent"].split(".")[0]
            message["sent"] = datetime.strptime(message["sent"], '%Y-%m-%dT%H:%M:%S')
            if(message["sent"] > to_time):
                continue
            if(message["sent"] < from_time):
                break

            m = self.getMessages(message, formatted)
            messages.extend(m)

        return messages[::-1]
