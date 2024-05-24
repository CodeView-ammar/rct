
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
  // run method
  // maxnumber();
  
  
  // ---------------------------------
  //-------------------------
  
  // This code to hide the last sales date and make the registered date read only
 
      // document.getElementById("id_lastSale_date").style.visibility="hidden";
  
  
      $(document).ready(function() {
        $('#id_document_name_temp').on('change', function() {
          var selectedValue = $(this).val();
          $("#id_document_name").val(selectedValue);
        });
        $('#LRForm').on('click', function() {
             if($("#id_document_name").val()=='')
            {
                alert_message("يجب عليك إختيار الشاشة","alert alert-danger");
                $('#tableContainer').html("");
                $('#exaplemodalLRForm').modal('hide');
                $('.modal-backdrop').remove(); 
                return false;
            }
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
                      if (data.message2.status == 2) {
                        var errorMessage = $('<p>').text(data.message2.message).css('color', 'red');
                        $('#tableContainer').prepend(errorMessage);
                    }
                       if(data.message2.status==0) 
                        alert_message(data.message2.message,data.message.class,0);
                      if(data.status==1)
                        alert_message(data.message2.message,data.message.class,0);
                     

                      if(data.status==1){
                          $(form_id_)[0].reset();
                          alert_message(data.message.message,data.message.class,0);
                          $("#id_number").val(data.max_number);
                          
                          table.ajax.reload();
                          $('#tableContainer').html("");
                          $('#modalLRForm').modal('hide');
                          $('.modal-backdrop').remove(); 
                        $('#tableContainer').html("");

                      }
                      else if(data.status==2){
                          alert_message(data.message.message,data.message.class);
                      }
                      else if(data.status==0){
                          let error=JSON.parse(data.error);
                          $.each(error,function(i,value){
                              let div='<span class="text-danger">';
                              $.each(value,function(j,message){
                                  div+=`- ${message.message}<br>`;
                              });
                              $(`#div_id_${i}`).append(div);
                          });
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
  $(document).on('submit','#export_exap',function(e){

    
      e.preventDefault();
      $.ajax({
          url: $(this).attr('action'),
          data: {
              'data':$(this).serialize(),
          },
          method: 'post',
          success: function (data) {
             
              if(data.status==1){
                  alert_message(data.message.message,data.message.class);
                 
              }
           
          },
          error:function(data){
          }
        });
    });
 
    $(document).ready(function() {
        $('#excelFile').on('change', function(e) {
          var file = e.target.files[0];
          var formData = new FormData();
          $('#tableContainer').html("");
          
          formData.append('excel_file', file);
          $.ajax({
            url: url_read_excel,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-CSRFToken",csrf);
            },
            success: function(data) {
                var table = '<style>.bordered-table {border-collapse: collapse;}.bordered-table th, .bordered-table td {border: 1px solid black;padding: 8px;}</style><table class="bordered-table">';
                table += '<tr>';
                for (var key in data[0]) {
                  table += '<th>' + key + '</th>';
                }
                table += '</tr>';
              
                for (var i = 0; i < data.length; i++) {
                  table += '<tr';
                  if (i === data.error_row) {
                    table += ' class="error"';
                  }
                  table += '>';
                  for (var key in data[i]) {
                    table += '<td>' + data[i][key] + '</td>';
                  }
                  table += '</tr>';
                }
              
                table += '</table>';
              
                $('#tableContainer').html(table);
              },
            error: function(xhr, status, error) {
              console.log(error);
            }
          });
        });
      });
    