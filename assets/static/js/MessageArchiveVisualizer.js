/**
 * @file MessageArchiveVisualizer.js
 * @author Joseph Ciurej
 * @date Winter 2014
 *
 * Source File for the "MessageArchiveVisualizer" Type
 *
 * @TODO
 * - The visualizer currently displays all data given for the earliest month
 *   by default.  Change this behavior to be more general if need be.
 */

/**
 * The base type for the message archive visualization, which generates a 
 * visualization of given message data.
 */
var MessageArchiveVisualizer = Class.extend({
	/// Constructors ///
	
	/**
	 * Creates a message visualization that draws the given data onto the given
	 * canvas (specified by identifier).
	 *
	 * @param _canvasID The unique identifier for the SVG element on the page
	 *  on which the visualizer will draw.
	 * @param _msgData The message data provided by the visualization backend.
	 * @param _msgPeople A listing of all the people referenced in the message data.
	 * @param _msgMediums A listing of all the mediums referenced in the message data.
	 */
	construct : function( _canvasID, _msgData, _msgPeople, _msgMediums )
	{
		this.mCanvasID = _canvasID;
		this.mCanvas = d3.select( "#" + this.mCanvasID );
		this.mMessageData = _msgData;
		this.mDisplayIdx = 0;

		this.mfInitCanvas();
		this.mfPopulateCanvas( _msgPeople, _msgMediums );
	},

	/// Functions ///
	
	/**
	 * Configures the visualizer to display the segment within its data set
	 * identified by the given index.
	 *
	 * @param _dataIdx The zero-based index of the segment within the total
	 *  data set that will be displayed by the visualizer.
	 */
	display : function( _dataIdx )
	{
		
	},

	/// Helper Functions ///

	/**
	 * Initializes the canvas, setting up the proper backdrops and aethetic
	 * elements.
	 */
	mfInitCanvas : function()
	{
		this.mCanvas.append( "rect" )
			.attr( "x", 0 ).attr( "y", 0 )
			.attr( "width", this.mfGetCanvasW() ).attr( "height", this.mfGetCanvasH() )
			.attr( "fill", "white" );

		// TODO: Scale the circle and make it a distinct color.
		var userData = this.mCanvas.append( "circle" )
			.attr( "cx", this.mfGetCanvasW() / 2.0 )
			.attr( "cy", this.mfGetCanvasH() / 2.0 )
			.attr( "r", 20 )
			.attr( "fill", "black" );
	},

	/**
	 * Populates the canvas with all the data elements for the correspondents and
	 * mediums in the visualization.
	 *
	 * @param _msgPeople A listing of all the people referenced in the message
	 *  data set for the visualizer.
	 * @param _msgMediums A listing of all the mediums referenced in the message
	 *  data set for the visualizer.
	 */
	mfPopulateCanvas : function( _msgPeople, _msgMediums )
	{
		var personGroups = this.mCanvas.selectAll( "g people" )
			.data( _msgPeople ).enter().append( "g" )
			.attr( "id", this.mfGetPersonDataID );

		personGroups.selectAll( "g mediums" )
			.data( _msgMediums ).enter().append( "circle" )
			.attr( "class", this.mfGetMediumDataClass )
			.attr( "fill", function( _data ) { return MEDIUM_COLORS[_data]; })
			.attr( "r", function( _data ) { return 0; } );

		// TODO: Fix the font adjustment factor.
		personGroups.append( "text" )
			.attr( "dx", function( _data ) { return -20; } )
			.text( function( _data ) { return _data; } );
	},

	/**
	 * @return {int} The width of the underlying canvas as an integer value.
	 */
	mfGetCanvasW : function() { return $( "#" + this.mCanvasID ).width(); },

	/**
	 * @return {int} The height of the underlying canvas as an integer value.
	 */
	mfGetCanvasH : function() { return $( "#" + this.mCanvasID ).height(); },

	/**
	 * Given the name of a person, returns the document ID of the corresponding
	 * DOM group item in the visualization.
	 *
	 * @param _person The name of the person for which the data element ID will
	 *  be returned.
	 * @return {string} The document ID of the group item for the given person.
	 */
	mfGetPersonDataID : function( _person ) { return "MAV_ID_" + _person; },

	/**
	 * Given the name of a medium, returns the document classification of the
	 * corresponding medium data items.
	 *
	 * @param _medium The name of the medium for which the document class will
	 *  be returned.
	 * @return {string} The document class for the medium data items.
	 */
	mfGetMediumDataClass : function( _medium ) { return "WAV_CL_" + _medium; },

	/// Fields ///

	/**
	 * The unique identifier for the document element onto which the visualization
	 * is painted.
	 */
	mCanvasID : undefined,
	
	/**
	 * The D3-selected DOM element onto which the visualization is painted.
	 */
	mCanvas : undefined,

	/**
	 * The message data set provided by the visualization backend.
	 */
	mMessageData : undefined,

	/**
	 * The index of the data segment within the full message data set currently
	 * being displayed by the instance.
	 */
	mDisplayIdx : undefined,

});
