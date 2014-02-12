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
	var vizContainer = undefined;		// Document element for the visualization. 
	var visualizer = undefined;			// Object that drives the visualization.

	// Initialize Document //
	{
		$( ".viz-panel" ).height( $(document).height() - 80 );
		$( "#playback-month" ).text( index2date(0) );

		$( ".medium-checkbox" ).prop( "checked", true );
		$( ".people-checkbox" ).prop( "checked", true );
	}

	// Initialize Visualization SVG Component //
	{
		vizContainer = d3.select( "#viz" );
		vizContainer.append( "rect" )
			.attr( "x", 0 ).attr( "y", 0 )
			.attr( "width", $("#viz").width() ).attr( "height", $("#viz").height() )
			.attr( "fill", "white" );

		visualizer = new EmailVisualizer( vizContainer, EMAIL_DATA );
	}

	// Integrate Visualization into Document //
	{
		$( "#playback-slider" ).on( "change", function()
		{
			var month_idx = $( "#playback-slider" ).val();

			$( "#playback-month" ).text( index2date(month_idx) );
			// TODO: Update the visualizer.
		});
	}
}


$( document ).ready( main );
