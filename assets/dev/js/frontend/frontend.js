/* global elementorFrontendConfig */
( function( $ ) {
	var elements = {},
		EventManager = require( '../utils/hooks' ),
		ElementsHandler = require( 'elementor-frontend/elements-handler' ),
	    Utils = require( 'elementor-frontend/utils' );

	var ElementorFrontend = function() {
		var self = this,
			scopeWindow = window;

		this.config = elementorFrontendConfig;

		this.hooks = new EventManager();

		var initElements = function() {
			elements.$document = $( self.getScopeWindow().document );

			elements.$elementor = elements.$document.find( '.elementor' );
		};

		var initOnReadyComponents = function() {
			self.utils = new Utils( $ );

			self.elementsHandler = new ElementsHandler( $ );
		};

		this.init = function() {
			initElements();

			initOnReadyComponents();
		};

		this.getScopeWindow = function() {
			return scopeWindow;
		};

		this.setScopeWindow = function( window ) {
			scopeWindow = window;
		};

		this.isEditMode = function() {
			return self.config.isEditMode;
		};

		// Based on underscore function
		this.throttle = function( func, wait ) {
			var timeout,
				context,
				args,
				result,
				previous = 0;

			var later = function() {
				previous = Date.now();
				timeout = null;
				result = func.apply( context, args );

				if ( ! timeout ) {
					context = args = null;
				}
			};

			return function() {
				var now = Date.now(),
					remaining = wait - ( now - previous );

				context = this;
				args = arguments;

				if ( remaining <= 0 || remaining > wait ) {
					if ( timeout ) {
						clearTimeout( timeout );
						timeout = null;
					}

					previous = now;
					result = func.apply( context, args );

					if ( ! timeout ) {
						context = args = null;
					}
				} else if ( ! timeout ) {
					timeout = setTimeout( later, remaining );
				}

				return result;
			};
		};

		this.addListenerOnce = function( listenerID, event, callback, to ) {
			if ( ! to ) {
				to = $( self.getScopeWindow() );
			}

			if ( ! self.isEditMode() ) {
				to.on( event, callback );

				return;
			}

			if ( to instanceof jQuery ) {
				var eventNS = event + '.' + listenerID;

				to.off( eventNS ).on( eventNS, callback );
			} else {
				to.off( event, null, listenerID ).on( event, callback, listenerID );
			}
		};

		this.getCurrentDeviceMode = function() {
			return getComputedStyle( elements.$elementor[ 0 ], ':after' ).content.replace( /"/g, '' );
		};
	};

	window.elementorFrontend = new ElementorFrontend();
} )( jQuery );

if ( ! elementorFrontend.isEditMode() ) {
	jQuery( elementorFrontend.init );
}
