
         function updateElementFormset(el, prefix, ndx) {
             var id_regex = new RegExp('(' + prefix + '-\\d+-)');
             var replacement = prefix + '-' + ndx + '-';
             if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
                replacement));
                if (el.id) el.id = el.id.replace(id_regex, replacement);
                if (el.name) el.name = el.name.replace(id_regex, replacement);
            }
            
            
            function deleteFormset(btn, prefix) {
                var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
                if (formCount > 1) {
                    // Delete the item/form
                    $(btn).parents('.item').remove();
                    var forms = $('.item'); // Get all the forms
                    // Update the total number of forms (1 less than before)
                    $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                    var i = 0;
                    // Go through the forms and set their indices, names and IDs
                    for (formCount = forms.length; i < formCount; i++) {
                        $(forms.get(i)).find('.formset-field').each(function () {
                            $(forms.get(i)).find('.td_id').text(i + 1);
                            updateElementFormset(this, prefix, i);
                        });
                    }
                } // End if
                
                return false;
            }
            
            
            $(document).ready(function () {
                let prefix = String($(".add-form-row").attr('id'));
                let num = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
                for (let index = 0; index < num; index++) {
                    $('#id_' + prefix + '-' + index + '-unit').html('');
                }
                // using jQuery
                let form_id = '#myform';
                $(document).on('submit', form_id, function (e) {
                
                    e.preventDefault();
                    var openstore = $(this).serialize();
                    $.ajax({
                        type: "POST",
                        url: $(this).attr('action'),
                        data: openstore,
                        success: function (response) {
                            if (response.status == 1) {
                                
                                alert_message(response.message.message);
                                clear();
                                table.ajax.reload();
                                print_custom("Opening Store Report", "openingstore", data.id);
                            
                            }
                            else if (response.status == 0) {
                                if (response.message != 'base') {
                                    alert_message(response.message.message, response.message.class);
                                }
                                let row_id = response.error.form_id;
                                let error = JSON.parse(response.error.error);
                                $.each(error, function (i, value) {
                                    let div = '<span class="text-danger">';
                                    $.each(value, function (j, message) {
                                        div += `- ${message.message}<br>`;
                                    });
                                    $(`#id_${row_id}-${i}`).parent().append(div);
                                    $(`#div_id_${i}`).append(div);
                                });
                            }
                            else if (response.status == 2) {
                                alert_message(response.message.message, response.message.class);
                                table.ajax.reload();
                            }
                            
                            // $('#myform')[0].reset();
                            
                            
                            
                        },
                        error: function (response) {
                            alert("error");
                        }
                    });
                });
                
                $(document).on('change', ".items_val", function () {
                    
                    /* founction Fetch the units related to the item
                    The initial cost of an item
                    Show an indication that the item has a termination date or not
                    */
                   var id = $(this).attr('id');
                   var x = id.split('-');
                   let prefix = String($(".add-form-row").attr('id'));
                   $('#id_' + prefix + '-' + x[1] + '-initial_cost').html("");
                   // get the url of the `load_cities` view
                   var items = $(this).val(); // get the selected country ID from
                   $.ajax({
                       
                       method: "post", // initialize an AJAX request
                       url: load_openning_store_unit_cost,
                       
                       data: {
                           'items': items,
                           'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        },
                        success: function (data) {
                            $('#id_' + prefix + '-' + x[1] + '-unit').html('');
                            $('#id_' + prefix + '-' + x[1] + '-initial_cost').val("");
                            if (data.status == 1) {
                                let data_unit = data.data_unit;
                                let option = `<option vaule=""  data-package="">-----</option>`;
                                $.each(data_unit, function (i, j) {
                                    option += `<option  data-package="${j.itemunit__package}" value="${j.id}">${j.name_ar}</option>`;
                                });
                                $('#id_' + prefix + '-' + x[1] + '-unit').append(option)
                                // `data` is the return of the `load_cities` view function
                            }
                        }
                    });
                    
                    $.ajax({
                        method: "post", // initialize an AJAX request
                        url: valid_item_expire_date_income,
                        
                        data: {
                            'items': items,
                            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        },
                        success: function (data, status) {
                            var option;
                            $.each(data, function (index, itemData) {
                                if (data.use_expir_date == true) {
                                    $('#id_' + prefix + '-' + x[1] + '-expire_date').attr('required', true);
                                    $('#id_' + prefix + '-' + x[1] + '-expire_date').removeAttr('readonly');
                                } else {
                                    $('#id_' + prefix + '-' + x[1] + '-expire_date').attr('readonly', 'readonly');
                                    $('#id_' + prefix + '-' + x[1] + '-expire_date').removeAttr('required');
                                }
                                
                            });
                            
                        }
                    });
                    
                });
                $(document).on('change', ".unit_val", function () {
                    let prefix = String($(".add-form-row").attr('id'));
                    let id = $(this).attr('id');
                    let x = id.split('-');
                    // let initial_cost = $('#id_' + prefix + '-' + x[1] + '-initial_cost').val();
                    let items = $('#id_' + prefix + '-' + x[1] + '-item').val();
                    let value = 0;
                    let package = $('#id_' + prefix + '-' + x[1] + '-unit').children('option:selected').data('package');
                    $.ajax({
                        
                        method: "POST", // initialize an AJAX request
                        url: load_initial_cost,
                        
                        data: {
                            'items': items,
                            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                        },
                        success: function (data, status) {
                            
                            var option;
                            $.each(data, function (index, itemData) {
                                option = itemData;
                            });
                            $('#id_' + prefix + '-' + x[1] + '-initial_cost').val(option);
                            if (isNaN(option)) { option = 0; }
                            if (!isNaN(package)) {
                                value = parseFloat(package) * parseFloat(option)
                            }
                            $('#id_' + prefix + '-' + x[1] + '-initial_cost').val(value);
                        }
                    });
                    
                });
                
                $(document).on('change', ".store_val", function () {
                    let prefix = String($(".add-form-row").attr('id'));
                    let id = $(this).attr('id');
                    let x = id.split('-');
                    let items = $('#id_' + prefix + '-' + x[1] + '-item').val();
                    let store = $('#id_' + prefix + '-' + x[1] + '-store').val();
              
                
                $.ajax({
                    method: "post", // initialize an AJAX request
                    url: url_check_opening_stock,
                    
                    data: {
                        'item': items,
                        'store': store,
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
                    },
                    success: function (data, status) {
                        if (data.status == 0) {
                            alert_message(data.message.message, data.message.class);
                            $("#"+id).find('option').filter(function() {
                                return $(this).val() === '';
                            }).prop('selected', true);

                        }
                       
                        
                    }
                });
            });
function clear(){

    $('#myform')[0].reset();
    var rowsToRemove = $('#tblProducts tr:not(:first)');
  
    // إزالة صفوف الـ formset المحددة
    rowsToRemove.remove();
    $('.items_val').children('option').remove();
}
$('#clear').on("click", function () {
    clear()
});

// var table = $('#control-formset');
  
// // إضافة صف جديد عند الوصول إلى الحقل الذي يسبق الحقل الأخير والنقر على زر Tab
// table.on('keydown', '.initial_cost_val', function(e) {
//     if (e.which === 9 && $(this).is(':focus')) { // التحقق من أن الزر المضغوط هو Tab والحقل محدد
//         $('.add-form-row').trigger('click');  

//         var currentIndex = $(".formset-field").index(this); // الحصول على مؤشر الحقل الحالي
//       var nextIndex = currentIndex + 1; // حساب مؤشر الحقل التالي

//       if (nextIndex >= $(".formset-field").length) { // التحقق من أنه لا يوجد حقول إضافية
//         nextIndex = 0; // الانتقال إلى أول حقل إجباري
//       }

//       var nextField = $(".formset-field").eq(nextIndex); // الحصول على الحقل التالي
//       nextField.focus(); // التركيز على الحقل التالي
//       e.preventDefault(); // منع التنقل الافتراضي للزر Tab
      
//     }
//   });
  

  addRowOnTabInTable('#control-formset', '.initial_cost_val','.add-form-row');




//   options = [];

  // create an array of select options for a lookup
//   $('.custom-select option').each(function(idx) {
//       options.push({id: $(this).val(), text: $(this).text()});
//   });
  

//   $("select").select2({
//     tags: "true",
//     placeholder: "اختر",
//     allowClear: true,
//     createTag: function (params) {
//       var term = $.trim(params.term);
  
//       if (term === '') {
//         return null;
//       }
      
//       // check whether the term matches an id
//       var search = $.grep(options, function( n, i ) {
//         return ( n.id === term || n.text === term); // check against id and text
//       });
      
//       // if a match is found replace the term with the options' text
//       if (search.length) 
//         term = search[0].text;
//       else
//         return null; // didn't match id or text value so don't add it to selection
      
//       return {
//        id: term,
//        text: term,
//        value: true // add additional parameters
//       }
//     }
//   });
  
//   $('select').on('select2:select', function (evt) {
    //console.log(evt);
    //return false;
//   });
             
                $(document).on('click', '.delete_opening', function () {
                    
                    if (confirm_delete()) {
                        
                        let id_row = $(this).data('id');
                        let item_id = $(this).data('item_id');
                        let store_id = $(this).data('store_id');
                        let expire_date = $(this).data('expire_date');
                        $.ajax({
                            url: $(this).data('url'),
                            data: {
                                'id': id_row,
                                'item_id': item_id,
                                'store_id': store_id,
                                'expire_date': expire_date
                            },
                            success: function (data) {
                                if (data.status == 1) {
                                    alert_message(data.message.message, data.message.class);
                                    table.ajax.reload();
                                }
                                
                            },
                            error: function (data) {
                            }
                        });
                    }
                });
                
                $(document).on('click', '.add-form-row', function () {
                    let prefix = String($(this).attr('id'));
                    var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
                    var row = $(".item:last").clone(false).get(0);

      
                    let tr = `<select name="${prefix}-${formCount}-item" data-row="class_row" class="formset-field form-control items_val  select2-hidden-accessible" style="width:200px !important" id="id_${prefix}-${formCount}-item" class="formset-field items_val form-control select2-hidden-accessible" data-autocomplete-light-language="ar" data-autocomplete-light-url=${url_ItemAutocomplete} data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${formCount}-item" tabindex="-1" aria-hidden="true">
                    </select>
                    <span class="select2 select2-container items_val  select2-container--default select2-container--below select2-container--focus" dir="ltr" data-select2-id="${formCount}" ></span>`;
        $(row).find('.td_two').html(tr); 
        $(row).find('.td_two').attr('data-select2-id', formCount);
        $(`#id_${prefix}-${formCount}-item`).css('outline', '');
        $(row).find('.td_id').text(formCount + 1);
        $("span[cass='text-danger']", row).remove();
        $(row).children().removeClass("error");
        $(row).find('.formset-field').each(function () {
            updateElementFormset(this, prefix, formCount);
            if(!$(this).hasClass("expire_date")) {

                $(this).val('');
                $(this).removeAttr('value');
                $(this).removeAttr('disabled');
                $(this).removeAttr('readonly');
            }
        });
        $(row).find('.td_first').children('input').attr('readonly', 'readonly');
        $('.tbody_tb').append(row);
        $(row).find(".delete-row").click(function () {
            return deleteFormset(this, prefix);
        });
        $('#id_' + prefix + '-TOTAL_FORMS').val(formCount + 1);

    });

    $(document).on('click', '.delete-row', function () {
        deleteFormset($(this), String($(this).attr('id')));

    });





});