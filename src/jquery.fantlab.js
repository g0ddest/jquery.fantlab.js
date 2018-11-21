(function($) {
    var defaults = {
        host: "/",
        search: "https://api.fantlab.ru/search-ids.json?",
        params_in_class: false,
        cross_domain: true,
        expr: /(work|edition)\_([0-9])+/gi,
        async: true,
        param_type: "data-fantlab_type", // "data- only on html5"
        param_id: "data-fantlab_id",
        innercss_work: "box-shadow: 1px 1px 2px rgba(0,0,0,0.2);font-family: Verdana, Arial; line-height: 1.2; cursor: default; vertical-align: top; position: absolute; padding: 10px; width: 230px; border-width: 1px 4px 1px 1px; border-style: solid; border-color: #adb4b8 #0079ab #adb4b8 #adb4b8; color: rgb(0, 0, 0); text-align: left; top: 24px; right: -200px; z-index: 999; outline: none; display: none; background-color: rgb(249, 250, 251);",
        innercss_edition: "box-shadow: 1px 1px 2px rgba(0,0,0,0.2);font-family: Verdana, Arial; line-height: 1.2; cursor: default; vertical-align: top; position: absolute; padding: 10px; width: 230px; border-width: 1px 4px 1px 1px; border-style: solid; border-color: #adb4b8 #C45E24 #adb4b8 #adb4b8; color: rgb(0, 0, 0); text-align: left; top: 24px; right: -200px; z-index: 999; outline: none; display: none; background-color: rgb(249, 250, 251);",
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

                        $.each(result.works, function(){

                            var autors = [];
                            $.each(this.creators.authors, function() {
                                (typeof this.id !== "undefined") ?
                                    autors.push('<a href="' + options.host + 'autor' + this.id + '">' + this.name + "</a>") :
                                    autors.push( this.content );
                            });
                            autors = autors.join(', ');

                            var imgsmall = this.image_preview ? this.image_preview : "//data.fantlab.ru/images/editions/small/0";
                            var rusname = this.name ? "<a style='font-size: 12px;font-weight: bold' href='" + options.host + "work" + this.id + "'>" + this.name + "</a>" : "";
                            var name = "";
                            if (this.name_orig) {
                                if (rusname && rusname!=="") { name = this.name_orig }
                                else { name = "<a style='font-size: 12px;font-weight: bold' href='" + options.host + "work" + this.id + "'>" + this.name_orig + "</a>"; }
                            }
                            var rating = this.stat ? this.stat.rating : 0;
                            var voters = this.stat ? this.stat.voters : 0;
                            var type_year = this.name_type?this.name_type:'';
                            type_year += (type_year && this.year>0)?', ':'';
                            type_year += this.year>0?this.year+' г.':'';

                            var text = options.corner +
                                (autors?"<p style='vertical-align: top;margin: 0;text-indent:0;margin-bottom:5px'>" + autors + "</p>":"") +
                                (rusname?"<p style='vertical-align: top;margin: 0;text-indent:0;margin-bottom:" + (name?"2":"8") + "px'>" + rusname + "</p>":"") +
                                (name?"<p style='vertical-align: top;margin: 0;text-indent:0;margin-bottom:5px'>" + name + "</p>":"") +
                                (type_year?"<p style='vertical-align: top;margin: 0;text-indent:0;margin-bottom:5px'>" + type_year + "</p>":"") +
                                "<p style='vertical-align: top;margin: 0;text-indent:0;margin-bottom:3px'>Рейтинг: " + (voters>0 ? "<font color=#C45E24><b>"+rating+"</b></font>" + " <font size=-2 color=gray>(" + voters + ")</font>" : "-") + "</p>";

                            var self = this;

                            $(obj).each(function(){

                                if(options.params_in_class){

                                    if($(this).hasClass("work_" + self.id)){
                                        $(this).append('<div style="'+options.innercss_work+'">'+text+'</div>');
                                    }
                                }else{
                                    if($(this).attr(options.param_type) === "work" && $(this).attr(options.param_id) == self.id){

                                        $(this).append('<div style="'+options.innercss_work+'">'+text+'</div>');
                                        $(this).focus(function(){
                                            this.blur();
                                        });

                                    }
                                }

                            });

                        });

                    }

                    if(typeof result.editions !== "undefined"){

                        $.each(result.editions, function(){

                            var autors = [];
                            $.each(this.creators.authors, function() {
                                (typeof this.id !== "undefined") ?
                                    autors.push('<a href="' + options.host + 'autor' + this.id + '">' + this.name + "</a>") :
                                    autors.push( this.name );
                            });
                            autors = autors.join(' ');
                            var origname = this.name;
                            var copies = "";
                            if(typeof this.copies !== "undefined")
                                copies = this.copies;
                            var pages = "";
                            if(typeof this.pages !== "undefined")
                                if(this.name_type !== "undefined" && this.name_type === "аудиокнига"){
                                    pages = "Продолжительность: " + (this.pages >= 60 ? Math.floor(this.pages/60) + "ч. " : "" ) + this.pages % 60 + "мин."
                                }else{
                                    pages = "Страниц: " + this.pages;
                                }
                            var year = "";
                            if(typeof this.year !== "undefined")
                                year = this.year;
                            var isbns = [];
                            if(typeof this.isbns !== "undefined")
                                $.each(this.isbns, function () {
                                    isbns.push(this);
                                });
                            isbns = isbns[0];//.join(', '); // add another?
                            var publishers = [];
                            if(typeof this.creators.publishers !== "undefined")
                                $.each(this.creators.publishers, function () {
                                    this.id ?
                                        publishers.push("<a href='" + options.host + "publisher" + this.id + "'>" + this.name + "</a>") :
                                        publishers.push(this.name);
                                });
                            publishers = publishers.join(', ');
                            var text = options.corner + "<a href='" + options.host + "edition" + this.id + "'><img style='border: 0;float:left; padding-right: 10px;' src='" + this.image_preview + "'></a>" +
                                "<p style='margin-bottom:5px;text-indent:0;'>" + autors + "</p>" +
                                "<p style='margin-bottom:5px;text-indent:0;'><a style='font-size: 12px;font-weight: bold; margin: 5px 0;' href='" + options.host + "edition" + this.id + "'>" + origname + "</a></p>" +
                                ((publishers||year)?"<p style='font-size:10px;margin-bottom:2px;text-indent:0;'>" + publishers + (year?(publishers?", ":"") + year + " г.":"") + "</p>":'') +
                                (copies?"<p style='font-size:10px;margin-bottom:2px;text-indent:0;'>Тираж: " + copies + "</p>":'') +
                                (isbns?"<p style='font-size:10px;margin-bottom:2px;text-indent:0;'>ISBN: " + isbns + "</p>":'') +
                                (pages?"<p style='font-size:10px;margin-bottom:2px;text-indent:0;'>" + pages + "</p>":'') ;

                            var self = this;

                            $(obj).each(function(){

                                if(options.params_in_class){

                                    if($(this).hasClass("edition_" + self.id)){
                                        $(this).append('<div style="'+options.innercss_edition+'">'+text+'</div>');
                                    }
                                }else{
                                    if($(this).attr(options.param_type) === "edition" && $(this).attr(options.param_id) == self.id){

                                        $(this).append('<div style="'+options.innercss_edition+'">'+text+'</div>');
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