function getPlacementAnimate() {
    let sel1 = document.getElementById('id_gl_placement_from');
    let sel2 = document.getElementById('id_gl_placement_align');
    let sel3 = document.getElementById('id_gl_animate_enter');
    let sel4 = document.getElementById('id_gl_animate_exit');
    let sel5 = document.getElementById('id_allow_dismiss');
    let sel6 = document.getElementById('id_gl_newest_on_top');

    let placementFrom = sel1.options[sel1.selectedIndex].value;
    let placementAlign = sel2.options[sel2.selectedIndex].value;
    let animateEnter = sel3.options[sel3.selectedIndex].value;
    let animateExit = sel4.options[sel4.selectedIndex].value;
    $('#notify_message').remove();
    getDefaultNotify(placementFrom, placementAlign, animateEnter, animateExit, sel5.checked, sel6.checked);
}

function getNotifyTypes(element) {
    let selType = document.getElementById(element.id);
    let notifyType = selType.options[selType.selectedIndex].value;
    if (notifyType === '1' || notifyType === '3') {
        $('#marquee_message').html('');
        $("#div_id_gl_placement_from").removeClass('hidden');
        $("#div_id_gl_placement_align").removeClass('hidden');
        $("#div_id_gl_animate_enter").removeClass('hidden');
        $("#div_id_gl_animate_exit").removeClass('hidden');
        $("#div_id_allow_dismiss").removeClass('hidden');
        $("#div_id_gl_newest_on_top").removeClass('hidden');
        getPlacementAnimate();
        getNotificationData(notifyType);
    }
    if (notifyType === '2') {
        $('#notify_message').remove();
        addHiddenClass();
        $('#marquee_message').html('').html(marqueeMassage);
        getNotificationData(notifyType);
    }
}

function getNotificationData(type) {
    selectedNotifyUrl = '/NotificationsView/';
    $.ajax({
        url: selectedNotifyUrl,
        data: { 'type_id': type, },
        method: 'GET',
        success: function(data) {
            if (data.status === 0) {
                $(`input[type="checkbox"]`).prop('checked', false);
                let notify_data = JSON.parse(data.notification);
                if (notify_data.length !== 0) {
                    $.each(notify_data[0].fields, function(i, value) {
                        if (!$('#id_' + i).is(":checkbox")) {
                            $(`input[name="${i}"]`).val(value);
                        }
                        if ($('#id_' + i).is(":checkbox")) {
                            if (value === true) {
                                $(`input[name="${i}"][type="checkbox"]`).prop('checked', true);
                            } else {
                                $(`input[name="${i}"][type="checkbox"]`).prop('checked', false);
                            }
                        }

                        $(`select[name="${i}"]`).val(value);
                    });
                }
            }
            if (data.status === 2) {
                alert_message(data.message, 'warning');
            }

        },
        error: function(data) {}
    })
}


function getDefaultNotify(placementFrom, placementAlign, animateEnter, animateExit, allowDismiss, newestOnTop) {
    if (placementFrom === "---------") {
        placementFrom = "top";
    }
    if (placementAlign === "---------") {
        placementAlign = "right";
    }
    if (animateEnter === "---------") {
        animateEnter = "fadeInRight";
    }
    if (animateExit === "---------") {
        animateExit = "fadeOutRight";
    }
    $.notify({
        // options
        icon: 'fa fa-info',
        title: '<strong>Information! </strong>',
        message: "Message Test",
        target: '_blank'
    }, {
        // settings
        element: 'body',
        position: null,
        type: 'info',
        allow_dismiss: allowDismiss,
        newest_on_top: newestOnTop,
        showProgressbar: false,
        placement: {
            from: placementFrom,
            align: placementAlign
        },
        offset: 20,
        spacing: 10,
        z_index: 2000,
        delay: 6000,
        timer: 500,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: "animated " + animateEnter,
            exit: "animated " + animateExit
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template: '<div data-notify="container" id="notify_message" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">??</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '</div>'

    });
}

function addHiddenClass() {
    $("#div_id_gl_placement_from").addClass('hidden');
    $("#div_id_gl_placement_align").addClass('hidden');
    $("#div_id_gl_animate_enter").addClass('hidden');
    $("#div_id_gl_animate_exit").addClass('hidden');
    $("#div_id_allow_dismiss").addClass('hidden');
    $("#div_id_gl_newest_on_top").addClass('hidden');
}

function checkAllDays(element) {
    let days = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
    if (element.checked) {
        for (let i = 0; i < days.length; i++) {
            $(`input[name="${days[i]}"][type="checkbox"]`).val(true).prop('checked', true).attr('disabled', true);
        }
    }
    if (!element.checked) {
        for (let i = 0; i < days.length; i++) {
            $(`input[name="${days[i]}"][type="checkbox"]`).val(false).prop('checked', false).attr('disabled', false);
        }
    }
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(x) {
    return !!(x % 1);
}

// function isFloat(n){
//     return n !== "" && !isNaN(n) && Math.round(n) !== n;
// }

function checkValidNumber(element) {
    if (element.id === 'id_hours_to_notify') {
        if (element.value < 0) {
            alert('Number of hour can not be less than 0')
            $(`#${element.id}`).val(1);
        }
        if (element.value > 5) {
            alert('Number of hour can not be more than 5')
            $(`#${element.id}`).val(1);
        }

        if (isFloat(element.value)) {
            alert('Number of hour can not be float')
            $(`#${element.id}`).val(parseInt(element.value));
        }
    }
    if (element.id === 'id_num_of_messages') {
        if (element.value < 0) {
            alert('Number of messages can not be less than 0')
            $(`#${element.id}`).val(1);
        }
        if (element.value > 3) {
            alert('Number of messages can not be more than 3')
            $(`#${element.id}`).val(1);
        }
        if (isFloat(element.value)) {
            alert('Number of messages can not be float')
            $(`#${element.id}`).val(parseInt(element.value));
        }
    }
    if (element.id === 'id_every_seconds') {
        if (element.value < 0) {
            alert('Number of seconds can not be less than 0')
            $(`#${element.id}`).val(1);
        }
        if (element.value > 59) {
            alert('Number of seconds can not be more than 59')
            $(`#${element.id}`).val(1);
        }
        if (isFloat(element.value)) {
            alert('Number of seconds can not be float')
            $(`#${element.id}`).val(parseInt(element.value));
        }
    }
}

$(document).ready(function() {
    $('[data-tooltip="tooltip"]').tooltip();

    let notify_form_id = '#form-id-notify';
    $(document).on('submit', notify_form_id, function(e) {
        $('#notification-submit-button').button('loading');
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            data: "form_id=notify&" + $(this).serialize(),
            method: 'post',
            success: function(data) {
                if (data.status === 1) {
                    alert_message(data.message.message, data.message.class);
                    $(`.clear-this`).val('');
                    $('#notification-submit-button').button('reset');
                } else if (data.status === 2) {
                    alert_message(data.message.message, data.message.class);
                    $('#notification-submit-button').button('reset');
                } else if (data.status === 0) {
                    let error = JSON.parse(data.error);
                    console.log(error);
                    $.each(error, function(i, value) {
                        alert_message(String(data.message), 'alert alert-warning', 'fa fa-times');
                        let div = '<span class="text-danger">';
                        $.each(value, function(j, message) {
                            div += `- ${message.message}<br>`;
                        });
                        $(`#div_id_${i}`).append(div);
                    });
                    $('#notification-submit-button').button('reset');
                }
            },
            error: function(data) {}
        });
    });
});