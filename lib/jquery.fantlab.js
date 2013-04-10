(function($) {
    var defaults = {
                host: "http://fantlab.ru/",
		search: "http://api.fantlab.ru/search.json?",
		params_in_class: false,
		cross_domain: true,
                expr: /(work|edition)\_([0-9])+/gi,
		async: true,
		param_type: "data-fantlab_type", // "data- only on html5"
		param_id: "data-fantlab_id",
		innercss: "cursor:default;display:none;vertical-align:top;position:absolute;padding:10px;width:230px;border:1px solid #D2E0E8;border-left:2px solid #C45E24;background-color: #F9FAFB;color:#000;text-align:left;top:1.3em;right:-255px;z-index:999;"
	};
    var options;
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
                          },600) );
		   }else{
                        clearTimeout( $this.data('timeout') );
                        $this.data( 'timeout', setTimeout(function(){
                            $this.slideUp('fast');
                        },300) );
		   }
	});

        var obj = this;
        console.log(obj);
        var se = [];
        var sw = [];

        if($(this).length > 0){

            $.each($(this), function(){

                    $(this).attr('style', 'position:relative;');
                    if(options.params_in_class){
                            var type = options.exec($(this).attr('class'))[1];
                            var param = options.exec($(this).attr('class'))[2];
                    }
                    else{
                            var type = $(this).attr(options.param_type);
                            var param = $(this).attr(options.param_id);
                    }

                    if(type === "work") sw.push(param);
                    if(type === "edition") se.push(param);


            });

            var ajaxurl = options.search + "e=" + se.join(',') + "&w=" + sw.join(',');


            $.ajax({url: ajaxurl,
                    dataType: 'json',
                    async: options.async,
                    success: function(result) {

                        if(typeof result.works !== "undefined"){

                            $.each(result.works[0].work, function(){

                                var autors = [];
                                $.each(this.autors[0].autor, function() {
                                        (typeof this.autor_id !== "undefined") ?
                                            autors.push('<a traget="_blank" style="color: #111; text-decoration: none; font-size: 13px;" href="' + options.host + 'autor' + this.autor_id + '">' + this.content + "</a>") :
                                            autors.push( this.content );
                                });
                                autors = autors.join(', ');
                                var imgsmall = this.imgsmall[0];
                                var rusname = this.rusname[0];
                                var year = this.year[0];
                                var rating = this.rating[0].content;
                                var voters = this.rating[0].voters;
                                var text = "<a target='_blank' style='text-decoration:none;' href='" + options.host + "work" + this.id + "'><img style='float:left; padding-right: 10px;' src='" + imgsmall + "'></a><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><a target='_blank' style='text-decoration:none; font-weight: bold; color: #000;' href='" + options.host + "work" + this.id + "'>" + rusname + "</a>" + (year>0?" <span style='font-size: 13px;'>(" + year + ")</span>":"") +"<br><b style='font-size: 20px; padding-top: 4px;'><span style='color: #C45E24'>" + rating + "</span><span style='color: gray;'> / 10</span></b><br><span style='font-size: 13px;'>оценили: " + voters + "<br/><span style='float:right;'><a target='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted;' href='" + options.host + "work" + this.id + "'>fantlab.ru</a></span></span>";

                                var self = this;

                                $(obj).each(function(){

                                    if(options.params_in_class){

                                        if($(this).hasClass("work_" + self.id)){
                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                        }
                                    }else{
                                        if($(this).attr(options.param_type) === "work" && $(this).attr(options.param_id) === self.id){

                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');

                                        }
                                    }

                                });

                            });

                        }

                        if(typeof result.editions !== "undefined"){

                            $.each(result.editions[0].edition, function(){

                                //var autors = this.autors.join(', ');
                                var autors = [];
                                $.each(this.autors[0].autor, function() {
                                        (typeof this.autor_id !== "undefined") ?
                                            autors.push('<a traget="_blank" style="color: #111; text-decoration: none; font-size: 13px;" href="' + options.host + 'autor' + this.autor_id + '">' + this.content + "</a>") :
                                            autors.push( this.content );
                                });
                                autors = autors.join(', ');
                                var origname = this.origname[0];
                                var copies = "";
                                if(typeof this.copies !== "undefined")
                                    copies = this.copies[0];
                                var pages = "";
                                if(typeof this.pages !== "undefined")
                                    pages = this.pages[0];
                                var year = "";
                                if(typeof this.year !== "undefined")
                                    var year = this.year[0];
                                var isbns = [];
                                if(typeof this.isbns !== "undefined")
                                    $.each(this.isbns[0].isbn, function () {
                                            isbns.push(this);
                                    });
                                isbns = isbns[0];//.join(', '); // add another?
                                var publishers = [];
                                if(typeof this.publishers !== "undefined")
                                    $.each(this.publishers[0].publisher, function () {
                                            publishers.push("<a target='_blank' style='text-decoration:none; border-bottom: 1px gray dotted; color: #000;' href='" + options.host + "publisher" + this.id + "'>" + this.content + "</a>");
                                    });
                                publishers = publishers.join(', ');
                                var text = "<a target='_blank' style='text-decoration:none;' href='" + options.host + "edition" + this.id + "'><img style='float:left; padding-right: 10px;' src='http://img.fantlab.ru/editions/small/" + this.id + "'></a><span style='font-size: 12px; vertical-align: top;'>" + autors + "</span>" + "<br><a target='_blank' style='text-decoration:none; font-weight: bold; color: #000;' href='" + options.host + "work" + this.id + "'>" + origname + "</a><br/><span style='font-size: 12px;'>" + publishers + ", " + year + " г.<br/>Тираж: " + copies + "<br/>ISBN: " + isbns + "<br/>Страниц: " + pages + "</span><span style='float:right;'><a traget='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted; font-size: 13px;' href='" + options.host + "edition" + this.id + "'>fantlab.ru</a></span>" ;

                                var self = this;

                                $(obj).each(function(){

                                    if(options.params_in_class){

                                        if($(this).hasClass("edition_" + self.id)){
                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                        }
                                    }else{
                                        if($(this).attr(options.param_type) === "edition" && $(this).attr(options.param_id) === self.id){

                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');

                                        }
                                    }

                                });

                            });

                        }

                    }
            });

        }

        return this;
    };
})(jQuery);