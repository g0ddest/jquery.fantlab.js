(function($) {
    var defaults = {
		host: "http://fantlab.ru/",
		params_in_id: false,
		cross_domain: true,
		async: true,
		param_type: "data-fantlab_type", // "data- only on html5"
		param_id: "data-fantlab_id",
		innercss: "display: none;vertical-align: top;position:absolute;padding:10px;top:2em;left:2em;width:15em;border:1px solid #D2E0E8;border-left:2px solid #C45E24;background-color: #F9FAFB;color:#000;text-align: left"
	};
    var options;
	var StringtoXML = function(text){
		if (window.ActiveXObject){
					  var doc=new ActiveXObject('Microsoft.XMLDOM');
					  doc.async='false';
					  doc.loadXML(text);
					} else {
					  var parser=new DOMParser();
					  var doc=parser.parseFromString(text,'text/xml');
		}
		return doc;
    }
    $.fn.fantlab = function(params){
        options = $.extend({}, defaults, options, params);
		
		var self = this;
         
        $(this).on("mouseenter mouseleave",function(e){
		   var $this = $(this).find('div');
		   if (e.type === 'mouseenter') {
			   clearTimeout( $this.data('timeout') );
			 $.each($(self).find('div'), function(ind, val){var $val = $(val); if($val.html() != $this.html()){ $val.hide();} });
			   $this.slideDown('fast');
		   }else{
			   $this.data( 'timeout', setTimeout(function(){
			   $this.slideUp('fast');
			   },2000) );
		   }
		});
		
		$.each($(this), function(){
			
			if(options.params_in_id){
				var type = $(this).attr('id').split('_')[0];
				var param = $(this).attr('id').split('_')[1];
			}
			else{
				var type = $(this).attr(options.param_type);
				var param = $(this).attr(options.param_id);
			}
			var url = options.host + type + param + '.xml';
			var obj = this;
			var ajaxurl;
			(options.cross_domain) ? ajaxurl = "http://query.yahooapis.com/v1/public/yql?"+"q=select%20*%20from%20xml%20where%20url%3D%22"+encodeURIComponent(url)+"%22&format=xml'&callback=?" : ajaxurl = url;
			$.ajax({url: ajaxurl, 
				dataType: 'json',
				async: options.async,
				success: function(a) {
					xml = StringtoXML(a.results[0]);

					if(type == 'work'){
						var autors = [];
						$(xml).find('autors').find("autor").each(function () {
							autors.push($(this).text());	
						});
						autors = autors.join(', ');
						var imgsmall = $(xml).find('imgsmall').text();
						var rusname = $(xml).find('rusname').text();
						var year = $(xml).find('year').text();
						var rating = $(xml).find('rating').text();
						var voters = $(xml).find('rating').attr('voters');
						var text = "<img style='float:left; padding-right: 10px;' src='" + imgsmall + "'><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><b>" + rusname + "</b> <span style='font-size: 13px;'>(" + year + ")</span><br><b style='font-size: 20px; padding-top: 4px;'><span style='color: #C45E24'>" + rating + "</span><span style='color: gray;'> / 10</span></b><br><span style='font-size: 13px;'>оценили: " + voters + "<br/><span style='float:right;'><a style='color: gray; text-decoration: none; border-bottom: 1px gray dotted;' href='" + options.host + "work" + param + "'>fantlab.ru</a></span></span>";
						$(obj).append('<div style="'+options.innercss+'">'+text+'</div>');
					}
					if(type == 'edition'){
						var autors = $(xml).find('autors').text();
						var origname = $(xml).find('origname').text();
						var copies = $(xml).find('copies').text();
						var pages = $(xml).find('pages').text();
						var year = $(xml).find('year').text();
						var isbns = [];
						$(xml).find('isbns').find("isbn").each(function () {
							isbns.push($(this).text());
						});
						isbns = isbns[0];//.join(', ');
						var publishers = [];
						$(xml).find('publishers').find("publisher").each(function () {
							publishers.push($(this).text());
						});
						publishers = publishers.join(', ');
						var text = "<img style='float:left; padding-right: 10px;' src='http://img.fantlab.ru/editions/small/" + param + "'><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><b>" + origname + "</b><br><span style='font-size: 12px;'>" + publishers + ", " + year + " г.<br/>Тираж: " + copies + "<br/>ISBN: " + isbns + "<br/>Страниц: " + pages + "</span><span style='float:right;'><a style='color: gray; text-decoration: none; border-bottom: 1px gray dotted; font-size: 13px;' href='" + options.host + "edition" + param + "'>fantlab.ru</a></span>" ;
						$(obj).append('<div style="'+options.innercss+'">'+text+'</div>');
					}
				}
			});

		});

        return this;
    };
})(jQuery);