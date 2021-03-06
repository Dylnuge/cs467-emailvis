##	@file Application.py
#	@author Joseph Ciurej
#	@date Winter 2014
#
#	Container module for the central application type used for the email
#	server backend.
#
#	@TODO
#	- Extend the implementation of this file to support more user pages
#	  if needed.

import os
import __main__
import tornado.web
import tornado.options

from tornado.options import options as tornopts
from os.path import realpath as get_realpath
from os.path import dirname as get_path
from os.path import join as join_paths
from PageHandlers import *

##	The central application type for the email visualization backend, which 
#	contains all website global information and specifies handlers for 
#	client requests.
class Application( tornado.web.Application ):
	### Constructors ###

	##	Constructor for the application, which initializes all the page
	#	handlers and global application settings for the application.
	def __init__( self ):
		project_path = get_path( get_path(get_realpath(__main__.__file__)) )
		asset_path = join_paths( project_path, "assets" )

		page_handlers = [
			( r"/", VizHandler ),
		]
		app_settings = {
			# URL Settings #
			"project_path" : project_path,
			"asset_path" : asset_path,
			"static_path" : join_paths( asset_path, "static" ),
			"template_path" : join_paths( asset_path, "template" ),
			# Module/Render Settings #
			"ui_modules" : {
				"SourceAuth" : SourceAuthModule,
			},
			# Miscellaneous Settings #
			"debug" : True,
		}
		tornado.web.Application.__init__( self, page_handlers, **app_settings )

	### Methods ###

	# Note: No methods are needed here because this class acts as a simple
	# extension/wrapper around the base Tornado application type.
