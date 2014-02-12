##	@file DataPullFunctions.py
#	@author Joseph Ciurej
#	@date 09/02/2014
#
#	Module File containing Message Data Pulling Functions from Websites

import requests
import json

import imaplib
import email
import datetime
from dateutil.parser import parse

from MessageArchive import *

### Constants for API Endpoints ###
FACEBOOK_API = "https://graph.facebook.com/"
FACEBOOK_TAG = "Facebook"

### Data Pulling Functions ###

##	Returns a 'MessageArchive' object containing all the Facebook messages
#	sent from and received by the given user.
#
#	@param user_id The FBID of the user whose message data will be retrieved.
#	@param api_token Facebook API token with read_mailbox permission.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_facebook_data( user_id, api_token ):
	messages = []
	
	# Step 1: Get the inbox data from Facebook
	endpoint = FACEBOOK_API + user_id + "/inbox" + "?access_token=" + api_token
	mailbox = requests.get(endpoint)
	mailbox = json.loads(mailbox.text)

	# Step 2: Process the inbox data and turn it into a MessageArchive
	messages = _strip_fb_inbox(mailbox, user_id)
	return MessageArchive( messages )

def _strip_fb_inbox(mailbox, user_id):
	messages = []
	# Check that we got data
	if 'data' not in mailbox.keys():
		# Secondary recursive base case; empty data set
		return messages

	# Step 1: Process this page of data
	mailbox_data = mailbox['data']
	for entry in mailbox_data:
		author = ""
		# XXX(dylnuge) ignore group chats for now. Getting the author is very
		# much a hack, because things are complicated.
		if len(entry['to']['data']) > 2:
			continue
		for user in entry['to']['data']:
			if user['id'] != user_id:
				author = user['name']

		messages.extend(_strip_fb_messages(entry['comments'], author))

	# Step 2: Recursively process remaining pages of data
	if 'paging' in mailbox.keys():
		next_page = requests.get(mailbox['paging']['next'])
		next_page = json.loads(next_page.text)
		messages.extend(_strip_fb_inbox(next_page, user_id))


##	Strips FB message data dfrom a single conversation and returns a list of all
#	messages contained within it.
#
#	@param comments The FB message thread to strip from.
#	@param author The FB message author to record
def _strip_fb_messages(comments, author):
	# First strip the messages we have here
	messages = []
	if 'data' not in comments.keys():
		# Secondary recursive base case; empty data set
		return messages

	for message_elem in comments['data']:
		# Some messages are photos and things, ignore them
		if 'message' not in message_elem.keys():
			continue
		message = Message(author, FACEBOOK_TAG, message_elem['message'],
				parse(message_elem['created_time']))
		messages.append(message)

	# Second if there exists a next page recursively add it
	if 'paging' in comments.keys():
		next_comments = requests.get(comments['paging']['next'])
		# TODO(dylnuge): Should check for 400/404/500 here
		next_comments = json.loads(next_comments.text)
		messages.extend(_strip_fb_messages(next_comments, author))

	return messages

##	Returns a 'MessageArchive' object containing all the Gmail messages
#	sent from and received by the given user.
#
#	@param user_name The name of the user whose message data will be retrieved.
#	@param password The credentials of the user whose message data will be retrieved.
#	@return A 'MessageArchive' containing all the message data for the user.
def pull_gmail_data( user_name, password ):
	medium = "Gmail"
	messages = []

	messages.append( Message( "Jim", medium, "Heyaaaaaaaaa", datetime(2010,9,1) ) )
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

	messages.append( Message( "Josh", medium, "Hey", datetime(2008,9,1) ) )
	messages.append( Message( "Jim", medium, "Heyaaaa", datetime(2010,9,1) ) )
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
