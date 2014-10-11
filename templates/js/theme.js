/**
 * Frontend controller.
 *
 * This file is entitled to manage all the interactions in the frontend.
 *
 * ---
 *
 * The Happy Framework: WordPress Development Framework
 * Copyright 2012, Andrea Gandino & Simone Maranzana
 *
 * Licensed under The MIT License
 * Redistribuitions of files must retain the above copyright notice.
 *
 * @package JS
 * @author The Happy Bit <thehappybit@gmail.com>
 * @copyright Copyright 2012, Andrea Gandino & Simone Maranzana
 * @link http://
 * @since The Happy Framework v 1.0
 * @license MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/*(function($){
	$(function(){
		$('#page').height($(document.body).height()).prepend('<div id="smartbanner" style="text-align: center; padding: 10px; font-weight: bold; color: rgb(255, 255, 255); background: none repeat scroll 0% 0% rgba(255, 255, 255, 0.2);"><a href="https://tickets.edfringe.com/whats-on/marcel-vol-i-italian-politics-as-a-work-of-art" style="color: rgb(255, 255, 255); text-decoration: underline;">buy a ticket for the Edinburgh Fringe</a></div>');
		if ($(document.body).hasClass('home')){
			$('#smartbanner').css({
				position:'absolute',
				width:'100%',
				bottom:0,
				'z-index':2
			})
		}
	});
})(jQuery);
*/






var thb_moving = false,
	thb_toggling_menu = false,
	HomePageSlider = {};

/**
 * Boot
 * -----------------------------------------------------------------------------
 */
(function($) {
	$(document).ready(function() {

		// Go top
		$(".gotop").click(function() {
			$.scrollTo(0, 500);
			return false;
		});

		// Menu
		$("#main-nav > div").menu({
			speed: 150
		});

		// Navigation
		if( $("#logo ").length ) {
			$.thb.loadImage($("#logo"), {
				allLoaded: function() {
					var logo_height = $("#logo").outerHeight(),
						nav_wrapper = $(".nav-wrapper"),
						nav_trigger = $("#nav-trigger"),
						nav_wrapper_padding_top = parseInt(nav_wrapper.css("padding-top"), 10),
						nav_wrapper_padding_bottom = parseInt(nav_wrapper.css("padding-bottom"), 10),
						nav_wrapper_height = nav_wrapper.outerHeight() - nav_wrapper_padding_top - nav_wrapper_padding_bottom;

					var new_padding_top = nav_wrapper_padding_top + ((logo_height - nav_wrapper_height) / 2),
						new_padding_bottom = nav_wrapper_padding_bottom + ((logo_height - nav_wrapper_height) / 2);

					nav_wrapper.css({
						'padding-top': new_padding_top,
						'padding-bottom': new_padding_bottom
					});

					nav_trigger
						.css('margin-top', (logo_height - nav_trigger.outerHeight()) / 2 )
						.addClass('thb-loaded');
				}
			});
		}
		else {
			var logo_height = $("#logo").outerHeight(),
				nav_wrapper = $(".nav-wrapper"),
				nav_trigger = $("#nav-trigger"),
				nav_wrapper_padding_top = parseInt(nav_wrapper.css("padding-top"), 10),
				nav_wrapper_padding_bottom = parseInt(nav_wrapper.css("padding-bottom"), 10),
				nav_wrapper_height = nav_wrapper.outerHeight() - nav_wrapper_padding_top - nav_wrapper_padding_bottom;

			var new_padding_top = nav_wrapper_padding_top + ((logo_height - nav_wrapper_height) / 2),
				new_padding_bottom = nav_wrapper_padding_bottom + ((logo_height - nav_wrapper_height) / 2);

			nav_wrapper.css({
				'padding-top': new_padding_top,
				'padding-bottom': new_padding_bottom
			});

			nav_trigger
				.css('margin-top', (logo_height - nav_trigger.outerHeight()) / 2 )
				.addClass('thb-loaded');
		}

		$("#nav-trigger").on("click", function() {
			if( thb_toggling_menu ) {
				return false;
			}

			thb_toggling_menu = true;

			var nav_active = $("body").hasClass("nav-active");

			if( nav_active ) {
				$.thb.transition('.nav-wrapper', function() {
					$(".nav-wrapper").css("visibility", "hidden");
					thb_toggling_menu = false;
				});

				$("#logo").css("visibility", "visible");
				$("body").removeClass("nav-active");
			}
			else {
				$(".nav-wrapper").css("visibility", "visible");

				$.thb.transition('.nav-wrapper', function() {
					$("#logo").css("visibility", "hidden");
					thb_toggling_menu = false;
				});

				setTimeout(function() {
					$("body").addClass("nav-active");
				}, 1);
			}

			return false;
		});


		// Home page
		// ---------------------------------------------------------------------

		if( $('body').hasClass('page-template-template-showcase-php') ) {
			HomePageSlider.init();

			$(window).resize(function() {
				HomePageSlider.positionElements();
			});

			$.thb.loadImage( $(".header-container"), {
				allLoaded: function() {
					HomePageSlider.positionElements();
				}
			} );
		
		}

		// Footer stripe
		// ---------------------------------------------------------------------
	});
})(jQuery);

/**
 * Home page slider
 */
(function($) {
	window.HomePageSlider = {

		currentSlide: 0,

		init: function() {
			this.container = $("#thb-home-slides");
			this.pictures = $(".thb-home-slide > img");

			this.header = $(".header-container");
			this.footer = $(".home-footer-container");

			this.captions = $(".thb-home-slide-caption");
			this.banners = $(".thb-banner");
			this.homeExpand = $(".thb-home-expand");
			this.controlNext = $(".thb-home-slides-next");
			this.controlPrev = $(".thb-home-slides-prev");
			this.pagerContainer = $(".thb-home-slides-pager");
			this.pager = $(".thb-home-slides-pager a");

			$("body").addClass("thb-loading");

			this.bindEvents();
			this.showHideControls();
			this.loadFrontImage();
		},

		positionElements: function() {
			var $w = $(window),
				header_height = $(".header-container").outerHeight() + ($("#wpadminbar").length ? 28 : 0),
				footer_height = $(".home-footer-container").outerHeight(),
				diff = parseInt( (footer_height - header_height) / 2, 10 );

			if( !footer_height ) {
				footer_height = 48;
			}

			HomePageSlider.captions.css({
				'top' : header_height,
				'bottom' : footer_height
			});

			if( $("html").hasClass("no-csstransforms") ) {
				HomePageSlider.banners.each(function() {
					$(this).css("margin-top", - ($(this).outerHeight() / 2) + diff );
				});
			}
			else {
				HomePageSlider.banners.each(function() {
					$(this).css("margin-top", diff );
				});
			}

			HomePageSlider.pagerContainer.css({
				bottom: footer_height
			});
		},

		loadFrontImage: function() {
			setTimeout(function() {
				if( ! HomePageSlider.pictures.length ) {
					HomePageSlider.container.addClass("thb-slider-loaded");
				}
				else {
					$.thb.loadImage( HomePageSlider.pictures, {
						imageLoaded: function( image ) {
							image.parent().thb_stretcher({
								adapt: false
							});

							image.parent().addClass("thb-slide-loaded");
							$("body").removeClass("thb-loading");

							setTimeout(function() {
								HomePageSlider.container.addClass("thb-slider-loaded");
							}, 10);
						}
					} );
				}
			}, 500);
		},

		bindEvents: function() {
			$.thb.key("right", function() {
				HomePageSlider.right();
			});

			$.thb.key("left", function() {
				HomePageSlider.left();
			});

			HomePageSlider.controlNext.click(function() {
				HomePageSlider.right();
				return false;
			});

			HomePageSlider.controlPrev.click(function() {
				HomePageSlider.left();
				return false;
			});

			HomePageSlider.homeExpand.click(function() {
				if( $("body").hasClass("w-home-expand") ) {
					$(this).attr("data-icon", "u");
					$("body").removeClass("w-home-expand");
				}
				else {
					$(this).attr("data-icon", "p");
					$("body").addClass("w-home-expand");
				}

				return false;
			});

			HomePageSlider.pager.click(function() {
				if( ! HomePageSlider.container.hasClass("thb-slider-loaded") || thb_moving ) {
					return false;
				}

				var target = $(this).data("target");

				HomePageSlider.pager.removeClass("active");
				$(this).addClass("active");

				if( target !== HomePageSlider.currentSlide ) {
					if( target > HomePageSlider.currentSlide ) {
						for(i=HomePageSlider.currentSlide; i<target; i++) {
							HomePageSlider.right(true);
						}
					}
					else {
						for(i=HomePageSlider.currentSlide; i>target; i--) {
							HomePageSlider.left(true);
						}
					}
				}

				return false;
			});

			$('body.thb-mobile').hammer().bind('swipeleft', function() {
				HomePageSlider.right();
				return false;
			});

			$('body.thb-mobile').hammer().bind('swiperight', function() {
				HomePageSlider.left();
				return false;
			});
		},

		right: function( programmatic ) {
			if( ! programmatic && (! HomePageSlider.container.hasClass("thb-slider-loaded") || thb_moving) ) {
				return false;
			}

			var active_slides = $(".thb-home-slide.active"),
				slides = $(".thb-home-slide"),
				last_active = active_slides.last();

			if( active_slides.length < slides.length ) {
				$.thb.transition(last_active, function() {
					thb_moving = false;
				});

				last_active.addClass("out");
				last_active.next().addClass("active");

				this.currentSlide++;
				thb_moving = true;
			}
			else {
				thb_moving = true;

				$("#thb-home-slides").stop().animate({
					"margin-left": -20
				}, 150, 'linear', function() {
					$(this).stop().animate({
						"margin-left": 0
					}, 500, 'easeOutElastic', function() {
						thb_moving = false;
					});
				});
			}

			this.showHideControls();
		},

		left: function( programmatic ) {
			if( ! programmatic && (! HomePageSlider.container.hasClass("thb-slider-loaded") || thb_moving) ) {
				return false;
			}

			var active_slides = $(".thb-home-slide.active"),
				last_active = active_slides.last();

			if( active_slides.length > 1 ) {
				$.thb.transition(last_active, function() {
					thb_moving = false;
				});

				last_active.prev().removeClass("out");
				last_active.removeClass("active");

				this.currentSlide--;
				thb_moving = true;
			}
			else {
				thb_moving = true;

				$("#thb-home-slides").stop().animate({
					"margin-left": 20
				}, 150, 'linear', function() {
					$(this).stop().animate({
						"margin-left": 0
					}, 500, 'easeOutElastic', function() {
						thb_moving = false;
					});
				});
			}

			this.showHideControls();
		},

		showHideControls: function() {
			var active_slides = $(".thb-home-slide.active"),
				slides = $(".thb-home-slide");

			HomePageSlider.controlPrev.css({'visibility': 'visible'});
			HomePageSlider.controlNext.css({'visibility': 'visible'});

			if( active_slides.length === 1 ) {
				HomePageSlider.controlPrev.css({'visibility': 'hidden'});
			}

			if( active_slides.length === slides.length ) {
				HomePageSlider.controlNext.css({'visibility': 'hidden'});
			}

			HomePageSlider.pager.removeClass("active");
			HomePageSlider.pager.eq(active_slides.last().index()).addClass("active");
		}
	};
})(jQuery);
