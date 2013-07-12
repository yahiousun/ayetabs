/*
 * jQuery ayetabs
 * ver 0.22
 * 2013-07-12
 * by yahiousun
 * license MIT
*/

(function ($) {

	var ayetabs = {
		name: 'ayetabs',
		version: '0.22',
		date: '2013-07-12',
		author: 'yahiousun',
		url: '',
		license: 'MIT'
	}
	var methods = { // Public methods
		init: function (options) {
			var settings = $.extend({}, $.fn.ayetabs.defaults, options)
			return this.each(function () {
				var self = $(this);
				var data = self.data(ayetabs.name);
				if (!data) { // if not initialized yet
					self.data(ayetabs.name, { // set data
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
						synctab: settings.synctab,
						visited: settings.visited
					});
					data = self.data(ayetabs.name); // get data
				}
				self.ayetabs('position'); // position

				var iSynctab = false; // synctab flag

				if (/^[1-9]\d*$/.test(data.synctab)) { // If is integer
					if (data.synctab > 1) {
						if (data.synctab < self.find(data.labels).find(data.label).length) {
							iSynctab = true;
						}
					} else {
						$.error('Parameter synctab '+data.synctab+' is too small on jQuery.'+ayetabs.name+'.');
					}	
				} else if (data.synctab === false || data.synctab === 0) {
				} else {
					$.error('Parameter synctab '+data.synctab+' is not valid on jQuery.'+ayetabs.name+'.');
				};
				
				function synctab(target, index) { // sync tab
					var lw = parseInt(target.outerWidth()); // Libel width
					var ol = 0; // Offset left
					if (index === 0) { // Is first one
						return false;
					} else {
						if (index%(data.synctab-1) === 0) {
							if (target.hasClass(data.current) ) { // Is active
								if (target.nextAll(data.lebel).length < (data.synctab-1)) { // If the last macth
									if (target.hasClass(data.visited)) { // If visited, back.
										ol = lw*(index-data.synctab+1);
										target.removeClass(data.visited);
									} else { // Forward
										ol = lw*(index-data.synctab+target.nextAll(data.lebel).length+1);
										target.addClass(data.visited);
									}
								} else {
									if (target.hasClass(data.visited)) { // If visited, forward.
										ol = lw*index;
										target.removeClass(data.visited);
									} else { // Back
										ol = lw*(index-data.synctab+1);
										target.addClass(data.visited);
									}
								}
							} else if (target.nextAll(data.label).hasClass(data.current)){ // Back
								ol = lw*(index-data.synctab+1);
							} else if (target.prevAll(data.label).hasClass(data.current)) { // Forward
								if (target.nextAll(data.lebel).length < (data.synctab-1)) { // If the last macth
									if (target.hasClass(data.visited)) { // If visited, forward.
										ol = lw*(index-data.synctab+1);
										target.removeClass(data.visited);
									} else { // Back
										ol = lw*(index-data.synctab+target.nextAll(data.lebel).length+1);
										target.addClass(data.visited);
									}
								} else {
									ol = lw*index;
								}
							}
						} else if ((self.find(data.labels).find(data.label).length-index) === data.synctab) { // If the end
							//self.find(data.labels).find(data.label).eq((data.synctab-index%(data.synctab-1)-1)+index).trigger(data.trigger);		
							if (target.hasClass(data.visited)) { // If visited, back.
								ol = lw*((data.synctab-index%(data.synctab-1)-1)+index-data.synctab+1);
								target.removeClass(data.visited);
							} else { // Forward.
								ol = lw*(self.find(data.labels).find(data.label).length-data.synctab);
								target.addClass(data.visited);
							}
						} else {
							return false;
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
									$(this).bind(data.trigger+'.'+ayetabs.name, function() {
										if (iSynctab) {
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
										$.error('Parameter default '+data.active+' is out of range on jQuery.'+ayetabs.name+'.');
									}
								} else {
									$.error('Parameter default '+data.active+' is not an integer on jQuery.'+ayetabs.name+'.');
								}		
							} else if (true) {
								$.error('Parameter default '+data.active+' is not an integer on jQuery.'+ayetabs.name+'.');
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
				var data = self.data(ayetabs.name); // data flag
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
				var data = self.data(ayetabs.name); // data flag
				if(data){ // if initialized, remove event handler, data and class
					self.removeData(ayetabs.name);
					self.find(data.labels).find(data.label).unbind(data.trigger+'.'+ayetabs.name);
				}
			})
		},
		update: function (options) { // update the plug-in options
			return this.each(function () {
				var self = $(this);
				var data = self.data(ayetabs.name); // get current settings
				if(data&&options){
					var settings = $.extend({}, data, options);
					self.ayetabs('destroy'); // deactive the plugin
					data = self.data(ayetabs.name, settings); // update data
					self.ayetabs('init'); // reactive
				}
			})
		},
		about: function(){
			return ayetabs;
		}
	}

	$.fn.ayetabs = function (method) { // call method logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method==='object'||!method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method '+method+' does not exist on jQuery.'+ayetabs.name+'.');
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
		synctab: 0, // sync tab lebels number, set 0 or false if you don't want it.
		visited: 'ayetabs-visited', // synctab visited flag, please do not change it or style it, unless you know what you are doing.
	}
})(jQuery);