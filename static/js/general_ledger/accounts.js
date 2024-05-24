// function load_action(){
// alert("sd")
//   $('#accounts_type').on('click',function(){   
//       if($(this).val()==1)
//       {
//           // alert($(this).val())

//           $('#tableCurrency').hide();
//       }
//       else if($(this).val()==2)
//       {
//           $('#tableCurrency').show();
//       }
//       else
//       {
//           $('#tableCurrency').show();

//       }
// });

// $('#tree').jqTreeContextMenu($('#myMenu'), {
// // edit node  
// "edit": function (node) {
//   UpdateData(node);
   
//     // $('#form_account').attr('action')
//     },
// // delete node
// "delete": function (node) {
//         if (node.children.length == 0)
//         {

       
//             var r = confirm("You are sure to permanently delete this node!");
//             if (r == true) 
//             {
             
//                 $.ajax({
//                         method: "DELETE",                      
//                         url: $(this).data('url'),
//                         data : {'nodeId' : node.id }, // data sent with the delete request
//                         dataType:'json',
//                         beforeSend: function (xhr) {
//                                   xhr.setRequestHeader("X-CSRFToken",csrf);
//                               },
//                         success: function (data) {
//                           if(data.status==1){
//                               alert_message(data.message.message,data.message.class);
//                               $('#tree').tree('removeNode', node);
//                               // tree.ajax.reload();
//                           }
//                           else if(data.status==0){
//                               alert_message(data.message.message,data.message.class);
//                           }
                           
//                         }
//                     }); 
//             } else {
                
//                 return;

//             }
//         }
//         else {
//            alert("You can't delete node have children");

//         }
//         },
// // add node
// "add": function (node) { 
//     if (node.accounts_type == 1) {

//     $("#btsave").text("Save");
//     $("#arabic_name").val('');
//     $("#english_name").val('');
//     $("#number").val('');
//     $("#accounts_type").val('');
//     $("#use_cost_center").val(node.use_cost_center);
//     $("#account_nature").val(node.account_nature);
//     $("#final_account").val(node.final_account);
//     $("#analytical_account").val(node.analytical_account);
//     $("#id_parent").val(node.id);
//   //   if (node.children[0]!=undefined){
//   //         $("#number").val(eval(node.children[node.children.length-1].number)+1);
//   //         }
//   //         else {
//   //             alert('par');
//   //             $("#number").val(eval(node.number)*10+1);
//   //         }

//     $('#tableCurrency > tbody > tr').each(function(index, tr) { 
//       $(this).children('td').each(function(){
                    
//                       $(this).siblings('.list_currency').children('input[name="list_currency"]').prop("checked",false);
//       });
//   });
//     var urf='';
//     $('#form_account').attr('action',`${urf}`)
   
//     }
//     else if(node.accounts_type ==2)
//     {
//         alert("You can't add children to sub account");
//     }
   
//        },
//       "refresh": function (node) {
//       var originalState = $("#tree").clone();
//       $("#tree").replaceWith(originalState);
//       LoadData(url);

//       load_action();
//                   var urf = '';
//           $('#form_account').attr('action', `${urf}`);
//   }
// });


// // event.node is the clicked node
// $('#tree').on(
//     'tree.dblclick',
//     function(event) {
//     var node =event.node
//    UpdateData(node);
   
//     }
// );   
// }

// function LoadData(url){
//   $.ajax({
//         method: "GET",                      
//         url: url,
//         dataType:'json',
//         success: function (data) {
//           let  NewData;
//           NewData=data;
        
//             // console.log(data);
//           $('#tree').tree({
//               data:NewData,
//               autoOpen:false,
//               autoEscape:false,
//               usecontextmenu: true,
//               onCreateLi: function(node, $li) {
//             },
    
//                 tabIndex: 5,
//                 closedIcon: $(' <i class="fa fa-plus-circle" aria-hidden="true"></i> '),
//             openedIcon: $(' <i class="fa fa-minus-circle" aria-hidden="true"></i> '),
//           }
//           )

//         }

//     });      
// }      

// function UpdateData(node){
//     $("#arabic_name").val(node.arabic_name);
//     $("#english_name").val(node.english_name);
//     $("#number").val(node.number);
//     $("#accounts_type").val(node.accounts_type);
//     $("#id_parent").val(node.parent.name);
//     $("#use_cost_center").val(node.use_cost_center);
//     $("#account_nature").val(node.account_nature);
//     $("#final_account").val(node.final_account);
//     $("#analytical_account").val(node.analytical_account);
//     $("#btsave").text("Update");

//     $('#tableCurrency > tbody > tr').each(function(index, tr) { 
//       $(this).children('td').each(function(){
//                       // $(this).siblings('.max').children('input').val('');
//                       // $(this).siblings('.min').children('input').val('');
//                       $(this).siblings('.list_currency').children('input[name="list_currency"]').prop("checked",false);
//       });
//   });
//         $.ajax({
//                 method: "get",                      
//                 url: url_cu,
//                 data : {'nodeid' : node.id }, // data sent with the delete request
//                 dataType:'json',
//                 success: function (d) {
//                     var data;
//                     data=d;
                  
//                     var counter = 0; 
//                         var cur_id;
                        
//                     for(var i=0;i<3;i++)
//                     {
//                         cur_id=data.data[counter][6];
//                       //   maximam=data.data[counter][8];
//                       //   minimam=data.data[counter][7];
//                         //  alert(cur_id);
//                         $('#tableCurrency > tbody > tr').each(function(index, tr) { 
//                         var firstculomn=0;
//                             $(this).children('td').each(function(){
//                                 firstculomn=firstculomn+1;
//                                     if(firstculomn==1)
//                                     {
                                            
//                                         if( $(this).data('id')==cur_id)
//                                         {
                                          
//                                             $(this).siblings('.list_currency').children('input[name="list_currency"]').prop("checked",true);
                                        
//                                         }
//                                     }
//                             });
//                         });
//                                 counter=counter+1;
//                     }
//             }
//                }); 

//     var urf='AccountsUpdateView';
//     $('#form_account').attr('action',`${urf}/${node.id}/`)

//               }

// let form_id='#form_account';
// $(document).on('submit',form_id,function(e){

//     var total=$(this).find('input[name="list_currency"]:checked').length;
//     var accc_type= $('#accounts_type').val();
//     if((total==0) && (accc_type==2))
//     {
//         alert_message(message,'alert alert-danger ');
//         return false;
//     }
   
// $('#btsave').button('loading');
//  e.preventDefault();

//  $.ajax({
//          url: $(this).attr('action'),
//          data: $(this).serialize(),
//          method: 'post',
//          success: function (data) {
//           //  console.log(data)
      
//              $('span[class="text-danger"]').remove();

//              if(data.status==1){
//                  $(form_id)[0].reset();
//                  alert_message(data.message.message,data.message.class);
//                  var originalState = $("#tree").clone();
//                   $("#tree").replaceWith(originalState);
//                   LoadData(url);
//                   load_action();
//                 $('#btsave').button('reset');
//              }
//              else if(data.status==2){
//                  alert_message(data.message.message,data.message.class);
//                  $('#btsave').button('reset');
//              }
//              else if(data.status==0){
//               if(data.type=='DNC')
//               {
//                 alert_message(data.error,'alert alert-danger');

//               }
//                 $('#btsave').button('reset');
//                  let error=JSON.parse(data.error);
//                  $.each(error,function(i,value){
//                      let div='<span class="text-danger">';
//                      $.each(value,function(j,message){
//                          div+=`- ${message.message}<br>`;
//                      });
//                      $(`#div_id_${i}`).append(div);
//                  });
               
//              }
//              $('#btsave').button('reset');
           
//          },
//          error:function(data){

//          }
//      });
// });




