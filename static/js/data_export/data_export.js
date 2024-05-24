
maxnumber =()=>{

    $.ajax({
        method: "post",
        url:url_max_number,
        data: {
          'csrfmiddlewaretoken': csrf,
            
         }, // data sent with the delete request
        
        success: function(data) {
          var count_number='';
          count_number=data.data.number__max;
          
          if(count_number){
              $("#id_number").val(parseInt(count_number)+1);
          }else
          {
              $("#id_number").val("1");
          }
          },
        error: function(data) {
            alert('error in onchange');
        }
    });
  
  };
  $("#id_document_name_temp").on("change", function() {
    $.ajax({
        method: "post",
        url:url_get_filde_document_name,
        data: {
          'document_name': $(this).val(),
            
         }, 
         beforeSend: function (xhr) {
            xhr.setRequestHeader("X-CSRFToken",csrf);
        },
        success: function(response) {
            console.log(response.data)
            if (response.status === 1) {
                var fieldNames = response.data;

                var checkboxesHtml_required = "";
                var checkboxesHtml_normal = "";
                for (var i = 0; i < fieldNames.length; i++) {
                    var fieldName = Object.keys(fieldNames[i])[0];
                    var fieldLabel = fieldNames[i][fieldName];
                    var style_lebel="";
                    var val_lebel=0;
                    var checked_="";
                    if (fieldLabel.includes("(إجباري)")) {
                        style_lebel = 'color_red';
                        val_lebel=1;
                        checked_="checked"
                    }
                    if(val_lebel==1){
                        checkboxesHtml_required+=`<div id="div_id_${fieldName}"  class="control-group">
                                <div class="controls">
                                    <label for="id_${fieldName}" class="checkbox ${style_lebel}">
                                        <input type="checkbox" name="checkbox_field" class="input-sm plain checkboxinput" id="id_${fieldName}" value="${fieldName}" ${checked_} >
                                        ${fieldLabel}
                                    </label>
                            </div>
                    </div>`
                }else{
                    checkboxesHtml_normal+=`<div id="div_id_${fieldName}"  class="control-group">
                    <div class="controls">
                        <label for="id_${fieldName}" class="checkbox ${style_lebel}">
                            <input type="checkbox" name="checkbox_field" class="input-sm plain checkboxinput" id="id_${fieldName}" value="${val_lebel}" ${checked_} >
                            ${fieldLabel}
                        </label>
                </div>
        </div>`
                }
                 }

                $("#checkboxes-container-required").html(checkboxesHtml_required);
                $("#checkboxes-container-normal").html(checkboxesHtml_normal);
                
            
            } else {
                console.log("Error: " + response.message);
            }

            },
        error: function(data) {
            alert('error in onchange');
        }
    });
  
});
  
  // run method
  // maxnumber();

  // ---------------------------------
  //-------------------------
  
  // This code to hide the last sales date and make the registered date read only
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //   $('#id_registered_date').val(date);
    //   $('#id_registered_date').attr("readonly",true);
      // document.getElementById("id_lastSale_date").style.visibility="hidden";
  
      $(document).ready(function() {
        $('#id_document_name_temp').on('change', function() {
          var selectedValue = $(this).val();
          $("#id_document_name").val(selectedValue);
        });
      });
  //  $(document).ready(function(){
      let form_id_='#form-id';
      $(document).on('submit',form_id_,function(e){
          // $('#submit-button').button('loading');
          e.preventDefault();
          $.ajax({
              url: $(this).attr('action'),
              data: $(this).serialize(),
              method: 'post',
              success: function (data) {
                  $('span[class="text-danger"]').remove();

                  if(data.status==1){
                      
                      alert_message(data.message2,data.message.class,0);
                      alert_message(data.message.message,data.message.class,0);
                      var type_file = $("select[name='file_type']").val();
                      var document_name = $("#id_document_name").val();
                      $("#id_number").val(data.max_number);
                      table.ajax.reload();
                      
                        url_export_xls_csv_= type_file+"/"+document_name+"/";
                        window.location.href = url_export_xls_csv_;
              
                          
                          $('#modalLRForm').modal('hide');
                          $('.modal-backdrop').remove(); 
                      }
                      else if(data.status==2){

                          alert_message(data.message.message,data.message.class);
                      }
                      else if(data.status==0){
                        alert("document_name");
                        
                          console.log(data.message)
                          alert_message(data.message,"alert alert-danger");
                          if(data.error){
                          let error=JSON.parse(data.error);
                          $.each(error,function(i,value){
                              let div='<span class="text-danger">';
                              $.each(value,function(j,message){
                                  div+=`- ${message.message}<br>`;
                              });
                              $(`#div_id_${i}`).append(div);
                          });}
                      }
                      $('#submit-button').button('reset');
                  },
                  error:function(data){
  
                  }
              });
      });
      
  $(document).on('click','.edit_row',function(){
      
      let id_row=$(this).data('id');
      $.ajax({
          url: $(this).data('url'),
          data: {'id':id_row,},
          method: 'get',
          success: function (data) {
              if(data.status==1){
  
                  let resp=JSON.parse(data.data);
                   $(`input[name="id"]`).val(resp[0].pk);
                   $.each(resp[0].fields,function(i,value){
                       $(`input[name="${i}"]`).val(value);
                       $(`input[name=${i}]`).prop('checked',value);
                       $(`textarea[name=${i}]`).text(value);
                      
                       $(`select[name="${i}"] option`).each(function() {
                          if($(this).val() == value) {
                              $(this).prop("selected", true);
                          }
                      });
                     
                  });
                  $('#tableContainer').html("");
                  $('#modalLRForm').modal('show');
               }
          },
          error:function(data){
          }
      });
  });
  
  $(document).on('click','.delete_row',function(){
     
      if(confirm_delete()){
      let id_row=$(this).data('id');
      $.ajax({
          url: $(this).data('url'),
          data: {
              'id':id_row,
          },
          method: 'DELETE',
          beforeSend: function (xhr) {
                  xhr.setRequestHeader("X-CSRFToken",csrf);
              },
          success: function (data) {
             
              if(data.status==1){
                  alert_message(data.message.message,data.message.class);
                  table.ajax.reload();
  
                  maxnumber();
  
              }
           
          },
          error:function(data){
          }
      });
  }
  });
  // });
 

 