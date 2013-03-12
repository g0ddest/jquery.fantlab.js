(function($) {
    var defaults = {
		host: "http://fantlab.ru/",
		params_in_id: false,
		cross_domain: true,
		async: true,
		param_type: "data-fantlab_type", // "data- only on html5"
		param_id: "data-fantlab_id",
		innercss: "display: none;vertical-align: top;position:absolute;padding:10px;width:230px;border:1px solid #D2E0E8;border-left:2px solid #C45E24;background-color: #F9FAFB;color:#000;text-align:left;top:1.3em;right:-255px;z-index:999;"
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
                        $.each($(self).find('div'), function(ind, val){var $val = $(val); if($val.html() !== $this.html()){ $val.hide();} });
                        $this.data( 'timeout', setTimeout(function(){
                              $this.slideDown('fast');
                          },1500) );
		   }else{
                        clearTimeout( $this.data('timeout') );
                        $this.data( 'timeout', setTimeout(function(){
                            $this.slideUp('fast');
                        },200) );
		   }
		});

		$.each($(this), function(){

			$(this).attr('style', 'position:relative;');

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
			var datatype;
			(options.cross_domain) ? datatype = 'json' : datatype = 'xml';
			(options.cross_domain) ? ajaxurl = "http://query.yahooapis.com/v1/public/yql?"+"q=select%20*%20from%20xml%20where%20url%3D%22"+encodeURIComponent(url)+"%22&format=xml'&callback=?" : ajaxurl = url;
			$.ajax({url: ajaxurl,
				dataType: datatype,
				async: options.async,
				success: function(a) {
					(options.cross_domain) ? xml = StringtoXML(a.results[0]) : xml = a;

					if(type === 'work'){
						var autors = [];
						$(xml).find('autors').find("autor").each(function () {
							(typeof $(this).attr("autor_id") !== "undefined") ?
                                                            autors.push('<a traget="_blank" style="color: #111; text-decoration: none; font-size: 13px;" href="' + options.host + 'autor' + $(this).attr("autor_id") + '">' + $(this).text() + "</a>") :
                                                            autors.push( $(this).text() );
						});
						autors = autors.join(', ');
						var imgsmall = $(xml).find('imgsmall').text();
						var rusname = $(xml).find('rusname').text();
						var year = $(xml).find('year').text();
						var rating = $(xml).find('rating').text();
						var voters = $(xml).find('rating').attr('voters');
						var text = "<a target='_blank' style='text-decoration:none;' href='" + options.host + "work" + param + "'><img style='float:left; padding-right: 10px;' src='" + imgsmall + "'></a><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><a target='_blank' style='text-decoration:none; font-weight: bold; color: #000;' href='" + options.host + "work" + param + "'>" + rusname + "</a>" + (year>0?" <span style='font-size: 13px;'>(" + year + ")</span>":"") +"<br><b style='font-size: 20px; padding-top: 4px;'><span style='color: #C45E24'>" + rating + "</span><span style='color: gray;'> / 10</span></b><br><span style='font-size: 13px;'>оценили: " + voters + "<br/><span style='float:right;'><a target='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted;' href='" + options.host + "work" + param + "'>fantlab.ru</a></span></span>";
						$(obj).append('<div style="'+options.innercss+'">'+text+'</div>');
					}
					if(type === 'edition'){
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
							publishers.push("<a target='_blank' style='text-decoration:none; border-bottom: 1px gray dotted; color: #000;' href='" + options.host + "publisher" + $(this).attr("id") + "'>" + $(this).text() + "</a>");
						});
						publishers = publishers.join(', ');
						var text = "<a target='_blank' style='text-decoration:none;' href='" + options.host + "edition" + param + "'><img style='float:left; padding-right: 10px;' src='http://img.fantlab.ru/editions/small/" + param + "'></a><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><a target='_blank' style='text-decoration:none; font-weight: bold; color: #000;' href='" + options.host + "work" + param + "'>" + origname + "</a><br/><span style='font-size: 12px;'>" + publishers + ", " + year + " г.<br/>Тираж: " + copies + "<br/>ISBN: " + isbns + "<br/>Страниц: " + pages + "</span><span style='float:right;'><a traget='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted; font-size: 13px;' href='" + options.host + "edition" + param + "'>fantlab.ru</a></span>" ;
						$(obj).append('<div style="'+options.innercss+'">'+text+'</div>');
					}
				}
			});

		});

        return this;
    };
})(jQuery);