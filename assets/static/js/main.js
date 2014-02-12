/**
 *	@file main.js
 *	@author Joseph Ciurej
 *	@date Winter 2014
 *
 *	The primary visualization script, which contains the logic for
 *	rendering the visualization in its default state.
 *
 * 	@TODO
 * 	- Write the implementation for this script!
 */

/**
 * The primary entry point, which initializes the default state for the 
 * visualization.
 */
function main()
{
	// Initialize the visualization SVG component.
	var vizContainer = d3.select( "#viz" );
	vizContainer.append( "rect" )
		.attr( "x", 0 ).attr( "y", 0 )
		.attr( "width", $( "#viz" ).width() ).attr( "height", $( "#viz" ).height() )
		.attr( "fill", "white" );
}


$( document ).ready( main );
