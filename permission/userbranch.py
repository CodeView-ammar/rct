        
from permission.models import Systems , TabPartionsPermission,UsersDetiles
from django.http import HttpResponseForbidden
from django.shortcuts import render,get_object_or_404,redirect,reverse
from collections.abc import Iterable
def get_user_branch_permission(request):
    """ this function reurn all permission in data base 
    as list[ and inside list dictionary for each permission ]
    take **arg request-> to get user permission group 
    """
    # print("B"*90)
    permission_list = [] 
    for UsersDetile in UsersDetiles.objects.raw('''

    select permission_usersdetiles.id as id
    ,permission_usersdetiles_user_branch.branch_id as branch_id
    from permission_usersdetiles
    join permission_usersdetiles_user_branch
    on permission_usersdetiles.id=permission_usersdetiles_user_branch.usersdetiles_id
    '''):


        dic  = {}
        dic['id'] = UsersDetile.id
        dic['branch_id'] = UsersDetile.branch_id
        # dic['system_name'] = system.system_name
        # dic['tab_code'] = system.tab_code
        # dic['screen_code'] = system.screen_code
        # dic['tab_active'] = system.tab_active
        # dic['system_active'] = system.system_active
        # dic['view'] = system.can_view
        # dic['add'] = system.can_add
        # dic['edit'] = system.can_edit
        # dic['delete'] = system.can_delete
        # dic['print'] = system.can_print
        # print(dic)
  
        permission_list.append(dic)
     
        
    return permission_list


def set_session_variables(request,**qeord):
    for key, value in qeord.items():
        request.session[key] = value