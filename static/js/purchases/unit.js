//  $(document).ready(function(){

//     let form_id='#form-id';
//     $(document).on('submit',form_id,function(e){
//         // alert('test');
//         e.preventDefault();
//         $.ajax({
//                 url: $(this).attr('action'),
//                 data: $(this).serialize(),
//                 method: 'post',
//                 success: function (data) {
//                   
//                     $('span[class="text-danger"]').remove();
//                     if(data.status==1){
//                         $(form_id)[0].reset();
//                         alert_message(data.message.message,data.message.class);
//                         $('#modalLRForm').modal('hide');
//                         table.ajax.reload();
//                     }
//                     else if(data.status==2){
//                         alert_message(data.message.message,data.message.class);
//                     }
//                     else if(data.status==0){
//                         let error=JSON.parse(data.error);
//                         $.each(error,function(i,value){
//                             let div='<span class="text-danger">';
//                             $.each(value,function(j,message){
//                                 div+=`- ${message.message}<br>`;
//                             });
//                             $(`#div_id_${i}`).append(div);
//                         });
//                     }
//                     $('#submit-button').button('reset');

//                 },
//                 error:function(data){

//                 }
//             });
//     });


// $(document).on('click','.edit_row',function(){
// //    alert('test');
//     let id_row=$(this).data('id');
//     alert(id_row);
//     $.ajax({
//         url: $(this).data('url'),
//         data: {'id':id_row,},
//         method: 'get',
//         success: function (data) {
//             alert(data.status);
//             if(data.status==1){
//                 alert(resp);
//                 let resp=JSON.parse(data.data);
//                 $(`input[name="id"]`).val(resp[0].pk);
//                 $.each(resp[0].fields,function(i,value){
//                     $(`input[name="${i}"]`).val(value);
//                     $(`input[name=${i}]`).prop('checked',value);
//                     $(`textarea[name=${i}]`).text(value);
//                      alert("Ahmed");
//                     $(`select[name="${i}"] option`).each(function() {
//                         if($(this).val() == value) {
//                             $(this).prop("selected", true);
//                         }
//                     });
//                     $('#modalLRForm').modal('show');
//                 });
//             }
//         },
//         error:function(data){
//         }
//     });
// });

// $(document).on('click','.delete_row',function(){

//     alert('test');
//     if(confirm_delete()){

//     let id_row=$(this).data('id');

//     $.ajax({

//         url: $(this).data('url'),
//         data: {
//             'id':id_row,
//         },
//         method: 'DELETE',
//         beforeSend: function (xhr) {
//                 xhr.setRequestHeader("X-CSRFToken",csrf);
//             },
//         success: function (data) {
//             if(data.status==1){
//                 alert_message(data.message.message,data.message.class);
//                 table.ajax.reload();
//             }
//         },
//         error:function(data){
//         }
//     });
// }
// });
// });

// ---------------------------------
//-------------------------


//  $(document).ready(function(){
let form_id = '#form-id';
$(document).on('submit', form_id, function(e) {
    $('#submit-button').button('loading');
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        data: $(this).serialize(),
        method: 'post',
        success: function(data) {
            $('span[class="text-danger"]').remove();
            if (data.status == 1) {
                $(form_id)[0].reset();
                alert_message(data.message.message, data.message.class);
                $('#modalLRForm').modal('hide');
                table.ajax.reload();
            } else if (data.status == 2) {
                alert_message(data.message.message, data.message.class);
            } else if (data.status == 0) {
                let error = JSON.parse(data.error);
                $.each(error, function(i, value) {
                    let div = '<span class="text-danger">';
                    $.each(value, function(j, message) {
                        div += `- ${message.message}<br>`;
                    });
                    $(`#div_id_${i}`).append(div);
                });
            }
            $('#submit-button').button('reset');
        },
        error: function(data) {

        }
    });
});
$(document).on('click', '.edit_row', function() {

    let id_row = $(this).data('id');
    $.ajax({
        url: $(this).data('url'),
        data: { 'id': id_row, },
        method: 'get',
        success: function(data) {
            let resp = JSON.parse(data.data);
            if (data.status == 1) {

                $(`input[name="id"]`).val(resp[0].pk);
                $.each(resp[0].fields, function(i, value) {
                    $(`input[name="${i}"]`).val(value);
                    $(`select[name="${i}"] option[value="${value}"]`).attr('selected', 'selected');
                    $('#modalLRForm').modal('show');
                });
            }
        },
        error: function(data) {}
    });
});

$(document).on('click', '.delete_row', function() {

    if (confirm_delete()) {
        let id_row = $(this).data('id');
        $.ajax({
            url: $(this).data('url'),
            data: {
                'id': id_row,
            },
            method: 'DELETE',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrf);
            },
            success: function(data) {

                if (data.status == 1) {
                    alert_message(data.message.message, data.message.class);
                    table.ajax.reload();
                }

            },
            error: function(data) {}
        });
    }
});
// });


function deleteForm(btn, prefix) {
    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (formCount > 1) {
        // Delete the item/form
        var goto_id = $(btn).find('input').val();
        if (goto_id) {
            $.ajax({
                url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
                error: function() {
                    console.log("error");
                },
                success: function(data) {
                    $(btn).parents('.item').remove();
                },
                type: 'GET'
            });
        } else {
            $(btn).parents('.item').remove();
        }

        var forms = $('.item'); // Get all the forms
        // Update the total number of forms (1 less than before)
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        var i = 0;
        // Go through the forms and set their indices, names and IDs
        for (formCount = forms.length; i < formCount; i++) {
            $(forms.get(i)).find('.formset-field').each(function() {
                updateElementIndex(this, prefix, i);
            });
        }
    } // End if

    return false;
}

$("body").on('click', '.remove-form-row', function() {
    deleteForm($(this), String($('.add-form-row').attr('id')));
});

$("body").on('click', '.add-form-row', function() {
    return addForm($(this), String($(this).attr('id')));
});