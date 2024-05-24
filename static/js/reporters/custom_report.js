
$(document).ready(function(){
  
      
    let form_id='#form1_id';
    var url;
    $(document).on('submit',form_id,function(e){ 
        e.preventDefault();
        // get the type
    
        // POST AJAX request
         $.ajax({ 
               type:'POST',
               url: url_type,
              data: $(this).serialize(),
                    
               success:function(data){ 
                 
                    $("#append_table").html(data);
                  
                    
                  
               },
               error:function(data){
                //    alert(data.status);
                //    console.log(data);
                 
               }
       });
    });
    
 //---------------

  
});

