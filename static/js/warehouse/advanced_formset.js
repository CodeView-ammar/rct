        form_id = '#myform';

          function updateElementIndex(el, prefix, ndx) {
              var id_regex = new RegExp('(' + prefix + '-\\d+-)');
              var replacement = prefix + '-' + ndx + '-';
              if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
                  replacement));
              if (el.id) el.id = el.id.replace(id_regex, replacement);
              if (el.name) el.name = el.name.replace(id_regex, replacement);
          }

          function reset_form_all(form_id) {
            $("#id_outgoing_order_type")[0].selectedIndex;
            $("#id_account")[0].selectedIndex;
            $(".items_val")[0].selectedIndex;
            
            $('span[class="text-danger"]').remove();
            
            //   $('#id_outgoing_order_type').children('option').remove();
            //   $('#id_account').children('option').remove();
            //   $('#id_cost_center').children('option').remove();
            //   $('.items_val').children('option').remove();
              // $('.unit_class').children('option').remove();
            //   $('select').children('option[selected]').attr('selected', false);
              $('textarea').empty()

          }

          function addForm(btn, prefix) {


              var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              if (formCount < 1000) {
                  // Clone a form (without event handlers) from the first form
                  var row = $(".item:last").clone(false).get(0);
                  
                  let trsa = `<select name="${prefix}-${formCount}-item" 
                    onchange="get_item_value(this)"
                    class="formset-field items_val  form-control " 
                    required="" 
                    id="id_${prefix}-${formCount}-item"
                    data-autocomplete-light-language="en"
                    data-autocomplete-light-url="${item_url}" 
                    data-autocomplete-light-function="select2" 
                    style="width: 220px !important;" 
                    data-select2-id="id_${prefix}-${formCount}-item" tabindex="-1" aria-hidden="true">
                  </select>
                  <span class="select2  select2-container--default select2-container--open select2-container--focus select2-container--above" dir="ltr" data-select2-id="${formCount}" >
                      <span class="selection">
                      
                      </span>`;

                let tr =`<select name="${prefix}-${formCount}-item" data-placeholder="اختر الصنف" 
                  class="formset-field items_val form-control select2-hidden-accessible" 
                  min="0" required="" 
                  style="width: 220px !important; size:3 !important" 
                  onchange="get_item_value(this)" 
                  id="id_${prefix}-${formCount}-item" 
                  data-autocomplete-light-language="ar" 
                  data-autocomplete-light-url="${item_url}"
                  data-autocomplete-light-function="select2" 
                  data-select2-id="id_${prefix}-${formCount}-item" 
                  tabindex="-1" 
                  aria-hidden="true">
                    <option value="" selected="" data-select2-id="select2-data-7-a2te">---------</option>

                  </select>
                    <span class="select2  select2-container--default select2-container--open select2-container--focus select2-container--above" dir="ltr" data-select2-id="${formCount}" >
                    <span class="selection">
                    
                    </span>`;
                  $(row).find('.td_item').html(tr);

                //   Insert it after the last form
                  $(row).removeAttr('id').hide().insertAfter(".item:last").slideDown(300);

                  // Remove the bits we don't want in the new row/form
                  // e.g. error messages
                  $(".errorlist", row).remove();
                  $(row).children().removeClass("error");
                  $(row).find('td:first').text(formCount + 1);
                  $(row).find('.formset-field').each(function() {
                      updateElementIndex(this, prefix, formCount);

                      $(this).val('');

                      $('#id_OutgoingOrderDetails-' + formCount + '-unit').html('');

                      $('#id_IncomeOrderDetails-' + formCount + '-unit').html('');
                    
                      $('#id_OutgoingOrderDetails-' + formCount + '-store').val($("#id_store_main").val());
                      $(this).removeAttr('value');
                      $(this).prop('checked', false);
                  });

                  // Add an event handler for the delete item/form link
                  $(row).find(".delete").click(function() {


                      return deleteForm(this, prefix);
                  });
                  $('#tblProducts').append(row);
                  // Update the total form count
                  $("#id_" + prefix + "-TOTAL_FORMS").val(formCount + 1);

              } // End if

              return false;
          }


          function getCookie(name) {
              var cookieValue = null;
              if (document.cookie && document.cookie != '') {
                  var cookies = document.cookie.split(';');
                  for (var i = 0; i < cookies.length; i++) {
                      var cookie = jQuery.trim(cookies[i]);
                      // Does this cookie string begin with the name we want?
                      if (cookie.substring(0, name.length + 1) == (name + '=')) {
                          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                          break;
                      }
                  }
              }
              return cookieValue;
          }
          var csrftoken = getCookie('csrftoken');

          function csrfSafeMethod(method) {
              // these HTTP methods do not require CSRF protection
              return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
          }
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                      xhr.setRequestHeader("X-CSRFToken", csrftoken);
                  }
              }
          });

       


          function deleteForm(btn, prefix) {
            var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
            if (formCount !=1) {
                // Delete the item/form
                var goto_id = $(btn).find('input').val();
        
                if (goto_id) {
                    $.ajax({
                        url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
                        error: function() {},
                        success: function(data) {
                            $(btn).parents('.form-row-income').remove();
                        },
                        type: 'GET'
                    });
                } else {
                    var forms = $('.form-row-income');
                    $(btn).parents('.form-row-income').remove();
                }
        
                var forms = $('.form-row-income'); // Get all the forms
        
                // Update the total number of forms (1 less than before)
                $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                var i = 0;
                // Go through the forms and set their indices, names and IDs
                for (formCount = forms.length; i < formCount; i++) {
                    $(forms.get(i)).find('.formset-field').each(function() {
                        updateElementIndex(this, prefix, i);
                    });
                }
            }
        
            return false;
        }

          function check_item_fund() {
              let status = [];
              let fu = [];
              let prefix = String($('.remove_row').attr('id'));
              let sta = true;
              $('.items_val').each(function(i, j) {
                  let id_row = String($(this).attr('id'));
                  
                  if (id_row != undefined) {
                      id_row = id_row.split('-');
                      
                      let row = {
                          'data': '',
                          'id': id_row[1],
                      }
                      let item = $(`#id_${prefix}-${id_row[1]}-item`).val();
                      let store = $(`#id_${prefix}-${id_row[1]}-store`).val();


                      let data = [item, store];

                      if (status.length > 0) {
                          $.each(status, function(i, j) {
                              if (data[0] == j.data[0] && data[1] == j.data[1]) {
                                  fu.push(id_row[1])
                                  fu.push(j.id)
                              } else {
                                  row['data'] = data;
                                  status.push(row);
                              }
                          });
                      } else {
                          row['data'] = data;
                          status.push(row);
                      }
                  }
              });


              if (fu.length > 0) {
                  sta = false;
                  $('.form-row-income').removeAttr('style');

                  $.each(fu, function(index, value) {
                      $(`#id_${prefix}-${value}-item`).parents('.form-row-income').attr('style', 'outline:red auto;');

                  });
              } else {
                  $('.form-row-income').removeAttr('style');

              }
              return sta;

          }


          $(document).on('click', '.remove-form-row', function() {
              deleteForm($(this), String($('.add-form-row').attr('id')));
              $('#grand-total').val(calcualte_total_amount());
          });

          $(document).on('click', '.add-form-row', function() {
              return addForm($(this), String($(this).attr('id')));
          });
