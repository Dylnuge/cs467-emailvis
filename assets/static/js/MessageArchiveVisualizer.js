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
 * - Clean up the collision detection code.
 * - Fix the code duplication related to getting identifier values.
 * - Remove the need to initialize the force layout every time a change is made
 *   to the ties in the structure (e.g. formality values change).
 */

// @see http://bl.ocks.org/mbostock/3231298
function collide(node) {
  var r = node.radius() + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius() + quad.point.radius();
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}


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
		this.mMediums = _msgMediums;

		var idFunc = this.mfGetPersonDataID;
		this.mPersonNodes = _msgPeople.map( 
			function( _person ) { return {"person": _person, "fixed": false, "radius": 
				function()
				{
					var personElement = d3.select( "#"+idFunc(_person) );
					var radii = []
					personElement.selectAll( "circle" ).each(function(_data){radii.push(_data["volume"]);});

					return Math.max.apply( null, radii );
				} }; } 
		).concat( {"person": "self", "x": this.mfGetCanvasW() / 2, "y": this.mfGetCanvasH() / 2, 
			"fixed": true, "radius": function(){return 0;}} );

		this.mfInitCanvas();
		this.mfPopulateCanvas( _msgPeople, _msgMediums );

		this.display( 0 );
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
		var dataSegment = this.mMessageData[ _dataIdx ];
		console.log( dataSegment );

		for( var i = 0; i < this.mPersonNodes.length - 1; ++i )
		{
			var personNode = this.mPersonNodes[ i ];
			var personName = personNode[ "person" ];

			var personElement = d3.select( "#"+this.mfGetPersonDataID(personName) );
			var personNewData = dataSegment[ personName ];
			
			for( var mediumIdx = 0; mediumIdx < this.mMediums.length; ++mediumIdx )
			{
				var medium = this.mMediums[ mediumIdx ];
				var mediumElement = personElement.selectAll( "." + this.mfGetMediumDataClass( medium ) );

				mediumElement.datum( function( _data )
				{
					var newData = jQuery.extend( true, {}, personNewData[ medium ] );
					newData[ "on" ] = _data[ "on" ];
					return newData;
				} );
						
				mediumElement.transition().duration(400).attr( "r", function( _data )
				{
					return _data[ "on" ] ? _data["volume"] : 0;
				} );
			}

			personElement.selectAll( "circle" ).sort( function( _first, _second ) 
			{
				return _second[ "volume" ] - _first[ "volume" ];
			} ).order();
		}

		this.mfInitForceLayout();
	},
	
	/**
	 * Toggles the filter on the given medium for the visualization.
	 *
	 * @param _medium The medium that will be toggled for visibility in the
	 *  visualization.
	 */
	toggleMediumFilter : function( _medium )
	{
		var mediumElements = this.mCanvas.selectAll( "." + this.mfGetMediumDataClass(_medium) );

		mediumElements.datum( function( _prevData )
		{
			_prevData[ "on" ] = !_prevData[ "on" ];
			return _prevData;
		} );
		mediumElements.transition().duration(400).attr( "r", function(_data)
		{
			return _data[ "on" ] ? _data["volume"] : 0;
		} );

		this.mfInitForceLayout();
	},

	/**
	 * Toggles the filter on the given person for the visualization.
	 *
	 * @param _persom The name of the person that will be toggled for visibility 
	 *  in the visualization.
	 */
	togglePersonFilter : function( _person )
	{
		var personElement = this.mCanvas.select( "#" + this.mfGetPersonDataID(_person) );

		personElement.datum( function( _prevData )
		{
			console.log( _prevData );
			_prevData[ "on" ] = !_prevData[ "on" ];
			return _prevData;
		} );
		personElement.attr( "visibility", function(_data)
		{
			console.log( _data[ "on" ] );
			return _data[ "on" ] ? "inherit" : "hidden";
		} );

		//this.mfInitForceLayout();
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
			.attr( "r", 10 )
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
		// TODO: Add more data items to allow for filtering.
		var personGroups = this.mCanvas.selectAll( "g people" )
			.data( _msgPeople ).enter().append( "g" )
			.attr( "id", this.mfGetPersonDataID );
		personGroups.datum( function(_data) 
		{ 
			return { "toString":function(){ return _data; }, "name": _data, "on": true }; 
		});

		personGroups.selectAll( "g mediums" )
			.data( _msgMediums ).enter().append( "circle" )
			.attr( "class", this.mfGetMediumDataClass )
			.attr( "fill", function( _data ) { return MEDIUM_COLORS[_data]; })
			.attr( "r", function( _data ) { return 0; } );
		personGroups.selectAll( "circle" ).datum({ "formality": 0.0, "volume": 0, "count": 0, "on": true });

		// TODO: Fix the font adjustment factor.
		personGroups.append( "text" )
			.attr( "dx", function( _data ) { return -20; } )
			.text( function( _data ) { return _data; } );
	},

	/**
	 * Initializes the force layout so that each person data item gravitates 
	 * toward its proper space.
	 */
	mfInitForceLayout : function()
	{
		var centerNode = this.mPersonNodes[ this.mPersonNodes.length - 1 ];
		var nodeLinks = []
		for( var i = 0; i < this.mPersonNodes.length - 1; ++i )
			nodeLinks.push( { "source": centerNode, "target": this.mPersonNodes[i]} )

		var screenMin = Math.min( this.mfGetCanvasW(), this.mfGetCanvasH() ) / 2.0;
		var idFunc = this.mfGetPersonDataID;
		this.mForceLayout = d3.layout.force()
			.nodes( this.mPersonNodes )
			.links( nodeLinks )
			.linkDistance( function( _link )
			{ 
				var personName = _link["target"]["person"];
				var personElement = d3.select( "#" + idFunc(personName) )
				var formalityLevel = 0.0;
				var numValues = 0;

				personElement.selectAll( "circle" ).each( 
					function(_data)
					{
						if( _data["count"] !== 0 && _data[ "on" ] )
						{
							formalityLevel += _data["formality"];
							numValues++; 
						}
					}
				);

				return (numValues === 0 ) ? screenMin : screenMin * ( formalityLevel / numValues );
			} )
			.linkStrength( 1.0 )
			.gravity( 0.01 )
			.size([ this.mfGetCanvasW(), this.mfGetCanvasH() ])

		var canvas = this.mCanvas;
		var personNodes = this.mPersonNodes;
		var idFunc = this.mfGetPersonDataID;
		this.mForceLayout.on("tick", function(e) {
			var q = d3.geom.quadtree(personNodes),
				i = 0,
				n = personNodes.length - 1;

				while (i++ < n) q.visit(collide(personNodes[i]));

				for( var i = 0; i < personNodes.length - 1; ++i )
				{
					var node = personNodes[i];
					canvas.select( "#" + idFunc(node["person"]) )
						.attr( "transform", "translate("+node.x+","+node.y+")" );
				}
		});

		this.mForceLayout.start();
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

	// TODO:
	mMediums : undefined,

	/**
	 * A listing of all the people that are contained as correspondents within 
	 * the message data set.
	 */
	mPersonNodes : undefined,

	/**
	 * The force layout used by the visualization to facilitate the movement of
	 * the person data items.
	 */
	mForceLayout : undefined,

});
