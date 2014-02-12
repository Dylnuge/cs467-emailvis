/**
 * @file EmailVisualizer.js
 * @author Joseph Ciurej
 * @date Winter 2014
 *
 * Source File for the "EmailVisualizer" Type
 *
 * @TODO
 * - The visualizer currently displays all data given for the earliest month
 *   by default.  Change this behavior to be more general if need be.
 */

/**
 * The base type for the email visualization, which generates the visualization
 * and manipulates it based on instance queries.
 */
var EmailVisualizer = Class.extend({
	/// Constructors ///
	
	/**
	 * Creates an email visualization that draws the given data onto the given
	 * canvas.
	 *
	 * @param _canvas The document element onto which the visualization will
	 *  be painted (given as a D3-selected DOM object).
	 * @param _emailData The email data provided by the visualization backend.
	 */
	construct : function( _canvas, _emailData )
	{
		this.mCanvas = _canvas;
		this.mEmailData = _emailData;
		this.mDisplayIdx = 0;

		this.mfClearCanvas();
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
	 * Clears the contents of the canvas for the instance visualization.
	 */
	mfClearCanvas : function()
	{
		
	}

	/// Fields ///
	
	/**
	 * The D3-selected DOM element onto which the visualization is painted.
	 */
	mCanvas : undefined,

	/**
	 * The email data set provided by the visualization backend.
	 */
	mEmailData : undefined,

	/**
	 * The index of the data segment within the full email data set currently
	 * being displayed by the instance.
	 */
	mDisplayIdx : undefined,

});
