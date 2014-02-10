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

##	The base page request handling type from which all page handlers for
#	the email backend application extend.
class PageHandler( tornado.web.RequestHandler, WebResource ):
	##	@override
	def get_url( self ):
		return join_paths( "html", self.resource_url )

	##	@return The string representing the title of the page being serviced
	#	by the instance handler.
	@property
	def title( self ):
		return "Official Website"

	##	@return A reference to the database containing information associated
	#	with the website.
	@property
	def database( self ):
		return self.application.database


##	Page handler for the "/" (home) web page.
class HomeHandler( PageHandler ):
	##	@override
	def get( self ):
		self.render( self.get_url() )

	##	@override
	@WebResource.resource_url.getter
	def resource_url( self ):
		return "home.html"


##	Page handler for the "/viz" web page, which contains all the primary
#	email visualization.
class VizHandler( PageHandler ):
	##	@override
	def get( self ):
		self.render( self.get_url() )

	##	@override
	@WebResource.resource_url.getter
	def resource_url( self ):
		return "viz.html"


### UI Modules ###

##	The base page HTML module type from which all module types for the email
#	visualization backend web application extend.
class PageModule( tornado.web.UIModule, WebResource ):
	##	@override
	def get_url( self ):
		return join_paths( "html", "modules", self.resource_url )


##	Rendering module for the description widgets of authors.
class AuthorModule( PageModule ):
	##	@override
	def render( self, author ):
		summary = {
			"name" : author.name,
			"email" : author.email,
			"role" : author.role,
			"description" : author.description_html,
		}

		return self.render_string( self.get_url(), author=summary )

	##	@override
	@WebResource.resource_url.getter
	def resource_url( self ):
		return "author.html"
