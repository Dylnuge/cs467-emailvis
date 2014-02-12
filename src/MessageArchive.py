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

### Module Functions ###

##	Given a time delta value, this function computes the number of months
#	in the delta as an integer.
#
#	@param delta The time delta for which the number of months will be calculated.
#	@return The total number of months covered by the time delta as an integer.
def get_month_count( delta ):
	day_count = abs( delta.days )
	return int( day_count / 30 )

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

	##	@return A list of dictionaries (of length equal to the age of the archive
	#	in months) where each dictionary contains the names of correspondents as
	#	keys and the corresponding mediums as values.
	def get_messages_by_month( self ):
		month_listing = [ {} for num in range(self.get_age_in_months()) ]
		start_date = self.get_earliest_message().send_date

		# Note: Increases running time on the back end to make things easier on
		# the front end.
		for month in month_listing:
			for correspondent in self.get_correspondents():
				month[ correspondent ] = {}

				for medium in self.get_mediums():
					month[ correspondent ][ medium ] = { "count": 0, "volume": 0, "formality": 0.0 }

		for message in self.message_list:
			month_idx = get_month_count( message.send_date - start_date )
			month_directory = month_listing[ month_idx ]
			medium_map = month_directory[ message.correspondent ]

			# After the medium has been found for the proper person and month,
			# associate the message data with this month.
			medium_map[ message.medium ][ "count" ] += 1
			medium_map[ message.medium ][ "volume" ] += message.get_volume()
			medium_map[ message.medium ][ "formality" ] += message.get_formality_level()

		# Note: Normalize values before they reach the front end.
		for month in month_listing:
			for correspondent in self.get_correspondents():
				for medium in self.get_mediums():
					medium_count = month[ correspondent ][ medium ][ "count" ]
					medium_count = medium_count if medium_count != 0 else 1

					month[ correspondent ][ medium ][ "formality" ] /= medium_count

		return month_listing

	##	@return The first message contained in the instance archive chronologically.
	def get_earliest_message( self ):
		return min( self.message_list, key=lambda msg: msg.send_date )

	##	@return The last message contained in the instance archive chronologically.
	def get_latest_message( self ):
		return max( self.message_list, key=lambda msg: msg.send_date )

	##	@return The age of the message archive in a number of months.
	def get_age_in_months( self ):
		start_date = self.get_earliest_message().send_date
		end_date = self.get_latest_message().send_date

		return get_month_count( end_date - start_date ) + 1
