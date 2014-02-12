/**
 * @file main.js
 * @author Joseph Ciurej
 * @date Winter 2014
 *
 * The primary visualization script, which contains the logic for
 * rendering the visualization in its default state.
 *
 * @TODO
 */

/// Primary Entry Point ///

/**
 * The primary entry point, which initializes the default state for the 
 * visualization.
 */
function main()
{
	// Main Variables //
	var visualizer = undefined;			// Object that drives the visualization.
	var playingViz = false;

	// Initialize Document //
	{
		$( ".viz-panel" ).height( $(document).height() - 80 );
		$( "#playback-month" ).text( index2date(0) );

		$( ".medium-checkbox" ).prop( "checked", true );
		$( ".people-checkbox" ).prop( "checked", true );
	}

	// Initialize Visualization SVG Component //
	{
		visualizer = new MessageArchiveVisualizer( "viz", 
			MSG_DATA, MSG_CORRESPONDENTS, MSG_MEDIUMS );
	}

	// Integrate Visualization into Document //
	{
		$( "#playback-slider" ).on( "change", function()
		{
			var month_idx = $( "#playback-slider" ).val();

			$( "#playback-month" ).text( index2date(month_idx) );
			visualizer.display( month_idx );
		});

		$( ".medium-checkbox" ).on( "click", function()
		{
			var checkboxID = $( this ).attr( "id" );
			var checkboxTag = "_cbox";
			var mediumID = checkboxID.substring( 0, checkboxID.length - checkboxTag.length );

			visualizer.toggleMediumFilter( mediumID );
		});

		$( ".people-checkbox" ).on( "click", function()
		{
			var checkboxID = $( this ).attr( "id" );
			var checkboxTag = "_cbox";
			var personID = checkboxID.substring( 0, checkboxID.length - checkboxTag.length );

			visualizer.togglePersonFilter( personID );
		});
	}
}


$( document ).ready( main );
