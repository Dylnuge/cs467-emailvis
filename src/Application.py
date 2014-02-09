##	@file Application.py
#	@author Joseph Ciurej
#	@date Winter 2014
#
#	Container module for the central application type used for the email
#	server backend.
#
#	@TODO
#	High Priority:
#	- Fill in information for the database once the scheme/authentication
#	  information is finalized.

import tornado.web
import tornado.options
import torndb
import os
import __main__

from tornado.options import options as tornopts
from os.path import realpath as get_realpath
from os.path import dirname as get_path
from os.path import join as join_paths

##	The central application type for the Gasgolo website, which contains all
#	website global information and specifies handlers for client requests.
class Application( tornado.web.Application ):
	### Constructors ###

	##	Constructor for the application, which initializes all the page
	#	handlers and global application settings for the application.
	def __init__( self ):
		project_path = get_path( get_path(get_realpath(__main__.__file__)) )
		asset_path = join_paths( project_path, "assets" )

		page_handlers = [
			( r"/", HomeHandler ),
			( r"/about", AboutHandler ),
		]
		app_settings = {
			# URL Settings #
			"project_path" : project_path,
			"asset_path" : asset_path,
			"static_path" : join_paths( asset_path, "static" ),
			"template_path" : join_paths( asset_path, "template" ),
			# Module/Render Settings #
			"ui_modules" : {
				"ArticleSummary" : ArticleSummaryModule,
				"Author" : AuthorModule,
			},
			# Miscellaneous Settings #
			"debug" : True,
		}
		tornado.web.Application.__init__( self, page_handlers, **app_settings )

		database_settings = {
			"host" : "127.0.0.1:3306",
			"database" : "gasgolo_website",
			"user" : "gasgolo_server",
			"password" : tornopts.db_password,
		}
		self.database = torndb.Connection( **database_settings )

	### Methods ###

	# Note: No methods are needed here because this class acts as a simple
	# extension/wrapper around the base Tornado application type.
