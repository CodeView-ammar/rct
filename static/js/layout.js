var owner_sess_timeout=false;
var owner_sess_request=0;
$(function () {
    if (!IS_PC) {

        // create search toggle button in mobile devices
        var filterSearchBtn = $('#page-head-search-btn').clone().removeClass('hide').addClass('col-xs-2').css('display','block');
        $(".actions-selections-head #sech-holder").append(filterSearchBtn);
        $('#FilterDiv #page-head-search-btn').remove();
        //$("#top-bar-nav-section").css("display","block");
        $breadcrumbsTitle = $('#breadcrumb li:last-child');
        // Top header title
        var h1Header = $breadcrumbsTitle.text();
        //prev header link html
        var prevLinkHtml = $breadcrumbsTitle.prev().html();

        $('#breadcrumb li').hide();
        $("#top-header-title").text(h1Header);

        // scroll top to the parent element
        $('.mobile-options .btn').on('click', function () {
            var $that = $(this);
            if($that.closest('.day-view-entry').length > 0){
                $('html,body').animate({
                    scrollTop: $that.closest('.day-view-entry').offset().top - 20
                }, 600);
            }

        });

        if(document.getElementById("FilterDiv") != null) {
            if(document.getElementById("page-head-search-btn") == null) { 
                $('<span id="page-head-search-btn" class=" add-new-top-actions btn btn-action-blue only-mob  right page-head-btn btn-lg" style="display: block; MARGIN-RIGHT:5PX;"><i class="fa fa-search"></i></span>').appendTo('.top-actions');
            }
        }
    }
    if($( window ).width() >= 1024)
    {
      $(window).scroll(function()
      {

        //   $(".pages-head .top-actions .btn:not(.not)").each(function()
        //    {
        //      if($(window).scrollTop() > 300)
        //       {
        //            $(this).removeClass('btn-lg').addClass('btn-md');
        //       }
        //       else
        //       {
        //           $(this).removeClass('btn-md').addClass('btn-lg');
        //       }

        //    });

      });
    }


    //console.log($("#breadcrumb").html());
    $("#page-head-search-btn").click(function () {
        $("#FilterDiv").toggle();
    });
    $(document).on('click', '.error-message', function (e) {
        e.stopImmediatePropagation();
        $(".error-message").hide();
        $(this).show();
    });
    $(document).on('click', '.form-error', function (e) {

		 e.stopImmediatePropagation();
        $(".error-message.error_"+$(this).attr('id')).show();
    });

    $(document).on('click', 'div.error', function (e) {
        e.stopImmediatePropagation();
       $(".error-message").hide();
        $(".error-message", $(this)).show();
    });

    $(document).on('click', 'body', function (e) {
      $(".error-message").hide();
    });

    $('.mob-nav-trigger').click(function (evt) {
        if (!$(".menu-burger").hasClass("open")) {
            $('.mob-nav-trigger .p-b-none i').addClass('fa-times');
        } else {
            $('.mob-nav-trigger .p-b-none i').removeClass('fa-times');
        }
    });

    if ($('.page-snippets .close, .snippet-content .close').length) {

        $('.page-snippets , .snippet-content').hide();

        var closedSnippets = [];
        try {
            if (window.localStorage.closedSnippets) {
                closedSnippets = window.localStorage.closedSnippets.split(':');
            }
        } catch (e) {

        }

        $('.page-snippets .close, .snippet-content .close').click(function () {
            var snippet = $(this).parents('.page-snippets , .snippet-content');
            snippet.fadeOut('medium', function () {
                snippet.remove();
            });
            try {
                if (!window.localStorage.closedSnippets) {
                    window.localStorage.closedSnippets = '';
                }
            } catch (e) {
            }

            var snippetName = $(this).data('snippet');
            closedSnippets.push(snippetName);
            try {
                window.localStorage.closedSnippets = closedSnippets.join(':');
            } catch (e) {


            }
            return false;
        }).each(function () {
            try {
                if (window.localStorage.closedSnippets) {
                    var snippetName = $(this).data('snippet');
                    if ($.inArray(snippetName, closedSnippets) == -1) {
                        $(this).parents('.page-snippets , .snippet-content').show();
                    }
                } else {
                    $(this).parents('.page-snippets , .snippet-content').show();
                }
            } catch (e) {
                $(this).parents('.page-snippets , .snippet-content').show();
            }
        });
    }

    $('li.actions-list .more-actions').click(function (evt) {
        /* @var evt Event */
        var $parent = $(this).parents('.actions-list');
        var parent = $parent[0];
        var list = $('.submenu-more-actions', parent);
        var visible = $('.submenu-more-actions:visible', parent).length;
        $('.submenu-more-actions').hide();
        $('li.actions-list .more-actions').removeClass('current').find('ul').hide();
        $parent.addClass('current');
        if (!visible) {
            list.show();
        } else {
            list.hide();
            $parent.removeClass('current');
        }

        evt.preventDefault();
        evt.stopPropagation();
    });

    $('li.actions-list>ul').hide();

    $(document).click(function (evt) {
        $('li.actions-list').removeClass('current').find(' > ul').hide();
        var $target = $(evt.target);
        if (!$target.hasClass('colors-popup-wrap') && !$target.hasClass('open-color-selector') && !$target.parents('.colors-popup-wrap').length) {
            $('.colors-popup-wrap').animate({
                left: -($('.popup-bg').width() + 35)
            }, 'slow');
        }



    });
    var random_hits=Math.floor(Math.random() * 60)+60;
    var second_to_reload_session=1000*random_hits;

    $(document).on('mousemove keyup keydown keypress', function(e) {
        keepAlive();
    });

    function keepAlive() {
        var unix_time_now = Math.floor(Date.now() / 1000);
        if((owner_sess_request+15)<unix_time_now){
            owner_sess_request=unix_time_now;
        }else{
            return false;
        }
        // For IFrames
        if (typeof prefix == "undefined") {
            return false;
        }
        if (prefix == 'admin') {
            return false;
        }
        $.ajax({
            url: SITE_ROOT + '/' + prefix + '-sess.php',
            dataType: 'json',
            success: function (data) {
                if (!data.status) {
                    if (!$('#LoginBox').length) {
                        $('<div id="LoginBox"></div>').append($('<iframe></iframe>', {
                            frameBorder: 0,
                            border: 0,
                            style: 'border:none',
                            width: 400,
                            height: 250,
                            src: SITE_ROOT + 'login?box=1&expire=' + 1
                        })).lightbox_me({
                            closeClick: false,
                            closeEsc: false,
                            closeButton: false
                        });
                    }
                } else {
                    if ($('#LoginBox').length) {
                        removeModal($('#LoginBox'));
                        $('#LoginBox').remove();
                    }
                }

         //       setTimeout(keepAlive, second_to_reload_session);
            }
        });
        return true;
    }

   // setTimeout(keepAlive, second_to_reload_session);


    var tooltipElements = $('.tooltip');
    var tipsImage = $('<img>', {
        'src': '/css/images/question' + (IS_RTL ? '-ar' : '') + '.png',
        'class': 'tips-image'
    });

    tipsImage = '<a href="#" tabindex="-1"><img src="/css/images/question' + (IS_RTL ? '-ar' : '') + '.png" class="tips-image" /></a>'

    var tips = {};

    tooltipElements.append(tipsImage).each(function () {
        //		var parent = $(this);
        if ($(this).attr('title') != '') {
            $(this).data('title', this.title).removeAttr('title');
        }

        title = $(this).data('title');
        if (window.localStorage[title + '_' + SITE_LANG + '_' + JS_VERSION ]) {
            tips[title] = window.localStorage[title + '_' + SITE_LANG + '_' + JS_VERSION];
        } else {
            $.ajax({
                url: SITE_ROOT + 'tooltip/' + title,
                tmpStore: {
                    'name': title
                },
                success: function (data) {
                    if (window.localStorage) {
                        window.localStorage[this.tmpStore.name + '_' + SITE_LANG + '_' + JS_VERSION] = data;
                    }

                    tips[this.tmpStore.name] = data;
                }
            })
        }
    });

    //Tooltips section
    $('.tooltip a').tooltip({
        showURL: false,
        extraClass: "tooltip-box",
        id: IS_RTL ? 'Tooltip' : 'tooltip',
        top: 10,
        left: 10,
        bodyHandler: function () {
            var parent = $(this).parent();
            title = parent.data('title');

            // clear local storage for new js versions (for not loading to much data in local storage)
            if (window.localStorage['JS_VERSION'] != undefined) {
                window.localStorage['JS_VERSION'] = JS_VERSION;
            } else if (window.localStorage['JS_VERSION'] != JS_VERSION){
                window.localStorage.clear();
                window.localStorage['JS_VERSION'] = JS_VERSION;
            }

            var tip = '';
            if (window.localStorage[title + '_' + SITE_LANG + '_' + JS_VERSION] != undefined) {
                tip = window.localStorage[title + '_' + SITE_LANG + '_' + JS_VERSION];
            } else if (tips[title] != undefined) {
                tip = tips[title];
            }

            return '<div>' + tip + '</div>';
        }
    }).click(function () {
        $(this).mouseover();
        if ($('#tooltip').is(':visible'))
            $(this).mouseout();
        else
            $(this).mouseover();
        return false;
    });

});

function removeLoginBox() {
    removeModal($('#LoginBox'));
    $('#LoginBox').remove();
}


$(function () {
    $('#myModal').on('shown.bs.modal', function () {
        $('.modal-body').css('min-height', '352px');
        $('#myInput').focus();
        $('#contact_iframe').attr('src', '/owner/sites_enquiries/?box=1');
    })
});


// header scroll lib
!function (a) {
    a.fn.jPinning = function (b) {
        var c = {
                offset: !1, onPin: function () {
                }, onUnpin: function () {
                }
            }, d = a.extend({}, c, b), e = {lastScrollTop: 0, document: a(document), window: a(window), status: "pinned"},
            f = {nav: "pinning-nav", pinned: "pinned", unpinned: "unpinned", top: "pinning-top"}, g = {
                isUnpinned: function () {
                    return "unpinned" == e.status ? !0 : !1
                }, isPinned: function () {
                    return "pinned" == e.status ? !0 : !1
                }, prepare: function () {
                    e.target.addClass(f.nav), e.target.css("position", "fixed")
                }, pin: function () {
                    g.isUnpinned() && (e.status = "pinned", e.target.removeClass(f.unpinned).addClass(f.pinned), d.onPin.call(e.target))
                }, unpin: function () {
                    g.isPinned() && (e.status = "unpinned", e.target.removeClass(f.pinned).removeClass(f.top).addClass(f.unpinned), d.onUnpin.call(e.target))
                }, calcOffset: function (a) {
                    return "auto" == d.offset && (d.offset = e.target.outerHeight()), d.offset ? a > d.offset ? !0 : !1 : !0
                }, pinHandler: function () {
                    var a = e.window.scrollTop(), b = e.document.height() - e.window.height();
                    if (0 > a && (a = 0), a >= b && (a = b, e.lastScrollTop = a - 1), 0 == a && e.target.addClass(f.top), a <= e.lastScrollTop) g.pin(); else {
                        var c = g.calcOffset(a);
                        c && g.unpin()
                    }
                    e.lastScrollTop = a
                }
            };
        return this.each(function () {
            e.target = a(this), g.prepare(), a(window).on("scroll", g.pinHandler)
        })
    }
}(jQuery);

$(document).ready(function () {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.async = true;
    });
});

$(window).load(function () {
    var totalheight = $(window).height();
    var header = $('.header').outerHeight();
    var logoh = $('.logo').outerHeight();
    var navh = $('.main-nav').outerHeight();
    var primnav = $('.prim-nav').outerHeight();
    var triggernav = header + logoh + primnav;


    // $('.prim-nav').height(navh - logoh - 48);
    $('.prim-nav').height(navh - logoh);

});
$(document).ready(function () {
    //nav scroll size


    $(window).on("popstate", function () {
        var anchor = location.hash || $("a[data-toggle='tab']").first().attr("href");
        $("a[href='" + anchor + "']").tab("show");
    });
    $('.form-error').parents('.form-group').css({'margin-bottom': '40px'});


    // padding-offset
    var mainnavheight = $('.header').outerHeight();
    var pagesnavheight = $('.pages-head').outerHeight();
    $('.main-area').css('padding-top', (mainnavheight + pagesnavheight + 20));
    $('.side-nav,.inbox-listing').css('top', (mainnavheight + pagesnavheight));
    if ($(window).width() <= 767) {
        $('.main-area').css('margin-top', '50px');
        $('.main-area').css('padding-top', '0px');
        $('.B_clients_pay > ul li').css('margin-bottom', '15px');
    };
    if ($(window).width() < 768) {
        //header scroll
        $(function () {
            $('.header00').jPinning({});
            $('.pages-head00').jPinning({});
        });
    }
    ;
    //tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    // main menu
    var toggle = 0;

    if ($(window).width() > 1024) {
        $(function () {
            $('body').removeClass('collapse-sidebar');
            $('#shrink-sidebar').click(function () {
                $('body').toggleClass('ad1');
                $('body').toggleClass('shrinked-sidebar');
                $('.shrinked-sidebar .submenu').removeClass('show');
                $('.shrinked-sidebar .sub-menu-cont').hide();
                var menuClass = document.getElementsByTagName('body')[0].className;
                menuClass = menuClass.includes('ad1') ? 'ad1' : 'shrinked-sidebar';
                setCookie('menuClass', menuClass);
                // if ( toggle == 0 ){
                // 	ps.destroy();
                // 	toggle = 1 ;
                // }else {
                // 	ps = new PerfectScrollbar('.prim-nav');
                // 	toggle = 0 ;
                // }

            });
            // Code >>>>
            // //console.log($('head').find('link[href="/css/app_rtl.css?v=13"]').length > 0);
            //$('body').addClass('shrinked-sidebar')
            /*if($('head').find('link[href="/css/app_rtl.css?v=13"]').length > 0) {
                // for Arabic
                // when hover on bars icon then show the sidebar
                //$("#shrink-sidebar #main-nav").css({'right':0})

                $("#shrink-sidebar").mouseenter(function(e){
                    if(!$('body').hasClass('ad1'))
                    {
                        $('body').addClass('shrinked-sidebar');
                        $('#main-nav').css({
                            'right' : 0
                        })

                    }

                });
                // $("#main-nav").mouseleave(function(){

                // 		if($('body').hasClass('shrinked-sidebar'))
                // 		$('#main-nav').css('right','-210px')


                // });
            } else {
                // for English
                // $("#shrink-sidebar").mouseenter(function(){
                // 	$('body').addClass('shrinked-sidebar');
                // 	$('#main-nav').css('left',0)
                // });
                // $("#main-nav").mouseleave(function(){
                // 	$('#main-nav').css('left','-210px')
                // })


                $("#shrink-sidebar").mouseenter(function(e){
                    if(!$('body').hasClass('ad1'))
                    {
                        $('body').addClass('shrinked-sidebar');
                        $('#main-nav').css({
                            'left' : 0
                        })
                    }
                });
                // $("#main-nav").mouseleave(function(){
                // 	if($('body').hasClass('shrinked-sidebar'))
                // 		$('#main-nav').css('left','-210px')
                // });
            }*/

        });
    } else {
        $('body').addClass('collapse-sidebar');
        $('body').removeClass('shrinked-sidebar');
        $(function () {
            $('#shrink-sidebar').click(function () {
                $('body').toggleClass('collapse-sidebar visible-sidbar');

            });
        });

    }
});
$(document).ready(function () {
    if ($('body').hasClass('shrinked-sidebar')){
        $('.shrinked-sidebar .submenu').removeClass('show');
        $('.shrinked-sidebar .sub-menu-cont').hide();
    }
});
//main menu
/*
        $(window).resize(function () {
        //header scroll
        if ($(window).width() < 768) {
            //header scroll
            $(function(){
              $('.header00').jPinning({});
              $('.pages-head00').jPinning({});
            });
        };
         // padding-offset
        var mainnavheight  = $('.header').outerHeight();
        var pagesnavheight = $('.pages-head').outerHeight();
        $('.main-area').css('padding-top', (mainnavheight + pagesnavheight + 20));
        $('.side-nav').css('top', (mainnavheight + pagesnavheight));
            //nav scroll size
       var logoh = $('.logo').outerHeight();
            var navh = $('.main-nav').outerHeight();
            $('.prim-nav').height(navh - logoh);
            if ($(window).width() > 768) {
                $(function () {
                    $('body').removeClass('collapse-sidebar');
                    $('#shrink-sidebar').click(function () {
                        $('body').toggleClass('shrinked-sidebar');
                        $('.shrinked-sidebar .submenu').removeClass('show');
                    });
                });
            }
            else {
                $('body').addClass('collapse-sidebar');
                $('body').removeClass('shrinked-sidebar');
                $(function () {
                    $('#shrink-sidebar').click(function () {
                        $('body').toggleClass('collapse-sidebar visible-sidbar');

                    });
                });

            };
        });
*/