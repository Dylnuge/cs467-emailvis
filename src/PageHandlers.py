##	@file PageHandlers.py
#	@author Joseph Ciurej
#	@date Winter 2014
#
#	Cotainer module for all classes related to handling web page requests
#	from clients (see https://github.com/facebook/tornado/blob/master/demos).
#
#	@TODO
#	- Write the implementation of all the web handlers here!

import os
import tornado.web

from os.path import join as join_paths
from os.path import exists as file_exists
from DataPullFunctions import *
from MessageArchive import *

### Helper Classes ###

##	An abstract base class for types that correspond to particular web
#	resources (typically HTML pages) on the file system.
class WebResource():
	##	@return The full URL path of the resource corresponding to the
	#	type relative to the 'template_path' base path.
	def get_url( self ):
		return self.resource_url

	##	@return The string that indicates the URL of the base resource
	#	relative to its containing directory (e.g. for '~/html/a.html', 
	#	pageURL is 'a.html').
	@property
	def resource_url( self ):
		return ".error.html"


### Page Handlers ###

##	Page handler for the "/" (home) email visaulzation web page.  This page 
#	displays the submission form first (GET), then displays the visualization 
#	after the form is submitted (POST).
class VizHandler( tornado.web.RequestHandler ):
	##	Displays the credential submission form.
	#
	#	@override
	def get( self ):
		self.render( "html/home.html", sources=self.source_directory.keys() )

	##	Displays the visualization given the user credentials.
	#
	#	@override
	def post( self ):
		aggregate_archive = MessageArchive()

		for source, pull_fxn in self.source_directory.iteritems():
			source_user_name = self.get_argument( source + "_user" )
			source_password = self.get_argument( source + "_pass" )

			# Only consider the archive if it the form was filled out by the user.
			if source_user_name and source_password:
				source_archive = pull_fxn( source_user_name, source_password )
				aggregate_archive += source_archive

		self.render( "html/viz.html", archive=aggregate_archive,
			medium_color=self.source_colors )

	##	@return A dictionary containing all message sources for the visualization
	#	as keys and the function used to pull the data from that source as the
	#	associated value.
	@property
	def source_directory( self ):
		return { "Gmail" : pull_gmail_data, "Gchat" : pull_gchat_data }

	##	@return A dictionary containing all message sources for the visualization
	#	as keys and the color associated with the source as the associated value.
	#	TODO: This is a bit of a hack that should be fixed/integrated w/ directory.
	@property
	def source_colors( self ):
		return  { "Gmail" : "#F22E39", "Gchat" : "#3FFF7C",
			"Facebook" : "#3CCCB8", "LinkedIn" : "#FFFC3D" }

### UI Modules ###

##	The base page HTML module type from which all module types for the email
#	visualization backend web application extend.
class PageModule( tornado.web.UIModule, WebResource ):
	##	@override
	def get_url( self ):
		return join_paths( "html", "modules", self.resource_url )


##	Rendering module for the authentication widgets for visualization data
#	sources.
class SourceAuthModule( PageModule ):
	##	@override
	def render( self, source ):
		return self.render_string( self.get_url(), source=source )

	##	@override
	@WebResource.resource_url.getter
	def resource_url( self ):
		return "source_auth.html"
