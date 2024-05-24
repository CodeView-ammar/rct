          $(document).on("click", "#button_download", function(e) {


              e.preventDefault();

              let item_type = $('select[name="item_type"]')
                  .children("option:selected")
                  .val();
              let show_way = $('select[name="show_way"]')
                  .children("option:selected")
                  .val();
              let store = $('select[name="store"]').children("option:selected").val();
              let item_from = $('input[name="item_from"]').val();
              let item_to = $('input[name="item_to"]').val();
              $("#load_item_qty1").load(
                  `${load_item_qty}?item_type=${item_type}&show_way=${show_way}&store=${store}&item_from=${item_from}&item_to=${item_to}`
              );
              $("#Previous_repo").modal("show");
          });



          $(document).on("click", ".delete_form", function() {
              deleteForm($(this), String($(this).attr("id")));
              // get_total();
          });
          $("#clear").on("click", function() {
              $("#myform")[0].reset();
          });

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

          $("body").on("click", ".remove-form-row", function() {
              deleteForm($(this), String($(".add-form-row").attr("id")));
          });

          $(document).on("click", ".delete_row", function() {
              if (confirm_delete()) {
                  let id_row = $(this).data("id");
                  $.ajax({
                      url: $(this).data("url"),
                      data: {
                          id: id_row,
                      },
                      method: "DELETE",
                      beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRFToken", csrf_token);
                        },
                      success: function(data) {
                          if (data.status == 1) {
                              alert_message(data.message.message, data.message.class);
                              table.ajax.reload();
                          }
                          if (data.status == 3) {
                              alert_message(data.message, "alert alert-danger");
                          }
                      },
                      error: function(data) {
                          alert("fail");
                      },
                  });
              }
          });

          $(document).on("click", ".edit_row", function() {

              $("#myform").trigger("reset");
              let id_row = $(this).data("id");
              $.ajax({
                  url: $(this).data("url"),
                  data: { id: id_row },
                  method: "get",
                  success: function(data) {
                      var detail_rows = parseInt(
                          $("#id_" + "InventoryDetail" + "-TOTAL_FORMS").val()
                      );
                      if (data.status == 1) {
                          let data2 = JSON.parse(data.data);
                          let detail = JSON.parse(data.detail);
                          let resp = JSON.parse(data.data);
                          $(`input[name="id"]`).val(resp[0].pk);
                          if (data2.length != 0) {
                              $.each(data2[0].fields, function(i, value) {
                                  if (!$("#id_" + i).is(":checkbox")) {
                                      $(`input[name="${i}"]`).val(value);
                                  }
                                  if ($("#id_" + i).is(":checkbox")) {
                                      if (value === true) {
                                          $(`input[name="${i}"][type="checkbox"]`).val(value);
                                          $(`input[name="${i}"][type="checkbox"]`).attr(
                                              "checked",
                                              "checked"
                                          );
                                      }
                                  }
                                  $(`select[name="${i}"] option[value="${value}"]`).attr(
                                      "selected",
                                      "selected"
                                  );
                                  // $('#modalLRForm').modal('show');
                              });
                          }

                          if (detail_rows.length != 0) {
                              if (detail_rows > 1) {
                                  // alert('U'+detail_rows);
                                  for (i = 0; i < detail_rows; i++) {
                                      deleteForm(
                                          $("#InventoryDetail-0"),
                                          String($(".add-form-row").attr("id"))
                                      );
                                  }
                              }
                              let detailrowcounter = 0;
                              $.each(detail, function() {
                                  // let item_type = '';
                                  // let show_way = '';
                                  // let store = '';
                                  // let item_from = '';
                                  // let item_to = '';
                                  let item_inventory = id_row;

                                  $("#load_item_qty").load(
                                      `${load_item_qty}?item_inventory=${item_inventory}`
                                  );

                                  addForm(
                                      $(".add-form-row"),
                                      String($(".add-form-row").attr("id"))
                                  );
                                  $.each(detail[detailrowcounter].fields, function(i, value) {
                                      // alert(value);
                                      if (!$("#id_InventoryDetail-" + detailrowcounter + "-" + i).is(
                                              ":checkbox"
                                          )) {
                                          $(
                                              `input[name="InventoryDetail-${detailrowcounter}-${i}"]`
                                          ).val(value);
                                      }
                                      if (
                                          $("#id_InventoryDetail-" + detailrowcounter + "-" + i).is(
                                              ":checkbox"
                                          )
                                      ) {
                                          if (value === true) {
                                              $(
                                                  `input[name="InventoryDetail-${detailrowcounter}-${i}"][type="checkbox"]`
                                              ).val(value);
                                              $(
                                                  `input[name="InventoryDetail-${detailrowcounter}-${i}"][type="checkbox"]`
                                              ).attr("checked", "checked");
                                              // if($('#id_InventoryDetail-'+detailrowcounter+'-is_primary').attr('value') == 'true'){
                                              //     checkIsPrimary(`#id_InventoryDetail-${detailrowcounter}-is_primary`);
                                              // }
                                          }
                                      }
                                      $(
                                          `select[name="InventoryDetail-${detailrowcounter}-${i}"] option[value="${value}"]`
                                      ).attr("selected", "selected");

                                  });
                                  detailrowcounter += 1;
                              });
                          }

                      }
                  },
                  error: function(data) {
                      alert("fail");
                  },
              });
          });

          function Calcualte() {
              var $tblrows = $(".tbody_tb  tr.item");

              $tblrows.each(function(index) {
                  var $tblrow = $(this);

                  $tblrow.find(".item_inventory_quantity").on("keyup", function() {
                      var id = $(this).attr("id");
                      var strin = id.split("-");
                      var item_avali_quantity = $tblrow
                          .find("#" + strin[0] + "-" + strin[1] + "-" + "item_avali_quantity")
                          .val();
                      var item_inventory_quantity = $tblrow
                          .find(
                              "#" + strin[0] + "-" + strin[1] + "-" + "item_inventory_quantity"
                          )
                          .val();
                      var item_inventory_disparity =
                          parseInt(item_inventory_quantity) - parseInt(item_avali_quantity);
                      if (!isNaN(item_inventory_disparity)) {

                          $tblrow
                              .find(
                                  "#" + strin[0] + "-" + strin[1] + "-" + "item_inventory_disparity"
                              )
                              .val(item_inventory_disparity.toFixed(2));
                      }
                  });
                  $tblrow.find(".item_avali_quantity").on("keyup", function() {
                      var id = $(this).attr("id");
                      var strin = id.split("-");
                      var item_avali_quantity = $tblrow
                          .find("#" + strin[0] + "-" + strin[1] + "-" + "item_avali_quantity")
                          .val();

                      var item_inventory_quantity = $tblrow
                          .find(
                              "#" + strin[0] + "-" + strin[1] + "-" + "item_inventory_quantity"
                          )
                          .val();
                      var item_inventory_disparity =
                          parseInt(item_inventory_quantity) - parseInt(item_avali_quantity);
                      if (!isNaN(item_inventory_disparity)) {

                          $tblrow
                              .find(
                                  "#" + strin[0] + "-" + strin[1] + "-" + "item_inventory_disparity"
                              )
                              .val(item_inventory_disparity.toFixed(2));
                      }
                  });
              });
          }