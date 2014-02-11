##	@file DataPullFunctions.py
#	@author Joseph Ciurej
#	@date 09/02/2014
#
#	Module File containing Message Data Pulling Functions from Websites
#
#	@TODO
#	- Write the implementations for all the data pulling functions in
#	  this module.

import imaplib
import email
import datetime
from MessageArchive import *

### Data Pulling Functions ###

##	Returns a 'MessageArchive' object containing all the Facebook messages
#	sent from and received by the given user.
#
#	@param user_name The name of the user whose message data will be retrieved.
#	@param password The credentials of the user whose message data will be retrieved.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_facebook_data( user_name, password ):
	medium = "Facebook"
	messages = []

	return MessageArchive( messages )


##	Returns a 'MessageArchive' object containing all the Gmail messages
#	sent from and received by the given user.
#
#	@param user_name The name of the user whose message data will be retrieved.
#	@param password The credentials of the user whose message data will be retrieved.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_gmail_data( user_name, password ):
	medium = "Gmail"
	messages = []

	messages.append( Message( "Jim", medium, "Hey", datetime(2010,10,1) ) )
	return MessageArchive( messages )


##	Returns a 'MessageArchive' object containing all the Gchat messages
#	sent from and received by the given user.
#
#	@param user_name The name of the user whose message data will be retrieved.
#	@param password The credentials of the user whose message data will be retrieved.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_gchat_data( user_name, password ):
	medium = "Gchat"
	messages = []

	messages.append( Message( "Josh", medium, "Hey", datetime(2010,9,1) ) )
	return MessageArchive( messages )


##	Returns a 'MessageArchive' object containing all the LinkedIn messages
#	sent from and received by the given user.
#
#	@param user_name The name of the user whose message data will be retrieved.
#	@param password The credentials of the user whose message data will be retrieved.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_linkedin_data( user_name, password ):
	medium = "LinkedIn"
	messages = []

	return MessageArchive( messages )
