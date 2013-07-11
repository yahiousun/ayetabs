/*
 * jQuery ayetabs
 * ver 0.21 alpha
 * 2013-07-11
 * by yahiousun
 * license MIT
*/

(function ($) {

	var methods = {
		init: function (options) {
			var settings = $.extend({}, $.fn.ayetabs.defaults, options)
			return this.each(function () {
				var self = $(this);
				var data = self.data('ayetabs');
				if (!data) { // if not initialized yet
					self.data('ayetabs', { // set data
						mode: settings.mode,
						labels: settings.labels,
						label: settings.label,
						contents: settings.contents,
						content: settings.content,
						current: settings.current,
						transition: settings.transition,
						easing: settings.easing,
						duration: settings.duration,
						trigger: settings.trigger,
						active: settings.active,
						limited: settings.limited
					});
					data = self.data('ayetabs'); // get data
				}
				self.ayetabs('position'); // position

				var limited = false; // limited flag

				if (/^[1-9]\d*$/.test(data.limited)) {
					if (data.limited > 1) {
						if (data.limited < self.find(data.labels).find(data.label).length) {
							limited = true;
						}
					} else {
						$.error('Parameter limited '+data.limited+' is too small on jQuery.ayetabs.');
					}	
				} else if (data.limited === false || data.limited === 0) {
				} else {
					$.error('Parameter limited '+data.limited+' is not valid on jQuery.ayetabs.');
				};
				
				function synctab(target, index) { // sync tab
					var lw = parseInt(target.outerWidth()); // Libel width
					var ol = new Number; // Offset left
					if (index===0) {
						ol = 0;
					} else if ((self.find(data.labels).find(data.label).length-index) < (data.limited)) {
						ol = lw*(self.find(data.labels).find(data.label).length-data.limited)
					} else { // move libels
						if (target.nextAll(data.label).hasClass(data.current) || target.hasClass(data.current)) { // Back or Is current active
							ol = lw*(index-1);
						} else {  // Forward  // if (target.prevAll(data.label).hasClass(data.current))
							ol = lw*index;
						} 
					}
					self.find(data.labels).stop(true).animate({
						'margin-left': -ol
					}, data.duration, data.easing)
				}

				switch (data.mode) {
					case 'id': ;
					break;
					case 'index': 
						switch (data.effect) {
							case 'fade': ;
							break;
							case 'slide': ;
							break;
							default: 
								self.find(data.labels).find(data.label).each(function(index) {
									$(this).bind(data.trigger+'.ayetabs', function() {
										if (limited) {
											synctab($(this), index);
										}
										$(this).addClass(data.current).siblings(data.label).removeClass(data.current); // toggle class
										// move contents
										self.find(data.contents).find(data.content+'.'+data.current).css('display', 'none').removeClass(data.current);
										self.find(data.contents).find(data.content).eq(index).css('display', 'block').addClass(data.current);
										return false;
									})
								});
						};
						if (self.find(data.labels).find(data.label+'.'+data.current).length===0) { // if not initialized yet
							if (typeof(data.active)==='number') {
								if (/^-?\d+$/.test(data.active)) {
									if (Math.abs(data.active) < self.find(data.labels).find(data.label).length){
										self.find(data.labels).find(data.label).eq(data.active).trigger(data.trigger);
									} else {
										$.error('Parameter default '+data.active+' is out of range on jQuery.ayetabs.');
									}
								} else {
									$.error('Parameter default '+data.active+' is not an integer on jQuery.ayetabs.');
								}		
							} else if (true) {
								$.error('Parameter default '+data.active+' is not an integer on jQuery.ayetabs.');
							};
						} else {
							self.find(data.labels).find(data.label+'.'+data.current).trigger(data.trigger);
						}
					break;
				}
			})
		},
		position: function () {
			return this.each(function () {
				var self = $(this);
				var data = self.data('ayetabs'); // data flag
				if (data) {
					switch (data.mode) {
					case 'id': ;
					break;
					case 'index': 
						self.find(data.contents).removeAttr('style'); // remove style
						self.find(data.contents).find(data.content).removeAttr('style');
						switch (data.effect) { // switch effect
							case 'fade': ;
							break;
							case 'slide': ;
							break;
							default: 
							self.find(data.contents).css('position', 'relative');
							self.find(data.contents).find(data.content).each(function(index){
								$(this).css({
									'position': 'absolute',
									'top': 0,
									'left': 0,
									'display': 'none'
								})
							});
						};
					break;
				}
				}
			})
		},
		destroy: function () {
			return this.each(function () {
				var self = $(this);
				var data = self.data('ayetabs'); // data flag
				if(data){ // if initialized, remove event handler, data and class
					self.removeData('ayetabs');
					self.find(data.labels).find(data.label).unbind(data.trigger+'.ayetabs');
				}
			})
		},
		update: function (options) { // update the plug-in options
			return this.each(function () {
				var self = $(this);
				var data = self.data('ayetabs'); // get current settings
				if(data&&options){
					var settings = $.extend({}, data, options);
					self.ayetabs('destroy'); // deactive the plugin
					data = self.data('ayetabs', settings); // update data
					self.ayetabs('init'); // reactive
				}
			})
		}
	}

	$.fn.ayetabs = function (method) { // call method logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method==='object'||!method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on jQuery.ayetabs.');
		}
	};

	// default settings
	$.fn.ayetabs.defaults = {
		mode: 'index', // plugin mode, String, "index" or "id".
		labels: '.ayetabs-labels', // libels container element selector
		label: 'li', // libel element selector
		contents: '.ayetabs-contents', // contents container element selector
		content: 'li', // content element selector
		current: 'ayetabs-active', // current actived lebel and content's class 
		transition: '', // transition effect
		easing: 'swing', // easing method
		duration: 500, // animate duration
		trigger: 'click', // event trigger
		active: 0, // default active lebel's index, set false if you don't want it.
		limited: 0 // limited lebels number, set 0 or false if you don't want it.
	}
})(jQuery);