/**
 * A graphics component that serves as the graphical representation
 * of a data item.
 */
var DataComponent = SVGComponent.extend({
    //  Variables  //

    /** An aggregate graphical component that will display all the
        extra text information given in the data dictionary other
        than the value. */
    mInfoComponent : undefined,
    /** An aggregate graphical component that will display all the
        primary value item associated with the data component (i.e.
        the value associated with the 'value' key in the data
        dictionary). */
    mValueComponent : undefined,
    /** A dictionary that contains a listing of information about the
        data item being represented by the data component. */
    mMetadata : undefined,

    //  Constructors  //

    /**
     * Constructor for the data component type.
     *
     * @param _parent An instance of the SVG component type that will
     * serve as the parent of the current instance, or 'undefined' if
     * the component is a root component.
     * @param _initialPos The initial positioning for the SVG component,
     * which is given as a 2D vector instance.
     * @param _initialDims The initial dimensions for the SVG component,
     * which is given as a 2D vector instance.
     *
     * @param _value The primary value for the data component (i.e. the
     * value that will displayed most prominently within the component).
     * @param _type The type of the data being represented by the component,
     * which should be given as a string.
     * @param _metadata Any extra data that should be displayed to
     * describe the component.
     */
    construct : function( _parent, _initialPos, _initialDims, _value, _type, _metadata )
    {
        this._$.construct.call( this, _parent, _initialPos, _initialDims );

        this.mMetadata = _metadata;

        this.mInfoComponent = new TextComponent( this, this.mfGetInfoComponentPos(),
            this.mfGetSubComponentDims(), _metadata );

        this.mValueComponent = ( _type === "int*" ) ?
            new PointerComponent( this, this.mfGetValueComponentPos(),
                this.mfGetSubComponentDims(), _value === 0 ? undefined : "dataaddr" + _value ) :
            new PrimitiveComponent( this, this.mfGetValueComponentPos(),
                this.mfGetSubComponentDims(), _value );
    },

    //  Helper Functions  //

    /**
     * Returns a number that indicates the amount of padding that
     * should be given between sub-components of the instance data
     * component.
     *
     * @returns {number} An numerical value that represents the amount
     * of padding that there will be between the aggregate components.
     */
    mfGetPadding : function()
    {
        return 5;
    },

    /**
     * Given the total area allotted to the data component, this
     * function returns a 2-dimensional vector that describes the
     * dimensions that should be given to the sub-components.
     *
     * @returns {Vector2D} A vector that represents the dimensions that
     * should be given to the sub-components of the data component.
     */
    mfGetSubComponentDims : function()
    {
        var dims = this.getDimensions();
        var padding = this.mfGetPadding();

        return new Vector2D(
            dims.getX() - 2 * padding,
            ( dims.getY() - 3 * padding ) / 2
        );
    },

    /**
     * Given the area allotted to the info component, this function
     * returns a vector that indicates the relative position at
     * which the info component should be rendered.
     *
     * @returns {Vector2D} The position at which the info component
     * should be drawn relative to the data component.
     */
    mfGetInfoComponentPos : function()
    {
        var padding = this.mfGetPadding();

        return new Vector2D( 2 * padding, 2 * padding );
    },

    /**
     * Given the area allotted to the value component, this function
     * returns a vector that indicates the relative position at
     * which the info component should be rendered.
     *
     * @returns {Vector2D} The position at which the value component
     * should be drawn relative to the data component.
     */
    mfGetValueComponentPos : function()
    {
        var subCompDims = this.mfGetSubComponentDims();
        var padding = this.mfGetPadding();

        return new Vector2D( padding, subCompDims.getY() + padding );
    },

    //  Functions  //

    /**
     * Draws the data component as a combined text component (which
     * will display metadata) as well as the primary value represented
     * by the data component.
     *
     * @param _canvas The canvas object to which the SVG component
     * will be drawn.
     * @param _componentListing A list of all of the SVG component
     * items that are being drawn in the same space as the instance.
     */
    draw : function( _canvas, _componentListing )
    {
        var pos = this.getAbsolutePosition();
        var dims = this.getDimensions();

        var x12 = pos.getX();
        var y12 = pos.getY();
        var w12 = dims.getX();
        var h12 = dims.getY();

        var dataGroup = _canvas.append( "g" ).attr( "id", this.getID() );
        dataGroup.append( "svg:rect" ).
            attr( "x", pos.getX() ).attr( "y", pos.getY() ).
            attr( "width", dims.getX() ).attr( "height", dims.getY() ).
            style( "fill", "cyan" ).attr( "stroke", "black" );

        // TODO: Will passing the data group append these items as sub-items?
        this.mInfoComponent.draw( _canvas, _componentListing );
        this.mValueComponent.draw( _canvas, _componentListing );
    },

    /**
     * Removes the data component from the canvas and all of its
     * associated graphical contents.
     *
     * @param _canvas The canvas object from which the SVG component
     * will be removed.
     */
    clear : function( _canvas )
    {
        this.mInfoComponent.clear( _canvas );
        this.mValueComponent.clear( _canvas );

        this._$.clear.call( this, _canvas );
    },

    /**
     * Resizes the component to the new width and height values,
     * resizing all sub-components as necessary.
     *
     * @param _newWidth The new width for the component (given in
     * number of pixels).
     * @param _newHeight The new height for the component (given
     * in number of pixel).
     */
    resize : function( _newWidth, _newHeight )
    {
        this._$.resize.call( this, _newWidth, _newHeight );

        var infoCompPos = this.mfGetInfoComponentPos();
        var valueCompPos = this.mfGetValueComponentPos();
        var subCompDims = this.mfGetSubComponentDims();

        this.mInfoComponent.reposition( infoCompPos.getX(), infoCompPos.getY() );
        this.mInfoComponent.resize( subCompDims.getX(), subCompDims.getY() );

        this.mValueComponent.reposition( valueCompPos.getX(), valueCompPos.getY() );
        this.mValueComponent.resize( subCompDims.getX(), subCompDims.getY() );
    }

});
