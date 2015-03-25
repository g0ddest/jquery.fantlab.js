(function($) {
    var defaults = {
                host: "http://fantlab.ru/",
		search: "https://api.fantlab.ru/search.json?",
		params_in_class: false,
		cross_domain: true,
                expr: /(work|edition)\_([0-9])+/gi,
		async: true,
		param_type: "data-fantlab_type", // "data- only on html5"
		param_id: "data-fantlab_id",
		innercss: "box-shadow: 1px 1px 2px rgba(0,0,0,0.2);font-family: Verdana, Arial; line-height: 1.2; cursor: default; vertical-align: top; position: absolute; padding: 10px; width: 230px; border-width: 1px 4px 1px 1px; border-style: solid; border-color: #adb4b8 #0079ab #adb4b8 #adb4b8; color: rgb(0, 0, 0); text-align: left; top: 27px; right: -200px; z-index: 999; outline: none; display: none; background-color: rgb(249, 250, 251);",
        corner: "<span style='display: block!important; box-shadow: -1px 1px 0px rgba(0,0,0,0.2);width: 12px;height: 12px; position: absolute;margin-left: 20px;margin-top: -16px;background-color: rgb(249,250,251);z-index: 980;-webkit-transform: rotate(135deg);transform: rotate(135deg);'></span>"
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
                                            autors.push('<a traget="_blank" style="color: blue; text-decoration: none; font-size: 10px;" href="' + options.host + 'autor' + this.autor_id + '">' + this.content + "</a>") :
                                            autors.push( this.content );
                                });
                                autors = autors.join(', ');

                                var imgsmall = this.imgsmall ? this.imgsmall[0] : "//data.fantlab.ru/images/editions/small/0";
                                var rusname = (this.rusname && this.rusname[0]) ? this.rusname[0] : this.origname[0];
                                var year = this.year[0];
                                var rating = this.rating ? this.rating[0].content : 0;
                                var voters = this.rating ? this.rating[0].voters : 0;
                                var text = options.corner + "<a target='_blank' style='border: 0;text-decoration:none;' href='" + options.host + "work" + this.id + "'><img style='border: 0;float:left; padding-right: 10px;' src='" + imgsmall + "'></a><p style='vertical-align: top;margin: 0;text-indent:0;'>" + autors + "</p><a target='_blank' style='font-size: 12px;text-decoration:none; font-weight: bold; color: #000;' href='" + options.host + "work" + this.id + "'>" + rusname + "</a>" + (year>0?" <span style='font-size: 10px;'>(" + year + ")</span>":"") +"<br><b style='font-size: 20px; padding-top: 4px;'><span style='color: #C45E24'>" + rating + "</span><span style='color: gray;'> / 10</span></b><br><span style='font-size: 11px;'>оценили: " + voters + "<br/><span style='float:right;'><!--a target='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted;' href='" + options.host + "work" + this.id + "'>fantlab.ru</a--></span></span>";

                                var self = this;

                                $(obj).each(function(){

                                    if(options.params_in_class){

                                        if($(this).hasClass("work_" + self.id)){
                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                        }
                                    }else{
                                        if($(this).attr(options.param_type) === "work" && $(this).attr(options.param_id) === self.id){

                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                            $(this).focus(function(){
                                                this.blur();
                                            });

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
                                            autors.push('<a traget="_blank" style="color: blue; text-decoration: none; font-size: 10px;" href="' + options.host + 'autor' + this.autor_id + '">' + this.content + "</a>") :
                                            autors.push( this.content );
                                });
                                autors = autors.join(' ');
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
                                            publishers.push("<a target='_blank' style='text-decoration:none; color: blue;' href='" + options.host + "publisher" + this.id + "'>" + this.content + "</a>");
                                    });
                                publishers = publishers.join(', ');
                                var text = options.corner + "<a target='_blank' style='border: 0;text-decoration:none;' href='" + options.host + "edition" + this.id + "'><img style='border: 0;float:left; padding-right: 10px;' src='" + this.cover_mini + "'></a><p style='margin: 0 0 5px 0;vertical-align: top;text-indent: 0;'>" + autors + "</p><p style='margin: 0 0 5px 0;'><a target='_blank' style='font-size: 12px;text-decoration:none; font-weight: bold; color: #000; margin: 5px 0;' href='" + options.host + "edition" + this.id + "'>" + origname + "</a></p><span style='font-size: 10px;'>" + publishers + ", " + year + " г.<br/>Тираж: " + copies + "<br/>ISBN: " + isbns + "<br/>Страниц: " + pages + "</span><span style='float:right;'><!--a traget='_blank' style='color: gray; text-decoration: none; border-bottom: 1px gray dotted; font-size: 13px;' href='" + options.host + "edition" + this.id + "'>fantlab.ru</a--></span>" ;

                                var self = this;

                                $(obj).each(function(){

                                    if(options.params_in_class){

                                        if($(this).hasClass("edition_" + self.id)){
                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                        }
                                    }else{
                                        if($(this).attr(options.param_type) === "edition" && $(this).attr(options.param_id) === self.id){

                                            $(this).append('<div style="'+options.innercss+'">'+text+'</div>');
                                            $(this).focus(function(){
                                                this.blur();
                                            });

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