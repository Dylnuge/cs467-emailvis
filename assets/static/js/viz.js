/**
 * @file viz.js
 * @author Joseph Ciurej
 * @date Winter 2014
 *
 * Main Visualization File for Email Visualization
 *
 * @TODO
 * - Write the contents of this file!
 */

$( document ).ready( function()
{
	console.log( $( "#viz" ).width() );
	console.log( $( "#viz" ).height() );
	var svgContainer = d3.select( "#viz" );
	//var svgContainer = d3.select( "body" ).append("svg").attr("width", 200).attr("height", 200);
	var circle = svgContainer.append( "rect" )
		.attr( "x", 0 ).attr( "y", 0 )
		.attr( "width", $( "#viz" ).width() ).attr( "height", $( "#viz" ).height() );
} );

