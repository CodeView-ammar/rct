  function updateElementIndex(el, prefix, ndx) {
  let id_regex = new RegExp('(' + prefix + '-\\d+)');
  let replacement = prefix + '-' + ndx;
  let sibling = el.nextElementSibling;
  let prev = el.parentNode;
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

function pricingAddForm(btn, prefix) {
  let pricing_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
  if (pricing_row_count < 1000) {
    let row = $(".pricing-form-row:last").clone(false).get(0);
    $(row).removeAttr('id').hide().insertAfter(".pricing-form-row:last").slideDown(300);

    $(".errorlist", row).remove();
    $(row).children().removeClass("error");
    $(row).find('.pricing-formset-field').each(function () {
      updateElementIndex(this, prefix, pricing_row_count);
      $(this).val('');
      $(this).attr('checked', false);
    });
    $("#id_" + prefix + "-TOTAL_FORMS").val(pricing_row_count + 1);
  }

  return false;
}

function pricingDeleteForm(btn, prefix) {
  let pricing_row_count = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
  if (pricing_row_count > 1) {
    // Delete the item/form
    let goto_id = $(btn).find('input').val();
    if (goto_id) {
      $.ajax({
        url: "/" + window.location.pathname.split("/")[1] + "/formset-data-delete/" + goto_id + "/?next=" + window.location.pathname,
        error: function () {
        },
        success: function (data) {
          $(btn).parents('.pricing-form-row').remove();
        },
        type: 'GET'
      });
    } else {
      $(btn).parents('.pricing-form-row').remove();
    }

    let forms = $('.pricing-form-row'); // Get all the forms
    $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
    let i = 0;
    for (pricing_row_count = forms.length; i < pricing_row_count; i++) {
      $(forms.get(i)).find('.pricing-formset-field').each(function () {
        updateElementIndex(this, prefix, i);
      });
    }
  }

  return false;
}

$("body").on('click', '.item-pricing-remove-form-row', function () {
  pricingDeleteForm($(this), String($('.item-pricing-add-form-row').attr('id')));
});

$("body").on('click', '.item-pricing-add-form-row', function () {
  return pricingAddForm($(this), String($(this).attr('id')));
});
