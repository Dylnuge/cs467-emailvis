##	@file main.py
#	@author Joseph Ciurej
#	@date Winter 2014
#
#	Main Script for the Email Visualization Server
#
#	@TODO
#	- Write the implementation in this file!

import tornado.httpserver
import tornado.options
import tornado.ioloop
import tornado.web
import tornado.escape
from datetime import date

### Server Backend Classes ###

class VersionHandler(tornado.web.RequestHandler):
    def get(self):
        response = { 'version': '3.5.1',
                     'last_build':  date.today().isoformat() }
        self.write(response)

class GetGameByIdHandler(tornado.web.RequestHandler):
    def get(self, id):
        response = { 'id': int(id),
                     'name': 'Crazy Game',
                     'release_date': date.today().isoformat() }
        self.write(response)

### Primary Entry Point ###

##	The primary entry point function for the email visualization
#	backend, which instantiates the backend to listen for API
#	requests.
def main():
	application = tornado.web.Application( [
		(r"/getgamebyid/([0-9]+)", GetGameByIdHandler),
		(r"/version", VersionHandler)
	] )

	application.listen(8888)
	tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
	main()
