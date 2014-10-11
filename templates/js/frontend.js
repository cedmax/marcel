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
 * @package Assets\Frontend\JS
 * @author The Happy Bit <thehappybit@gmail.com>
 * @copyright Copyright 2012, Andrea Gandino & Simone Maranzana
 * @link http://
 * @since The Happy Framework v 1.0
 * @license MIT License (http://www.opensource.org/licenses/mit-license.php)
 */


/**
* Video fitter
*
* E.g.
* $('#container').thb_fitVids();
* -----------------------------------------------------------------------------
*/
(function($) {
	$.fn.thb_fitVids = function() {

		return this.each(function() {
			var videos = $(this).find('iframe.thb_video:not(.thb-noFit)');

			videos.each(function() {
				var ratio = $(this).attr('width') / $(this).attr('height'),
					height = 100 * (1 / ratio),
					classes = $(this).data('class');

				if( $(this).data('fixed_height') != '' && $(this).data('fixed_width') != '' ) {
					height = $(this).data('fixed_height') * 100 / $(this).data('fixed_width');
				}

				$(this)
					.wrap('<div class="thb-video-wrapper"></div>')
					.parent()
					.css({
						'position': 'relative',
						'width': "100%",
						'padding-top': height+"%"
					})
					.addClass(classes);

				$(this).css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'bottom': 0,
					'right': 0,
					'width': "100%",
					'height': "100%"
				});
			});
		});

	}
})(jQuery);

/**
* Stretcher
*
* E.g.
* $('#container').thb_stretcher();
* -----------------------------------------------------------------------------
*/
(function($) {
	$.fn.thb_stretcher = function( params ) {

		params = $.extend({
			adapt			: true,
			cropFrom		: 'center',
			onSlideLoaded	: function() {},
			onSlidesLoaded	: function() {},
			slides			: '> *'
		}, params);

		return this.each(function() {

			/**
			 * Utilities
			 */
			function calcDim(calc, obj_dimensions, correction) {
				var dim = 'height';
				if( calc == 'height' ) { dim = 'width'; }

				instance.obj[dim] = instance.container[dim];
				instance.obj[calc] = (instance.container[dim] / obj_dimensions[dim]) * obj_dimensions[calc];

				if( correction ) {
					if( instance.obj[calc] >= instance.container[calc] ) {
						instance.obj[calc] = instance.container[calc];
						instance.obj[dim] = (instance.container[calc] / obj_dimensions[calc]) * obj_dimensions[dim];
					}
				}
			}

			function calcContainerDim() {
				instance.container.width = container.width();
				instance.container.height = container.height();
				instance.container.ratio = instance.container.width / instance.container.height;
			}

			/**
			 * Instance
			 * -----------------------------------------------------------------
			 */
			var instance = {
				container: {
					width: 0,
					height: 0,
					ratio: 0
				},

				obj: {
					width: 0,
					height: 0,
					offsetTop: 0,
					offsetLeft: 0
				},

				loadedSlides: 0
			};

			var container = $(this);
			container.data("params", params);

			var slides = container.find( container.data("params").slides );

			calcContainerDim();

			/**
			 * Slide
			 */
			slides.each(function() {
				var type = $(this).attr('data-type') && $(this).attr('data-type') !== '' ? $(this).attr('data-type') : 'image',
					obj = {};

				this.details = {
					'type': type
				};

				if( !container.data("loaded") ) {
					$(this).bind('thb_stretcher.render', function(e, firstLoad) {
						if( this.details.type == 'video' ) {
							obj = $(this).find('iframe');
						}
						else if( this.details.type == 'video-selfhosted' ) {
							obj = $(this).find('div.thb_slideshow_video');
						}
						else {
							if( $(this).is('img') ) {
								obj = $(this);
							}
							else {
								obj = $(this).find('> img');
							}
						}

						var obj_dimensions = {
							height: obj.data('height'),
							width: obj.data('width'),
							ratio: obj.data('width') / obj.data('height')
						};

						var obj_style = {};

						if( this.details.type == 'video' ) {
							// if( container.data("params").adapt ) {
								if( instance.container.ratio < obj_dimensions.ratio ) {
									instance.obj.width = instance.container.width;
									instance.obj.height = instance.obj.width * (1 / obj_dimensions.ratio);

									obj_style['margin-top'] = (instance.container.height - instance.obj.height) / 2;
									obj_style['margin-left'] = 0;
								}
								else {
									instance.obj.height = instance.container.height;
									instance.obj.width = instance.obj.height * (obj_dimensions.ratio);

									obj_style['margin-left'] = (instance.container.width - instance.obj.width) / 2;
									obj_style['margin-top'] = 0;
								}
							// }
							// else {
							// 	obj_style['margin-left'] = 0;
							// 	obj_style['margin-top'] = 0;

							// 	instance.obj.height = instance.container.height;
							// 	instance.obj.width = instance.container.width;
							// }
						}
						else if( this.details.type == 'video-selfhosted' ) {
							// instance.obj.height = instance.obj.width = '100%';
						}
						else {
							if( container.data("params").adapt ) {
								if( obj_dimensions.ratio > 1 ) { // Landscape
									calcDim('width', obj_dimensions, true);
								}
								else if( obj_dimensions.ratio < 1 ) {	// Portrait
									calcDim('height', obj_dimensions, true);
								}
								else { // Square
									if( instance.container.ratio >= 1 ) {
										instance.obj.height = instance.obj.width = instance.container.height;
									}
									else {
										instance.obj.height = instance.obj.width = instance.container.width;
									}
								}
							}
							else {
								if( instance.container.ratio < obj_dimensions.ratio ) {
									calcDim('width', obj_dimensions, false);
								}
								else {
									calcDim('height', obj_dimensions, false);
								}
							}
						}

						if( this.details.type == 'image' ) {
							var offsets = container.data("params").cropFrom.split(' ');

							// Vertical offsets
							if( $.inArray('top', offsets) != -1 ) {
								instance.obj.offsetTop = 0;
							}
							else if( $.inArray('bottom', offsets) != -1 ) {
								instance.obj.offsetTop = instance.container.height - instance.obj.height;
							}
							else {
								instance.obj.offsetTop = ( instance.obj.height - instance.container.height ) / -2;
							}

							// Horizontal offsets
							if( $.inArray('left', offsets) != -1 ) {
								instance.obj.offsetLeft = 0;
							}
							else if( $.inArray('right', offsets) != -1 ) {
								instance.obj.offsetLeft = instance.container.width - instance.obj.width;
							}
							else {
								instance.obj.offsetLeft = ( instance.obj.width - instance.container.width ) / -2;
							}

							obj_style['left'] = instance.obj.offsetLeft;
							obj_style['top'] = instance.obj.offsetTop;
						}

						obj_style['width'] = instance.obj.width;
						obj_style['height'] = instance.obj.height;
						obj_style['position'] = 'relative';
						obj_style['visibility'] = 'visible';

						obj.css(obj_style);

						if( firstLoad ) {
							instance.loadedSlides++;
							container.data("params").onSlideLoaded( obj );

							setTimeout(function() {
								obj.addClass("thb-stretcher-obj-loaded");
							}, 20);

							if( instance.loadedSlides == slides.length ) {
								container.data("params").onSlidesLoaded( slides );
							}
						}
					});
				}
			});

			/**
			 * Loader
			 */
			if( !container.data("loaded") ) {
				container.bind('thb_stretcher.load', function() {
					calcContainerDim();

					slides.each(function(i, slide) {
						var img = {};

						if( slide.details.type == 'image' ) {
							if( $(this).is('img') ) {
								img = $(this);
							}
							else {
								img = $(this).find('> img');
							}

							var src = img.attr('src');

							$.thb.loadImage(img, {
								imageLoaded: function( image, cloned ) {
									image.attr('data-height', cloned.height);
									image.attr('data-width', cloned.width);

									$(slide).trigger('thb_stretcher.render', true);
								}
							});

							img.on('mousedown', function() {
								return false;
							});
						}

						if( slide.details.type == 'video-selfhosted' ) {
							if( !$(slide).data('loadedmetadata') ) {
								$(this).find('video').on("loadedmetadata", function() {
									$("div.thb_video_selfhosted")
										.attr('data-height', this.videoHeight)
										.attr('data-width', this.videoWidth);

									$(slide)
										.data('loadedmetadata', true)
										.trigger('thb_stretcher.render', true);
								});
							}
							else {
								$(slide).trigger('thb_stretcher.render', true);
							}
						}

						if( slide.details.type == 'video' ) {
							if( $(this).find('iframe').length ) {
								var iframe = $(this).find('iframe'),
									iframe_width = iframe.data('ratio').split('/')[0],
									iframe_height = iframe.data('ratio').split('/')[1];

								iframe.attr('data-width', instance.container.width);
								iframe.attr('data-height', instance.container.width / iframe_width * iframe_height );
							}

							$(slide).trigger('thb_stretcher.render', true);
						}
					});
				});
			}

			/**
			 * Resize
			 */
			if( !container.data("loaded") ) {
				container.bind('thb_stretcher.resize', function() {
					calcContainerDim();

					setTimeout(function() {
						slides.each(function(i, slide) {
							$(slide).trigger('thb_stretcher.render');
						});
					}, 10);
				});
			}

			/**
			 * Bindings
			 */
			if( !container.data("loaded") ) {
				$(window).resize(function() {
					container.trigger('thb_stretcher.resize');
				});
				window.onorientationchange = function() {
					container.trigger('thb_stretcher.resize');
				};
			}

			/**
			 * Load
			 */
			container.trigger('thb_stretcher.load');
			container.data("loaded", true);

		});

	};
})(jQuery);

/**
 * Overlay
 * -----------------------------------------------------------------------------
 */
(function($) {
	$.thb.overlay = function( params ) {

		params = $.extend({
			speed: 180,
			easing: 'easeOutQuad',
			thumbs: '.item-thumb',
			overlay: '.thb-overlay',
			loadingClass: 'loading',
			transparency: 0.6
		}, params);

		if( ! $(params.overlay).length ) {
			return;
		}
		var overlay_opacity = 1;

		var overlay_color = $(params.overlay).css('background-color');

			overlay_color = overlay_color.replace('rgb', 'rgba');
			overlay_color = overlay_color.replace(')', ', ' + params.transparency + ')');

		$(params.overlay)
			.css('background-color', overlay_color );

		$(document)
			// .on('click dblclick', params.overlay, function() {
			// 	return false;
			// })
			.on('mouseenter', params.thumbs, function() {
				var overlay = $(this).find(params.overlay);
				overlay
					.stop()
					.css('visibility', 'visible')
					.animate({
						'opacity': overlay_opacity
					}, params.speed, params.easing);
			})
			.on('mouseleave', params.thumbs, function() {
				var overlay = $(this).find(params.overlay);

				if( overlay.hasClass(params.loadingClass) ) {
					return;
				}

				overlay
					.stop()
					.animate({
						'opacity': 0
					}, params.speed, params.easing, function() {
						$(this).css('visibility', 'hidden');
					});
			});
	};

	$(document).ready(function() {
		$.thb.overlay();
	});
})(jQuery);

/**
 * Remove empty paragraphs
 * -----------------------------------------------------------------------------
 */
(function($) {
	$.thb.removeEmptyParagraphs = function() {
		$('p')
			.filter(function() {
				return $.trim($(this).html()) === ''
			})
			.remove();
	}
})(jQuery);


/**
 * ****************************************************************************
 * THB menu
 *
 * $("#menu-container").menu();
 * ****************************************************************************
 */
(function($) {

	$.fn.menu = function(params) {

		// Parameters
		// --------------------------------------------------------------------
		var settings = {
			speed: 350,
			display: 'block',
			easing: 'linear',
			openClass: 'current-menu-item',
			'showCallback': function() {},
			'hideCallback': function() {}
		};

		// Parameters
		$.extend(settings, params);

		// Menu instance
		// --------------------------------------------------------------------
		var instance = {

			showSubMenu: function(subMenu) {
				subMenu
					.stop(true, true)
					.css({
						opacity: 0,
						display: settings.display
					})
					.animate({
						opacity: 1
					}, settings.speed, settings.easing, function() {
						settings.showCallback();
					});
			},

			hideSubMenu: function(subMenu) {
				subMenu
					.stop(true, true)
					.animate({
						opacity: 0
					}, settings.speed / 2, settings.easing, function() {
						$(this).hide();
						settings.hideCallback();
					});
			}

		};

		return this.each(function() {
			var menuContainer = $(this),
				menu = menuContainer.find("> ul"),
				menuItems = menu.find("> li"),
				subMenuItems = menuItems.find('li').andSelf();

			menuItems.each(function() {
				var subMenu = $(this).find('> ul');

				if( subMenu.length ) {
					subMenu.css({
						display: 'none'
					});
				}
			});

			// Binding events
			subMenuItems.each(function() {
				var item = $(this),
					subMenu = item.find("> ul");

				if( subMenu.length ) {
					item
						.find('> a')
						.addClass('w-sub');

					item
						.mouseenter(function() {
							$(this).addClass(settings.openClass);
							instance.showSubMenu(subMenu);
						})
						.mouseleave(function() {
							$(this).removeClass(settings.openClass);
							instance.hideSubMenu(subMenu);
						});
				}
			});
		});

	};

})(jQuery);

/**
 * ****************************************************************************
 * THB image scale
 *
 * $("img").thb_image('scale');
 * ****************************************************************************
 */
(function($) {
	var THB_Image = function( image ) {
		var self = this;
		this.src = image.src;
		this.obj = $(image);
		this.mode = "landscape";
		this.container = this.obj.parent();
		this.container.addClass("thb-container");

		// Load
		this.load = function( callback ) {
			$("<img />")
				.one("load", function() {
					callback();
				})
				.attr("src", self.src);
		};

		// Calc
		this.calc = function( width, height ) {
			this.height = $(image).outerHeight();
			this.width = $(image).outerWidth();
			this.ratio = this.width / this.height;

			var projected_height = width / this.ratio,
				projected_width = height * this.ratio;

			if( width > height ) {
				if( projected_width > width ) {
					return this.calcPortrait( height, projected_height );
				}
				else {
					return this.calcLandscape();
				}
			}
			else {
				if( projected_height > height ) {
					return this.calcLandscape();
				}
				else {
					return this.calcPortrait( height, projected_height );
				}
			}
		};

		// Calc portrait
		this.calcPortrait = function( height, projected_height ) {
			this.mode = "portrait";
			var margin_top = Math.round((height - projected_height) / 2);
			return {
				'margin-top': margin_top
			}
		};

		// Calc landscape
		this.calcLandscape = function() {
			this.mode = "landscape";
			return {
				'margin-top': '0'
			};
		};

		// Scale
		this.scale = function() {
			var properties = this.calc( this.container.width(), this.container.height() );

			if( this.mode === "portrait" ) {
				this.container.removeClass("thb-landscape").addClass("thb-portrait");
			}
			else {
				this.container.removeClass("thb-portrait").addClass("thb-landscape");
			}

			$(image).css(properties);
		};
	};

	var methods = {
		calc: function( width, height ) {
			var image = new THB_Image(this);
			return {
				properties: image.calc( width, height ),
				mode: image.mode
			}
		},

		scale: function( params ) {
			params = $.extend( {}, {
				resize: true,
				onImageLoad: function( image ) {
					image.scale();
				}
			}, params);

			return this.each(function() {
				var image = new THB_Image(this);
				image.load(function() {
					params.onImageLoad(image);

					if( params.resize ) {
						$(window).on("resize", function() {
							image.scale();
						});
					}
				});
			});
		}
	};

	$.fn.thb_image = function( method ) {
		if( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
	};
})(jQuery);

/*--------------------------------------------------------------------
 * JQuery Plugin: "EqualHeights" & "EqualWidths"
 * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 *
 * Copyright (c) 2007 Filament Group
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Description: Compares the heights or widths of the top-level children of a provided element
 		and sets their min-height to the tallest height (or width to widest width). Sets in em units
 		by default if pxToEm() method is available.
 * Dependencies: jQuery library, pxToEm method	(article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)
 * Usage Example: $(element).equalHeights();
   						      Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
 * Version: 2.0, 07.24.2008
 * Changelog:
 *  08.02.2007 initial Version 1.0
 *  07.24.2008 v 2.0 - added support for widths
--------------------------------------------------------------------*/

(function($) {
	$.fn.equalHeights = function(px) {
		var self = $(this),
			to = null;
		to = setTimeout(function() {
			clearTimeout(to);
			self.children().css('min-height', 'auto');

			self.each(function() {
				var currentTallest = 0;
				$(this).children().each(function(){
					if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
				});

				if (!px && Number.prototype.pxToEm) {
					currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
				}

				$(this).children().css({'min-height': currentTallest});
			});
		}, 150);
	};
})(jQuery);

/**
 * ****************************************************************************
 * Frontend boot
 * ****************************************************************************
 */
jQuery(document).ready(function($) {
	$.thb.removeEmptyParagraphs();
	jQuery('.sidebar').thb_fitVids();
});