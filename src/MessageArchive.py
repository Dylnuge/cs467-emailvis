##	@file MessageArchive.py
#	@author Joseph Ciurej
#	@date 09/02/2014
#
#	Source File for the "MessageArchive" Type
#
#	@TODO
#	- Fill in the implementation of this file!

import json
from datetime import datetime

##	A class representation of a single message sent between two users over a
#	communication medium.
class Message():
	### Constructors ###

	##	Instantiates a message with the given correspondents, contents, and
	#	send date.
	#
	#	@param sender The person that sent the message.
	#	@param receiver The person that receieved the message.
	#	@param contents The full contents of the message between the users.
	#	@param send_date The date (in 'datetime' format) at which the message
	#	was sent.
	def __init__( self, sender, receiver, contents, send_date ):
		self.sender = sender
		self.receiver = receiver
		self.contents = contents

		self.send_date = send_date

	### Methods ###

	##	Returns a summary of the message as a dictionary object.
	#
	#	@return A dictionary object representing the contents of the instance message.
	def to_dict( self ):
		message_dict = {
			"sender" : self.sender,
			"receiver" : self.receiver,
			"contents" : self.contents,
			"send_date" : self.send_date.strftime( "%w-%d-%Y" ),
			"formality" : self.get_formality_level(),
		}

		return message_dict

	##	Determines the level of formality of the message and returns it as a
	#	percentage value.
	#
	#	@return The level of formality of the message as a percentage value.
	def get_formality_level( self ):
		# TODO: Calculate the formality.
		return 1.0


##	A container type for an archive of messages sent from and received by
#	a particular person.  This type acts as a container for a listing of
#	'Message' instances.
class MessageArchive():
	### Constructors ###

	##	Creates an archive containing all the given messages for associated
	#	with a given source.
	#
	#	@param source The name of the single source for the message archive.
	#	@param messages An array of messages associated with the given source
	#	to be stored in the archive.
	def __init__( self, source="", messages=[] ):
		self.sources = [ source ] if source else []
		self.messages = messages

		self.correspondents = []
		# TODO: Create the month dictionary.
		self.months = {}

		self.start_time = datetime.max
		self.end_time = datetime.min

	### Methods ###

	##	Combines the contents of the instance message archive with the contents
	#	of the given archive, aggregating the result in the instance archive.
	#
	#	@param other The message archive with which the instance will be
	#	combined.
	def combine_with( self, other ):
		self.sources = list(set(self.sources + other.sources))
		self.messages = self.messages + other.messages

		self.correspondents = list(set(self.correspondents + other.correspondents))
		# TODO: Combine months information dictionary.
		self.months = self.months

		self.start_time = self.start_time if self.start_time < other.start_time else other.start_time
		self.end_time = self.end_time if self.end_time > other.end_time else other.end_time
