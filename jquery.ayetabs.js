/*
 * jQuery ayetabs
 * ver alpha0.1
 * 2013-07-09
 * by yahiousun
 * license MIT
*/

(function($){

	var methods = {
		init: function(options){
			var settings = $.extend({}, $.fn.ayetabs.defaults, options)
			return this.each(function(){
				var self = $(this);
				var data = self.data('ayetabs');
				if(!data){ // if not initialized yet
					self.data('ayetabs', { // set data
						mode: settings.mode,
						labels: settings.labels,
						label: settings.label,
						contents: settings.contents,
						content: settings.content,
						active: settings.active,
						effect: settings.effect,
						easing: settings.easing,
						duration: settings.duration,
						trigger: settings.trigger
					});
					data = self.data('ayetabs'); // get data
				}
				self.addClass('ayetabs'); // add a class as mark
				self.ayetabs('position'); // position
				switch(data.mode){
					case 'id': ;
					break;
					case 'index': if(self.find(data.labels).find(data.label+'.'+data.active).length==0){
						self.find(data.labels).find(data.label).eq(0).addClass(data.active);
					}
					switch(data.effect){
						case 'fade': ;
						break;
						case 'slide': ;
						break;
						default: self.find(data.labels).find(data.label).each(function(index){
							$(this).bind(data.trigger+'.ayetabs', function(){
								$(this).addClass(data.active).siblings(data.label).removeClass(data.active);
								self.find(data.contents).find(data.content+'.'+data.active).css('display', 'none').removeClass(data.active);
								self.find(data.contents).find(data.content).eq(index).css('display', 'block').addClass(data.active);
							})
						});
					};
					break;
				}
			})
		},
		position: function(){
			return this.each(function(){
				var self = $(this);
				var data = self.data('ayetabs'); // data flag
				if(data){
					switch(data.mode){
					case 'id': ;
					break;
					case 'index': self.find(data.contents).removeAttr('style'); // remove style
					self.find(data.contents).find(data.content).removeAttr('style');
					if(self.find(data.contents).find(data.content+'.'+data.active).length==0){
						self.find(data.contents).find(data.content).eq(0).addClass(data.active);
					}
					switch(data.effect){ // switch effect
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
						self.find(data.contents).find(data.content+'.'+data.active).css('display', 'block');
					};
					break;
				}
				}
			})
		},
		destroy: function(){
			return this.each(function(){
				var self = $(this);
				var data = self.data('ayetabs'); // data flag
				if(data){ // if initialized, remove event handler, data and class
					self.removeData('ayetabs');
					self.removeClass('ayetabs')
				}
			})
		},
		update: function(options){ // update the plug-in options
			return this.each(function(){
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

	$.fn.ayetabs = function(method){ // call method logic
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method==='object'||!method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method '+method+' does not exist on jQuery.ayetabs.');
		}
	};

	// default settings
	$.fn.ayetabs.defaults = {
		mode: 'index', // plugin mode, String, "index" or "id".
		labels: '.ayetabs-labels',
		label: 'li',
		contents: '.ayetabs-contents',
		content: 'li',
		active: 'ayetabs-active',
		effect: '',
		easing: 'swing',
		duration: 500,
		trigger: 'click'
	}
})(jQuery);