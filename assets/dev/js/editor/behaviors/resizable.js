var ResizableBehavior;

ResizableBehavior = Marionette.Behavior.extend( {
	defaults: {
		handles: elementor.config.is_rtl ? 'w' : 'e'
	},

	ui: {
		columnTitle: '.column-title'
	},

	events: {
		resizestart: 'onResizeStart',
		resizestop: 'onResizeStop',
		resize: 'onResize'
	},

	initialize: function() {
		Marionette.Behavior.prototype.initialize.apply( this, arguments );

		this.listenTo( elementor.channels.dataEditMode, 'switch', this.onEditModeSwitched );
	},

	active: function() {
		var options = _.clone( this.options );

		delete options.behaviorClass;

		var $childViewContainer = this.getChildViewContainer(),
			defaultResizableOptions = {},
			resizableOptions = _.extend( defaultResizableOptions, options );

		$childViewContainer.resizable( resizableOptions );
	},

	deactivate: function() {
		if ( this.getChildViewContainer().resizable( 'instance' ) ) {
			this.getChildViewContainer().resizable( 'destroy' );
		}
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode ) {
			this.active();
		} else {
			this.deactivate();
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			self.onEditModeSwitched( elementor.channels.dataEditMode.request( 'activeMode' ) );
		} );
	},

	onDestroy: function() {
		this.deactivate();
	},

	onResizeStart: function( event ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize:start' );
	},

	onResizeStop: function( event ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize:stop' );
	},

	onResize: function( event, ui ) {
		event.stopPropagation();

		this.view.triggerMethod( 'request:resize', ui );
	},

	getChildViewContainer: function() {
		return this.$el;
	}
} );

module.exports = ResizableBehavior;
