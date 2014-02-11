##	@file MessageArchive.py
#	@author Joseph Ciurej
#	@date 09/02/2014
#
#	Source File for the "MessageArchive" Type
#
#	@TODO
#	- Implement the formality computation for the 'Message' class based on
#	  the message contents.

import json
from datetime import datetime

### Module Classes ###

##	A class representation of a single message sent between two users over a
#	particular communication medium.
class Message():
	### Constructors ###

	##	Instantiates a message with the given correspondent, medium of
	#	communication, contents, and send date.
	#
	#	@param correspondent The person that with which the user corresponded.
	#	@param medium The medium over which the message was sent.
	#	@param contents The full contents of the message between the users.
	#	@param send_date The date (in 'datetime' format) at which the message
	#	was sent.
	def __init__( self, correspondent, medium, contents, send_date ):
		self.correspondent = correspondent
		self.medium = medium
		self.contents = contents
		self.send_date = send_date

	### Methods ###

	##	Returns a string representing the send date of the message of the
	#	form "month-year" (with no integer value padding).
	#
	#	@return A string of the form "month-year" corresponding to the send
	#	date of the message.
	def get_date_string( self ):
		month = str(int( self.send_date.strftime( "%m" ) ))
		year = str(int( self.send_date.strftime( "%Y" ) ))

		return month + "-" + year

	##	Returns the volume of the instance message measured in terms of the
	#	total number of characters contained within the message.
	#
	#	@return The volume of the message as an integer value.
	def get_volume( self ):
		return len( self.contents )

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

	##	Creates an archive containing all the given messages.
	#
	#	@param message_list An array of messages associated with the given source
	#	to be stored in the archive.
	def __init__( self, message_list=[] ):
		self.message_list = message_list

	### Overloaded Operators ###

	##	Addition operation for two archives, which combines the message listings
	#	for the two individual archives into a aggregate archive.
	#
	#	@param other The archive with which the instance achive will be
	#	aggregated.
	#	@return An aggregate archive containing the contents of the two operand
	#	archives.
	def __add__( self, other ):
		return MessageArchive( self.message_list + other.message_list )

	### Methods ###

	##	@return A list of all correspondents for the messages contained within 
	#	the archive.
	def get_correspondents( self ):
		correspondents = map( lambda msg: msg.correspondent, self.message_list )

		return list(set( correspondents ))

	##	@return A list of all the mediums over which messages contained within
	#	the archive are sent.
	def get_mediums( self ):
		mediums = map( lambda msg: msg.medium, self.message_list )

		return list(set( mediums ))

	##	@return A dictionary of all the messages contained within the archive
	#	associated by sent month (key for month is of the form "1-2014").
	def get_messages_by_month( self ):
		month_map = {}

		for message in self.message_list:
			month = message.get_date_string()
			if not month in month_map:
				month_map[ month ] = {}
			people_map = month_map[ month ]

			person = message.correspondent
			if not person in people_map:
				people_map[ person ] = {}
			medium_map = people_map[ person ]

			medium = message.medium
			if not medium in medium_map:
				medium_map[ medium ] = { "count": 0, "volume": 0, "formality": 0.0 }

			# After the medium has been found for the proper person and month,
			# associate the message data with this month.
			medium_map[ medium ][ "count" ] += 1
			medium_map[ medium ][ "volume" ] += message.get_volume()
			medium_map[ medium ][ "formality" ] += message.get_formality_level()

		return month_map

	##	@return The first email contained in the instance archive chronologically.
	def get_earliest_email( self ):
		return min( self.message_list, key=lambda msg: msg.send_date )

	##	@return The last email contained in the instance archive chronologically.
	def get_latest_email( self ):
		return max( self.message_list, key=lambda msg: msg.send_date )

	##	@return The age of the message archive in a number of months.
	def get_age_in_months( self ):
		start = self.get_earliest_email().send_date
		end = self.get_latest_email().send_date

		return 12*(end.year - start.year) + 1*(end.month - start.month) + 1
