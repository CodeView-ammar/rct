          function updateElementIndex(el, prefix, ndx) {
              var id_regex = new RegExp('(' + prefix + '-\\d+)');
              var replacement = prefix + '-' + ndx;
              var sibling = el.nextElementSibling;
              var prev = el.parentNode;
              // alert(prev);
              if ($(sibling).attr("for")) {
                  $(sibling).attr("for", $(sibling).attr("for").replace(id_regex, replacement));
              }
              if (prev.id) {
                  prev.id = prev.id.replace(id_regex, replacement);
              }
              if (el.id) {
                  el.id = el.id.replace(id_regex, replacement);
              }
              if (el.name) {
                  el.name = el.name.replace(id_regex, replacement);
              }
          }

          // start for item unit formset
          // var row_count = 0;
          function addForm(btn, prefix) {
              var row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());

              // alert(row_count);
              if (row_count < 1000) {
                  var row = $(".form-row-unit:last").clone(false).get(0);
                  $(row).removeAttr('id').hide().insertAfter(".form-row-unit:last").slideDown(300);
                  $(".errorlist", row).remove();
                  $(row).children().removeClass("error");
                  $(row).children().removeClass("select-readonly");
                  // alert('e');
                  $(row).find('.formset-field').each(function() {
                      updateElementIndex(this, prefix, row_count)
                      $(this).val('');
                      $(this).removeClass("select-readonly");
                      $(this).attr('checked', false);
                  });
                  // alert('t');
                  $(`#id_ItemUnit-${row_count}-is_primary`).prop('checked', false);
                
                  for (let i = 0; i < row_count; i++) {
                      $(`input[name="ItemUnit-${row_count}-package"][type="number"]`).attr('readonly', false);
                      if (document.querySelector(`#id_ItemUnit-${i}-is_primary:checked`) !== null && document.getElementById(`id_ItemUnit-${i}-package`).readOnly === true) {
                        //   $(`input[name="ItemUnit-${row_count}-is_primary"][type="checkbox"]`).attr('disabled', true);
                          break;
                      }
                  }
                  // alert('g');

                  $("#id_" + prefix + "-TOTAL_FORMS").val(row_count + 1);
                  // alert('w');

              }

              return false;
          }

          function deleteForm(btn, prefix) {
              var row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              // alert(row_count);
              if (row_count > 1) {
                  // Delete the item/form
                  var goto_id = $(btn).find('input').val();
                  if (goto_id) {
                      $.ajax({
                          url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
                          error: function() {
                              console.log("error");
                          },
                          success: function(data) {
                              $(btn).parents('.form-row-unit').remove();
                          },
                          type: 'GET'
                      });
                  } else {
                      $(btn).parents('.form-row-unit').remove();
                  }

                  var forms = $('.form-row-unit');
                  $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                  var i = 0;
                  for (row_count = forms.length; i < row_count; i++) {
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

          // end for item unit formset

          // start for suppliers formset
          // var suppliers_row_count =  0; 
          function supplieraddForm(btn, prefix) {
              var suppliers_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              // alert(suppliers_row_count);
              if (suppliers_row_count < 1000) {
                  var row = $(".suppliers-form-row:last").clone(false).get(0);
                  $(row).removeAttr('id').hide().insertAfter(".suppliers-form-row:last").slideDown(300);

                  $(".errorlist", row).remove();
                  $(row).children().removeClass("error");
                  $(row).find('.supplier-formset-field').each(function() {
                      updateElementIndex(this, prefix, suppliers_row_count);
                      $(this).val('');
                      $(this).attr('checked', false);
                  });
                  $("#id_" + prefix + "-TOTAL_FORMS").val(suppliers_row_count + 1);
              }

              return false;
          }

          function supplierdeleteForm(btn, prefix) {
              var suppliers_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              // alert(suppliers_row_count);
              if (suppliers_row_count > 1) {
                  // Delete the item/form
                  var goto_id = $(btn).find('input').val();
                  if (goto_id) {
                      $.ajax({
                          url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
                          error: function() {
                              console.log("error");
                          },
                          success: function(data) {
                              $(btn).parents('.suppliers-form-row').remove();
                          },
                          type: 'GET'
                      });
                  } else {
                      $(btn).parents('.suppliers-form-row').remove();
                  }

                  var forms = $('.suppliers-form-row'); // Get all the forms
                  $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                  var i = 0;
                  for (suppliers_row_count = forms.length; i < suppliers_row_count; i++) {
                      $(forms.get(i)).find('.formset-field').each(function() {
                          updateElementIndex(this, prefix, i);
                      });
                  }
              } // End if

              return false;
          }

          $("body").on('click', '.supplier-remove-form-row', function() {
              // alert('Afeef')
              supplierdeleteForm($(this), String($('.supplier-add-form-row').attr('id')));
          });

          $("body").on('click', '.supplier-add-form-row', function() {
              // alert('Afeef222222222222222')
              return supplieraddForm($(this), String($(this).attr('id')));
          });

          // end for suppliers formset


          // start for store formset
          // var store_row_count = 0;
          function storeaddForm(btn, prefix) {
              var store_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              // alert(store_row_count);
              // alert(store_row_count);
              if (store_row_count < 1000) {
                  var row = $(".store-form-row:last").clone(false).get(0);
                  $(row).removeAttr('id').hide().insertAfter(".store-form-row:last").slideDown(300);

                  $(".errorlist", row).remove();
                  $(row).children().removeClass("error");
                  $(row).find('.store-formset-field').each(function() {
                      updateElementIndex(this, prefix, store_row_count);;
                      $(this).val('');
                      $(this).attr('checked', false);
                  });
                  $("#id_" + prefix + "-TOTAL_FORMS").val(store_row_count + 1);
              }

              return false;
          }

          function storedeleteForm(btn, prefix) {
              var store_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
              // alert(store_row_count);
              if (store_row_count > 1) {
                  var goto_id = $(btn).find('input').val();
                  if (goto_id) {
                      $.ajax({
                          url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
                          error: function() {
                              console.log("error");
                          },
                          success: function(data) {
                              $(btn).parents('.store-form-row').remove();
                          },
                          type: 'GET'
                      });
                  } else {
                      $(btn).parents('.store-form-row').remove();
                  }

                  var forms = $('.store-form-row');
                  $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                  var i = 0;
                  for (store_row_count = forms.length; i < store_row_count; i++) {
                      $(forms.get(i)).find('.formset-field').each(function() {
                          updateElementIndex(this, prefix, i);
                      });
                  }
              }

              return false;
          }

          $("body").on('click', '.store-remove-form-row', function() {
              storedeleteForm($(this), String($('.store-add-form-row').attr('id')));
          });

          $("body").on('click', '.store-add-form-row', function() {
              return storeaddForm($(this), String($(this).attr('id')));
          });

          // end for store formset