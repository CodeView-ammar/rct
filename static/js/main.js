         // function for alert message
         // $("select").select2();
         var notifyType = '1';
         var sysnotification_variables = [{
             "saturday": false,
             "sunday": false,
             "monday": false,
             "tuesday": false,
             "wednesday": false,
             "thursday": false,
             "friday": false,
             "all_days": true,
             "hours_to_notify": 0,
             "notify_type": "1",
             "num_of_messages": 0,
             "every_seconds": 0,
             "gl_placement_from": "top",
             "gl_placement_align": "right",
             "gl_animate_enter": "fadeInRight",
             "gl_animate_exit": "fadeOutRight",
             "allow_dismiss": true,
             "gl_newest_on_top": true
         }];
         var custnotification_variables = [{
             "saturday": false,
             "sunday": false,
             "monday": false,
             "tuesday": false,
             "wednesday": false,
             "thursday": false,
             "friday": false,
             "all_days": true,
             "hours_to_notify": 1,
             "notify_type": "3",
             "num_of_messages": 0,
             "every_seconds": 0,
             "gl_placement_from": "top",
             "gl_placement_align": "right",
             "gl_animate_enter": "fadeInRight",
             "gl_animate_exit": "fadeOutRight",
             "allow_dismiss": true,
             "gl_newest_on_top": true
         }];

         function confirmOperation(operationObj, onConfirm = function() {}, onCancel = function() {}) {
             if (operationObj.type == 'go') {
                 if (operationObj.title_message == undefined)
                     operationObj.title_message = ('تأكيد العملية!');
                 if (operationObj.message == undefined)
                     operationObj.message = "هل تريد المتابعة؟"
                 buttons = {
                     Go: {
                         text: 'الذهاب',
                         btnClass: 'btn-info',
                         action: function() {
                             window.open(href = operationObj.url + '?noSide=true', '', 'height=500,width=800,resizable=yes,scrollbars=yes');
                         }
                     },
                     close: {
                         text: 'تراجع',
                         action: function() {
                             onCancel();
                         }
                     }
                 }
             } else if (operationObj.type == 'delete') {
                 if (operationObj.title_message == undefined)
                     operationObj.title_message = ('تأكيد العملية!');
                 if (operationObj.message == undefined)
                     operationObj.message = "هل تريد المتابعة؟"
                 operationObj.class = 'danger'
                 buttons = {
                     confirm: {
                         text: 'حذف',
                         btnClass: 'btn-danger',
                         action: function() {
                             onConfirm();
                         }
                     },
                     close: {
                         text: 'تراجع',
                         action: function() {
                             onCancel();
                         }
                     }


                 }
             } else if (operationObj.type == 'note') {
                 if (operationObj.title_message == undefined)
                     operationObj.title_message = ('تأكيد العملية!');
                 buttons = {
                     close: function() {
                         onCancel();
                     }
                 }

             }
             if (operationObj.size == undefined)
                 modalSize = 4;
             else
                 modalSize = operationObj.size
             classes = { 'info': 'blue', 'success': 'green', 'warning': 'orange', 'danger': 'red' }
             iconsMap = { 'info': 'fa fa-info', 'success': 'fa fa-check', 'warning': 'fa fa-exclamation-triangle', 'danger': 'fa fa-exclamation-triangle' }
             icons = (operationObj.icon) ? operationObj.icon : iconsMap[operationObj.class];
             $.confirm({
                 title: operationObj.title_message,
                 titleClass: 'text-' + operationObj.class,
                 type: classes[operationObj.class],
                 draggable: true,
                 content: operationObj.message,
                 buttons: buttons,
                 icon: icons,
                 rtl: true,
                 container: 'body',
                 containerFluid: false,
                 backgroundDismiss: false,
                 autoClose: false,
                 columnClass: `col-lg-3 col-md-4 col-sm-6 `,
                 onContentReady: function() {},
                 onOpenBefore: function() {},
                 onOpen: function() {},
                 onClose: function() {},
                 onDestroy: function() {},
                 onAction: function() {}
             });

         }

         function getNotificationValues() {

             let notifyUrl = '/get_notification_variables/';
             $.ajax({
                 url: notifyUrl,
                 method: 'GET',
                 success: function(data) {
                     if (data.status === 0) {
                         if (data['notification_data'].length > 0) {
                             if (data['notification_data'].length > 1) {
                                 sysnotification_variables = data['notification_data'][0];
                                 custnotification_variables = data['notification_data'][1];

                             } else if (data['notification_data'].length === 1) {
                                 if (data['notification_data'][0].notify_type === '1' || data['notification_data'][0].notify_type === '4') {
                                     sysnotification_variables = data['notification_data'][0];
                                     notifyType = data['notification_data'][0]['notify_type'];
                                 }
                                 if (data['notification_data'][0].notify_type === '2' || data['notification_data'][0].notify_type === '3') {
                                     custnotification_variables = data['notification_data'][0];
                                     notifyType = data['notification_data'][0]['notify_type'];
                                 }
                             }
                         }
                     }
                 },
                 error: function(data) {}
             });
         }

         function alert_message(msg = " ", class_name = 'alert alert-success', icon = '', type = 'normal', ind = 1) {
             // function alert_message(msg = " ", class_name = 'alert alert-success', icon = '', type = 'operations', ind = 1) {
             // alert('Afeef')
             // getNotificationValues();
             if (ind !== 1) {
                 mymodal(msg, 'message', class_name.substr(class_name.lastIndexOf('-') + 1, class_name.length - 1));
                 $('.modal-backdrop').remove();
             } else if (notifyType === '1') {
                 let first_msg = '';
                 let first_type = '';
                 if (type === 'operations') {
                     first_msg = 'Operation is on Progress ...';
                     first_type = 'info';
                 } else if (type === 'normal') {
                     first_msg = msg;
                     first_type = class_name;
                 }

                 let notify = $.notify({
                     // options
                     icon: 'fa fa-info',
                     title: Informations,
                     message: first_msg,
                     target: '_blank'
                 }, {
                     // settings
                     element: 'body',
                     position: null,
                     type: first_type,
                     allow_dismiss: sysnotification_variables['allow_dismiss'],
                     newest_on_top: sysnotification_variables['gl_newest_on_top'],
                     showProgressbar: false,
                     placement: {
                         from: sysnotification_variables['gl_placement_from'],
                         align: sysnotification_variables['gl_placement_align']
                     },
                     offset: 20,
                     spacing: 10,
                     z_index: 2000,
                     delay: 6000,
                     timer: 500,
                     url_target: '_blank',
                     mouse_over: null,
                     animate: {
                         enter: "animated " + sysnotification_variables['gl_animate_enter'],
                         exit: "animated " + sysnotification_variables['gl_animate_exit']
                     },
                     onShow: null,
                     onShown: null,
                     onClose: null,
                     onClosed: null,
                     icon_type: 'class',
                     template: '<div data-notify="container" id="notify_message" class="col-xs-11 col-sm-3 alert alert-{0}" style="width: auto" role="alert">' +
                         '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                         '<span data-notify="icon"></span> ' +
                         '<span data-notify="title">{1}</span> ' +
                         '<span data-notify="message">{2}</span>' +
                         '</div>'

                 });
                 if (type === 'operations') {
                     setTimeout(function() {
                         notify.update('title', '<strong>Information! </strong>', );
                         notify.update('message', msg);
                         notify.update('icon', icon);
                         notify.update('type', class_name);
                     }, 1000);
                 }

             } else if (notifyType === '4') {
                 let type = class_name.split('-')[1];
                 if (type === 'danger') {
                     type = 'error';
                 }
                 Lobibox.alert(type, {
                     title: '<strong>Information! </strong>',
                     delay: 15000,
                     showClass: sysnotification_variables['gl_animate_enter'],
                     hideClass: sysnotification_variables['gl_animate_exit'],
                     msg: msg
                 });
             }
         }

         function getNotificationValues() {

             let notifyUrl = '/get_notification_variables/';
             $.ajax({
                 url: notifyUrl,
                 method: 'GET',
                 success: function(data) {
                     if (data.status === 0) {
                         if (data['notification_data'].length > 0) {
                             if (data['notification_data'].length > 1) {
                                 sysnotification_variables = data['notification_data'][0];
                                 custnotification_variables = data['notification_data'][1];

                             } else if (data['notification_data'].length === 1) {
                                 if (data['notification_data'][0].notify_type === '1' || data['notification_data'][0].notify_type === '4') {
                                     sysnotification_variables = data['notification_data'][0];
                                     notifyType = data['notification_data'][0]['notify_type'];
                                 }
                                 if (data['notification_data'][0].notify_type === '2' || data['notification_data'][0].notify_type === '3') {
                                     custnotification_variables = data['notification_data'][0];
                                     notifyType = data['notification_data'][0]['notify_type'];
                                 }
                             }
                         }
                     }
                 },
                 error: function(data) {}
             });
         }

         function remove_option_outcomplate(id) {
             $(id).each(function() {
                 if ($(this).attr('readonly') === 'readonly') {
                     $(this).children().css('display', 'none')
                 } else {
                     $(this).css('display', 'none')
                 }
                 $(this).removeClass('select2-hidden-accessible');
             });
         }

         // $('[data-mask]').inputmask();

         function addScreenUrl(url) {
             if (!url.startsWith("#")) {
                 $.ajax({
                     url: '/HelperOperations/',
                     data: {
                         'screen_url': url,
                     },
                     method: 'get',
                     success: function(data) {
                         let dat = eval(data)
                         let url = window.location.href.split('/');
                         let port = url[2];
                         $('#help_redirect').html(`<a href="http://${port}/admin/system_help/helpurl/${dat[0]}/change/" target="_blank"><i class="fa fa-edit"></i></a>`);
                         if (dat[1]) {
                             $('#help_url_checker').removeClass('hide');
                         }
                     },
                     error: function(data) {}
                 });
             }
         }

         function print_custom(report_name, model_name, id) {
             $('.large-title').html('<h1>' + $('.titlefix').text() + '</h1>');
             mymodal("", "print", function() {
                 $.ajax({
                     url: '/custom_printer',
                     data: 'report_name=' + report_name + '&model_name=' + model_name + '&id=' + id + '&csrfmiddlewaretoken=' + $('input[name="csrfmiddlewaretoken"]').val(),
                     method: 'POST',
                     success: function(data_income) {
                         data = '<html>' + $('.header_style').html() + $('.header_footer_style').html() + $('.mystyle').html() + '<body>';
                         data = data + '<div class="report_data">' + $('.header').html() + '<div class="block" style="text-align: center; margin: 4px !important;">' + data_income + '</div>' + $('.footer').html() + '</div>';
                         data = data + '</body></html>'
                         x = window.open('printing', 'PRINT');
                         x.document.write(data);
                         x.focus();
                         a = setTimeout(function() {
                                 x.print();

                                 x.close();
                             }, 100) // necessary for IE >= 10*/
                     }
                 });
             })

         }

         $(function() {
             $(document).trigger('readyAgain');

             $(".extendable").click(function() {
                 if ($("#contentMain .external-content").length > 0) {
                     $(".external-content").remove();
                 }
                 $("#contentMain").append($(`<div class="external-content"></div>`)).load($(this).attr('href') + "#content_append");
                 return false;
             })


         })

         function loadPage() {
             $('.treeview-menu ul a').click(function(e) {

                 // e.preventDefault();
                 let newPageUrl = $(this).attr('href')
                 $(function() {
                     $("#main-content-to-append").append($(`<div class="external-content"></div>`)).load(newPageUrl + "#content_append");

                     return false
                 })

                 // $('#main-content-to-append').html('').load(newPageUrl);
                 //     $.ajax({
                 //         method: 'GET',
                 //         url: newPageUrl,
                 //         data: '',
                 //         success: function (response) {
                 //             $('#style-base').html($(response).find('#style-main').html());
                 //             $('#stylejs-base').html($(response).find('#stylejs-main').html());
                 //             $('#main-wrapper-base').html($(response).find('#main-wrapper').html());
                 //             $(document).trigger('readyAgain');
                 //         },
                 //         error: function (response) {
                 //             alert(response["responseJSON"]["error"]);
                 //         }
                 //     })
             })
         }

         function addBreadCrumb() {
             $('.treeview-menu li a').click(function(e) {
                 // e.preventDefault();
                 let element = $('<li class="item"></li>');
                 $(this).parents('li').each(function(n, li) {
                     let anc = $(li).children('a').clone();
                     element.prepend(' >> ', anc);
                 });

                 let bb = element.prepend('<a onclick="clearBread()" href="/">Dashboard</a>');
                 bb.find('i').replaceWith('');
                 localStorage.setItem('breadcrumb', bb.html());
             })
         }

         function clearBread() {
             localStorage.setItem('breadcrumb', '<a onclick="clearBread()" href="/">Dashboard</a>');
         }

         function getHelpData() {
             let url = window.location.href.split('/');
             let screen_url_data = url[url.length - 1];
             if (screen_url_data === "") {
                 screen_url_data = url[url.length - 2]

             }

             $.ajax({
                 url: '/HelperDataOperations/',
                 data: {
                     'screen_url_data': screen_url_data,
                 },
                 method: 'get',
                 success: function(data) {

                     let content = `<div class="panel-group">`;
                     let mediaUrl = data.pop();
                     $.each(data, function(index, value) {
                         let caption = value['parent']['image_caption'];
                         if (caption === null || caption === '') {
                             caption = '';
                         }
                         content = content + `
    <div class="panel panel-default">
      <div class="panel-heading">${value['parent']['title']}</div>
      <div class="panel-body mb-0">${value['parent']['content']}</div>`;
                         if (value['parent']['image'] !== '' && value['parent']['image'] !== null) {
                             content = content + `<div class="thumbnail mt-0 mb-3 ml-4 mr-4">
          <img src="${mediaUrl['media_url']}${value['parent']['image']}" alt="" style="width:100%">`;
                             if (caption !== '') {
                                 content = content + `<div class="caption">
            <p>${caption}</p>
          </div>`
                             }
                             content = content + `</a></div>`
                         }
                         $.each(value['children'], function(ind, val) {
                             let messAlert = '';
                             let messIcon = '';
                             if (val['icon'] === '1') {
                                 messAlert = 'success';
                                 messIcon = 'fas fa-check-double';
                             } else if (val['icon'] === '2') {
                                 messAlert = 'info';
                                 messIcon = 'fas fa-info-circle';
                             } else if (val['icon'] === '3') {
                                 messAlert = 'warning';
                                 messIcon = 'fas fa-exclamation-triangle';
                             } else if (val['icon'] === '4') {
                                 messAlert = 'danger';
                                 messIcon = 'fas fa-radiation-alt';
                             }
                             content = content + `<div class="alert alert-${messAlert} ml-4 mr-4 mt-0 mb-3"" role="alert" style="padding: 7px;">
                          <h5 class="alert-heading text-bold"><i class="${messIcon}"></i> ${val['title']}</h5>
                          <hr>
                          <div class="mb-0" style="padding:0px 10px 0px 10px ">${val['content']}</div>
                        </div>`
                         });
                         content = content + `</div>`;
                     });
                     content = content + `</div>`;
                     $('#help_data_body').html(content);
                 },
                 error: function(data) {}
             });
         }

         $(document).on('ready', function() {
             // loadPage();
             addBreadCrumb();
             let path = localStorage.getItem('breadcrumb');
             if (path !== "") {
                 $('.breadcrumb-path').html(path);
             }

             $(function() {
                 $('.main-sidebar').overlayScrollbars({});
                 $('.table-responsive').overlayScrollbars({});
             });
             $(document).on("wheel", "input[type=number]", function(e) {
                 $(this).blur();
             });
             $(document).ready(function() {
                 $("input[type=number]").on("focus", function() {
                     $(this).on("keydown", function(event) {
                         if (event.keyCode === 38 || event.keyCode === 40) {
                             event.preventDefault();
                         }
                     });
                 });
             });
             getNotificationValues();
             let url = window.location.href.split('/');
             let url_sender = url[url.length - 1];
             if (url_sender === "") {
                 url_sender = url[url.length - 2];
             }

             $(".dropdown_select").on('hidden.bs.dropdown', function() {
                 if ($(this).attr("keep-open") === "true") {
                     $(this).addClass("open");
                     $(this).removeAttr("keep-open");
                 }
             });
             $(document).on("wheel", "input[type=number]", function(e) {
                 $(this).blur();
             });
             $(document).ready(function() {
                 $("input[type=number]").on("focus", function() {
                     $(this).on("keydown", function(event) {
                         if (event.keyCode === 38 || event.keyCode === 40) {
                             event.preventDefault();
                         }
                     });
                 });
             });
             $(".dropdown_select ul li").bind("click", function(e) {
                 $(".dropdown_select").attr("keep-open", true);
             });

             addScreenUrl(url_sender);
             $('select[required]').siblings('span').children().children().css('background-color', '#fff9ec !important');

         });