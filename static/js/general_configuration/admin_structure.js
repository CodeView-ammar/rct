$(document).ready(function() {


    LoadData();
    load_action();


});
$('#id_mylevel').attr('readonly', 'true')
$('#div_id_stop_reason').hide();
$('#div_id_stop_date').hide();
$('#id_stop').on('click', function() {
    if ($(this).is(':checked')) {
        $('#div_id_stop_reason').show();
        $('#div_id_stop_date').show();
        $(this).val(true);
    } else {
        $('#div_id_stop_reason').hide();
        $('#div_id_stop_date').hide();
        $(this).val(false);
    }
});

function load_action() {

    $('#tree').jqTreeContextMenu($('#myMenu'), {
        // edit node  
        "edit": function(node) {
            // alert(node.parent.mylevel);
            $("#id_name_ar").val(node.name_ar);
            $("#id_name_en").val(node.name_en);
            $("#id_admin_structures").val(node.admin_structures);
            $("#id_parent").val(node.parent.id);
            $("input[name='id']").val(node.id);
            $("#id_mylevel").val(node.mylevel);
            $("#id_stop").attr('checked', node.stop);
            $("#id_stop_reason").val(node.stop_reason);
            $("#id_stop_date").val(node.stop_date);
            $("#btsave").text("Update");


            var urf = 'AdminStructureCreateView';
            $('#form_admin_structure').attr('action', `${url_admin_structure}`)
                // $('#form_admin_structure').attr('action')
        },
        // delete node
        "delete": function(node) {
            if (node.children.length == 0) {


                mymodal("Are you sure to permanently delete this node!", "delete", function() {
                    $.ajax({
                        url: url_admin_structure,
                        data: {
                            'nodeId': node.id,
                        },
                        method: 'DELETE',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("X-CSRFToken", csrf);
                        },
                        success: function(data) {
                            if (data.status == 1) {
                                alert_message(data.message.message, data.message.class);
                                $(form_id)[0].reset();
                            }
                            $('#tree').tree('removeNode', node);
                            var originalState = $("#tree").clone();
                            $("#tree").replaceWith(originalState);

                            LoadData()
                            load_action();


                        }
                    });
                    // LoadData();
                });

            } else {
                mymodal("You can't delete node have children", 'message', 'danger');

            }
        },
        // add nodes
        "add": function(node) {

            $("#btsave").text("Save");
            $("#id_name_ar").val('');
            $("#id_name_en").val('');
            $("#id_admin_structures").val();
            if (node.children[0] != undefined) {
                $("#id_mylevel").val(eval(node.children[node.children.length - 1].mylevel) + 1);
            } else {
                $("#id_mylevel").val(eval(node.mylevel) * 10 + 1);
            }
            $("#id_stop").val('');
            $("#id_stop_reason").val('');
            $("#id_parent").val(node.id);

            var urf = '';
            $('#form_admin_structure').attr('action', `${urf}`);
        },
        "refresh": function(node) {
            var originalState = $("#tree").clone();
            $("#tree").replaceWith(originalState);
            LoadData();
            load_action();
            var urf = '';
            $('#form_admin_structure').attr('action', `${urf}`);
        }
    });

    // event.node is the clicked node

    $('#tree').on(
        'tree.dblclick',
        function(event) {
            var node = event.node
            $("#id_name_ar").val(node.name_ar);
            $("#id_name_en").val(node.name_en);
            $("#id_admin_structures").val(node.admin_structures);
            $("#id_parent").val(node.parent.id);
            $("#id_mylevel").val(node.mylevel);
            $("#id_stop").attr('checked', node.stop);
            $("#id_stop_reason").val(node.stop_reason);
            $("#id_stop_date").val(node.stop_date);
            $("#btsave").text("Update");
            $('input[name=id]').val(`${node.id}`);

            var urf = 'AdminStructureCreateView';
            $('#form_admin_structure').attr('action', ``);


        }
    );

    $('#tree').on(
        'tree.click',
        function(event) {
            var node = event.node
            $("#id_name_ar").val('');
            $("#id_name_en").val('');
            $("#id_admin_structures").val('');
            $("#id_parent").val(node.parent.id);
            if (node.parent.name_ar == undefined) {
                $("#id_mylevel").val(eval(node.max) + 1);
            } else {
                $("#id_mylevel").val(eval(node.parent.children[node.parent.children.length - 1].mylevel) + 1);
            }
            $("#id_stop").val('');
            $("#id_stop_reason").val('');
            $("#btsave").text("sava");

            var urf = '';
            $('#form_admin_structure').attr('action', `${urf}`);


        }
    );
}


function LoadData() {
    $("#tree").attr('text', '');
    $.ajax({
        method: "GET",
        url: url_view,
        dataType: 'json',
        success: function(data) {
            let NewData = {};
            NewData = data['dic'];
            $('#tree').tree({
                data: NewData,
                autoOpen: false,
                autoEscape: false,
                usecontextmenu: true,
                onCreateLi: function(node, $li) {},

                tabIndex: 5,
                closedIcon: $(' <i class="fa fa-plus-circle" aria-hidden="true"></i> '),
                openedIcon: $(' <i class="fa fa-minus-circle" aria-hidden="true"></i> '),
            });
        }

    });
}

let form_id = '#form_admin_structure';
$(document).on('submit', form_id, function(e) {


    $('#btsave').button('loading');
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        data: $(this).serialize(),
        method: 'post',
        success: function(data) {
            var originalState = $("#tree").clone();
            $("#tree").replaceWith(originalState);
            LoadData();
            load_action();
            $('span[class="text-danger"]').remove();
            if (data.status == 1) {
                $(form_id)[0].reset();
                alert_message(data.message.message, data.message.class);

            } else if (data.status == 2) {
                alert_message(data.message.message, data.message.class);
            } else if (data.status == 0) {
                let error = JSON.parse(data.error);
                $.each(error, function(i, value) {
                    let div = '<span class="text-danger">';
                    $.each(value, function(j, message) {
                        div += `- ${message.message}<br>`;
                    });
                    $(`#div_id_${i}`).append(div);
                });
            }
            $('#btsave').button('reset');

        },
        error: function(data) {

        }
    });
});
$("#id_name_ar").on('input', function(e) {
    if ($('#id_parent option').length < 2)
        $('#id_mylevel').val(1)
});
var max = ''
$('#id_parent').on('change', function() {
    const node2 = $('#tree').tree('getNodeById', $(this).val());
    $('#tree').tree('selectNode', node2);

    if ($(this).val() == null || $(this).val() == '') {
        $("#id_mylevel").val(max);

    } else {

        if (node2.children[0] != undefined) {
            $("#id_mylevel").val(eval(node2.children[node2.children.length - 1].mylevel) + 1);
        } else {
            $("#id_mylevel").val(eval(node2.mylevel) * 10 + 1);
        }
        max = node2.max;
    }




});