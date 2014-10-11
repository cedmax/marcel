jQuery( 'document' ).ready( function() {

	jQuery( '.brm' ).hide();

	jQuery( '.brm-more-link' ).click( function(e) {
		e.preventDefault();
		jQuery( '.brm, .brm-more-link' ).toggle();

	} );

	jQuery(".thb-featuredimage-background-container").thb_stretcher({
		adapt: false
	});

} );
