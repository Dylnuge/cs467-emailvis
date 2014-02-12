/**
 * The abstract base representation of any component that will be
 * displayed within the Scalable Vector Graphics (SVG) environment.
 *
 * All graphics components that will be displayed within an SVG
 * page division should inherit from this base type.
 */
var SVGComponent = Class.extend({
    //  Variables  //

    /** The SVG component that serves as the parent component to the
        current component, or 'undefined' if the instance component
        is a root SVG component. */
    mParentComponent : undefined,
    /** The position for the top-left corner of the SVG component,
        which is represented as a two-dimensional vector where the
        first dimension describes the position along the horizontal
        axis and the second describes the position along the
        vertical axis. */
    mPosition : undefined,
    /** The dimensions of the SVG component, which is represented
        as a two-dimensional vector where the first dimension
        describes the width of the component and the second
        dimension describes the height. */
    mDimensions : undefined,
    /** An string value that uniquely defines the SVG component.
        This value is used so that components identify previous
        self-paintings to a canvas. */
    mID: undefined,

    //  Constructors  //

    /**
     * Constructor for the SVG component type.
     *
     * @param _parent An instance of the SVG component type that will
     * serve as the parent of the current instance, or 'undefined' if
     * the component is a root component.
     * @param _initialPos The initial positioning for the SVG component,
     * which is given as a 2D vector instance.
     * @param _initialDims The initial dimensions for the SVG component,
     * which is given as a 2D vector instance.
     *
     * @constructor
     */
    construct : function( _parent, _initialPos, _initialDims )
    {
        this.mParentComponent = _parent;
        this.mPosition = _initialPos;
        this.mDimensions = _initialDims;
        this.mID = "svgcomponent" + IDGenerator.generateID();
    },

    //  Functions  //

    /**
     * Draws the component at its absolute position given a listing
     * of all other components within the same SVG component space.
     *
     * @param _canvas The SVG canvas object to which the SVG component
     * will be drawn.
     * @param _componentListing A dictionary of the form
     * "{ id => SVGComponent }" where the ID is represented as a string
     * identifier for the component.
     */
    draw : function( _canvas, _componentListing ) { /* nothing */ },

    /**
     * Erases the instance component from the given canvas if it exists,
     * or does nothing if the instance doesn't exist on the given canvas.
     *
     * By default, this will delete the canvas instance with the identifier
     * for the SVG component.
     *
     * @param _canvas The SVG canvas object from which the instance
     * SVG component will be erased.
     */
    clear : function( _canvas )
    {
        // TODO: Determine if canvas-specific removal can be performed.
        d3.select( "#" + this.getID() ).remove();
    },

    /**
     * A string value that uniquely defines the SVGComponent on all canvases
     * to which it is rendered.
     *
     * @returns {string} A string that uniquely identifies the SVG component
     * from all other components drawn to the same canvas.
     */
    getID : function()
    {
        return this.mID;
    },

    /**
     * Returns the position of the component relative to its parent
     * component.
     *
     * @returns {Vector2D} The vector representation of the position
     * of the component relative to its parent component.
     */
    getRelativePosition : function()
    {
        return this.mPosition;
    },

    /**
     * Returns the position of the component relative to the canvas
     * (i.e. the canvas position at which the component will be drawn).
     *
     * @returns {Vector2D} The vector representation of the position
     * of the component relative to the origin of the base canvas.
     */
    getAbsolutePosition : function()
    {
        return this.isRootComponent() ? this.mPosition :
            VectorLib.add( this.mParentComponent.getAbsolutePosition(), this.mPosition );
    },

    /**
     * Returns the dimensions for the SVG component as a two-
     * dimensional vector value.
     *
     * @returns {Vector2D} The vector representation of the dimensions
     * of the component (where the first dimension is the width and the
     * second dimension is the height).
     */
    getDimensions : function()
    {
        return this.mDimensions;
    },

    /**
     * Returns a boolean value that indicates whether or not the
     * instance component is a root component (i.e. a component
     * without a root component).
     *
     * @returns {boolean} True if the component is a root component
     * and false otherwise.
     */
    isRootComponent : function()
    {
        return ( this.mParentComponent === undefined );
    },

    /**
     * Relocates the component to the coordinate specified by the
     * parameter values.
     *
     * @param _newX The position along the horizontal axis for the
     * new coordinate (given in pixel number).
     * @param _newY The position along the vertical axis for the
     * new coordinate (given in pixel number).
     */
    reposition : function( _newX, _newY )
    {
        this.mPosition.setDimensions( _newX, _newY );
    },

    /**
     * Resizes the component to the new width and height values.
     *
     * @param _newWidth The new width for the component (given in
     * number of pixels).
     * @param _newHeight The new height for the component (given
     * in number of pixel).
     */
    resize : function( _newWidth, _newHeight )
    {
        this.mDimensions.setDimensions( _newWidth, _newHeight );
    }

});
