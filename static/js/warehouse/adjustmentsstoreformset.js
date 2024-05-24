          function updateElementIndex(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    var sibling = el.nextElementSibling;
    var prev = el.parentNode;
    // alert(prev);
    if ($(sibling).attr("for"))
    {
      $(sibling).attr("for", $(sibling).attr("for").replace(id_regex, replacement));
    } 
    if (prev.id){
      prev.id = prev.id.replace(id_regex, replacement);
    } 
    if (el.id){
      el.id = el.id.replace(id_regex, replacement);
    } 
    if (el.name){
      el.name = el.name.replace(id_regex, replacement);
    } 
  }
  
  // start for adjustment store details formset
  function addForm(btn, prefix) {
    var row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    // alert(row_count);
    if (row_count < 1000) {
        var row = $(".adj-form-row:last").clone(false).get(0);
        // $(row).removeAttr('id').hide().insertAfter(".adj-form-row:last").slideDown(300);
        let tr = `
        <select name="${prefix}-${row_count}-item_inventory"
          class="adjustments-formset-field clear-this modelselect2 form-control select2-hidden-accessible"
          style="width: 200px !important" onchange="getAdjustmentsDetails(this)" id="id_${prefix}-${row_count}-item_inventory"
          data-autocomplete-light-language="en" data-autocomplete-light-url=${url_ItemInventoryAutocomplete}
          data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${row_count}-item_inventory" tabindex="-1"
          aria-hidden="true">
          <option value="" selected="" data-select2-id="3">---------</option>
        </select>
        <span class="select2 select2-container select2-container--default select2-container--focus" dir="ltr"
          data-select2-id="4" style="width: 200px;">
          <span class="selection">
            <span class="select2-selection__rendered"
              id="select2-id_${prefix}-${row_count}-item_inventory-container" role="textbox" aria-readonly="true"><span
                class="select2-selection__placeholder">
              </span>
            </span>
            <span class="select2-selection__arrow" role="presentation">
              <b role="presentation"></b></span>
            </span>
          </span>        `;
    
          //  تم توقيفها بسبب الاوتو كمبليت
          $(row).find('.td_item').html(tr);
           
          tr = `<select name="${prefix}-${row_count}-supplir"
            class="adjustments-formset-field clear-this modelselect2 form-control select2-hidden-accessible"
            style="width: 200px !important" onchange="getAdjustmentsDetails(this)" id="id_${prefix}-${row_count}-supplir"
            data-autocomplete-light-language="en" data-autocomplete-light-url=${url_SupplirItemAutocomplete1}
            data-autocomplete-light-function="select2" data-select2-id="id_${prefix}-${row_count}-supplir" tabindex="-1"
            aria-hidden="true">
            <option value="" selected="" data-select2-id="3">---------</option>
          </select>        `;
            $(row).find('.td_supplier').html(tr);
      
        
            
        $(".errorlist", row).remove();
        $(row).children().removeClass("error");
        $(row).find('td:first').text(row_count + 1);
        
        $(row).find('.adjustments-formset-field').each(function () {
          
        updateElementIndex(this, prefix, row_count)
        $(this).val('');
        $(this).removeAttr('value');
        $(this).prop('checked', false);
        });
        $(row).find(".delete").click(function () {
          return deleteForm(this, prefix);
      });
        $('#tblProducts').append(row);
        $("#id_" + prefix + "-TOTAL_FORMS").val(row_count+1);
        
    } 
    return false;
  }
  
  function deleteForm(btn, prefix) {
    let adj_row_counter = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
      // alert(adj_row_counter);
      if (adj_row_counter > 1) {
          // Delete the item/form
          var goto_id = $(btn).find('input').val();
          if( goto_id ){
            $.ajax({
                url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/"+ goto_id +"/?next="+ window.location.pathname,
                error: function () {
                  console.log("error");
                },
                success: function (data) {
                  $(btn).parents('.adj-form-row').remove();
                },
                type: 'GET'
            });
          }else{
            $(btn).parents('.adj-form-row').remove();
          }
  
          var forms = $('.adj-form-row');
          $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
          var i = 0;
          for (adj_row_counter = forms.length; i < adj_row_counter; i++) {
              $(forms.get(i)).find('.adjustment-formset-field').each(function () {
                  updateElementIndex(this, prefix, i);
              });
          }
      } // End if
      return false;
  }
  
  $("body").on('click', '.remove-adj-form-row',function () {
    deleteForm($(this), String($('.add-adj-form-row').attr('id')));
  });
  
  $("body").on('click', '.add-adj-form-row',function () {
 
    return addForm($(this), String($(this).attr('id')));
  });
  
  // end for adjustment store details formset
  
