from django.shortcuts import render,HttpResponseRedirect,HttpResponse,reverse,redirect,get_object_or_404
import json
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login as login_user, logout as logout_user
from django.db.models import Q
from django.conf import settings

from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse, HttpResponse, QueryDict

from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db import transaction,IntegrityError
from django.core.cache import cache

from django.views.generic import  CreateView
from django.core import serializers



from django.utils.decorators import method_decorator
from django.contrib import messages
from our_core.our_messages import message
from permission.models import (PermissionGroup,
Systems,
SystemTabs,TabScreens,TabPartionsPermission,GroupPartionPermission,GroupScreens,
GroupTabs,GroupSystems,
BranchSystem,
UsersDetilesUserBranch,
UsersDetilesUserPermissionGroup,
UsersDetilesTypeDevice)

from permission.models import TypeDevice, UsersGroup,ActivityKey, UsersDetiles
from permission.forms import TypeDeviceForm,UsersGroupForm,UsersDetilesForm,UserPassword,UserDetailForm,LoginForm


from training.save_db import SaveDB

from permission.forms import PremissionGroup
from permission.permission.permission import get_all, get_all_partion

from permission.permission.permission import decorator_has_perm,has_screen,has_tab,has_system,has_partion
from permission.templatetags.permission_tag import (change_screen,active_screen,change_tab,change_system,change_partion)


from our_core.models import  Branch
from .userbranch import get_user_branch_permission
import setting 
from permission.userbranch import set_session_variables

from training import database
from datetime import datetime


def add_new_permission(request):
    """
        to add and update permidions for role of 
        screens , partions permissions ,systems permissions, tab permissions and permission group
    """
    collpase = 'collapsed-box'
    collpase2 = ''
    title = _('add new Role')

    request.session["select_menu"] = {"add_new_permission": "activeli","premission":"active mm-active"}
    
    button_title = _('Save')
    data = {}
    if has_screen(request, 'addNewPermission', 'view') or has_screen(request, 'addNewPermission', 'view'):  # check permission
        system = Systems.objects.filter(branchsystem__branch_id=request.session.get('branch_id')).prefetch_related(
            'systemtabs_set',
            'systemtabs_set__tabscreens_set',
            'systemtabs_set__tabscreens_set__tabpartionspermission_set',
            'systemtabs_set__tabscreens_set__groupscreens_set')
        # for sy in system:
        data['system'] = system
     
    # if has_screen(request,'role','view'):#check permission
    #     groups =PermissionGroup.objects.all()
    #     data['groups']=groups

    if has_screen(request, 'addNewPermission', 'view'):  # check permission
        if 'data' not in request.GET.keys():
            form = PremissionGroup(request.POST or None)
            data['form'] = form
            change_screen([])
            active_screen([])
            change_tab([])
            change_system([])
            change_partion([])

    if has_screen(request, 'addNewPermission', 'view'):  # check permission
        
        if 'data' in request.GET.keys():
            if not PermissionGroup.objects.filter(pk=request.GET.get('data'),
                                                  branchsystem__branch_id=request.session.get('branch_id')).count() > 0:
                                                 
                messages.success(request, _("You can't do this process"))
                return HttpResponseRedirect(reverse('add_new_permission'))
            group = get_object_or_404(PermissionGroup, pk=request.GET.get('data'))
            form = PremissionGroup(request.POST or None, instance=group)
            data['form'] = form
            group_screen_global = GroupScreens.objects.values('tab_screens_id', 'can_view', 'can_add', 'can_edit',
                                                              'can_delete', 'can_print',"tab_screens__is_active").filter(group_id=group.pk)
            change_screen(list(group_screen_global))
            
            active_screen_global = GroupScreens.objects.values('tab_screens_id',"tab_screens__is_active").filter(group_id=group.pk)
            active_screen(list(active_screen_global))

            group_tab_global_ = GroupTabs.objects.values('is_active', 'system_tabs').filter(group_id=group.pk)
            change_tab(list(group_tab_global_))

            group_system_global = GroupSystems.objects.values('is_active', 'systems').filter(group_id=group.pk)
            change_system(list(group_system_global))

            group_parion_global = GroupPartionPermission.objects.values('is_active', 'tab_partions').filter(
                group_id=group.pk)
            change_partion(list(group_parion_global))

            collpase = ''
            collpase2 = 'collapsed-box'
            button_title = _('Update')
            title = _('{0} تعديل صلاحية'.format(group.group_name))
        else:
            change_screen([])
            active_screen([])
            change_tab([])
            change_system([])
            change_partion([])

    if request.method == 'POST':
        
        if has_screen(request, 'addNewPermission', 'add') or has_screen(request, 'addNewPermission', 'edit'):  # check permission
            if form.is_valid():
                branchsystem = BranchSystem.objects.filter(branch_id=request.session.get('branch_id'))
                try:
                    with transaction.atomic():
                        obj = form.save()
                        GroupScreens.objects.filter(group_id=obj.pk).delete()
                        GroupTabs.objects.filter(group_id=obj.pk).delete()
                        GroupSystems.objects.filter(group_id=obj.pk).delete()
                        GroupPartionPermission.objects.filter(group_id=obj.pk).delete()

                        for_system = Systems.objects.all()
                        TabScreen = TabScreens.objects.all()
                        tab_partions_permission = TabPartionsPermission.objects.all()
                        for_tab = SystemTabs.objects.all()
                        for target_list in TabScreen:
                            Per = {'view': 0, 'add': 0, 'edit': 0, 'delete': 0, 'print': 0,"active":0}
                       
                            if 'view_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['view'] = 1

                            if 'add_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['add'] = 1

                            if 'edit_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['edit'] = 1

                            if 'delete_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['delete'] = 1
                            if 'print_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['print'] = 1
                            if 'active_' + str(target_list.pk) + "" in request.POST.keys():
                                Per['active'] = 1
                            if Per['view'] or Per['add'] or Per['edit'] or Per['delete'] or Per['print'] or Per['active']:
                                
                                updated_rows = GroupScreens.objects.filter(tab_screens_id=target_list.pk,
                                                                           group_id=obj.pk, ).update(
                                    can_view=Per['view'], can_add=Per['add'], can_edit=Per['edit'],
                                    can_delete=Per['delete'], can_print=Per['print'])
                                TabScreens.objects.filter(id=target_list.pk).update(is_active=Per['active'])
                                
                                if not updated_rows:
                                    GroupScreens.objects.create(can_view=Per['view'], can_add=Per['add'],
                                                                can_edit=Per['edit']
                                                                , can_delete=Per['delete'], can_print=Per['print'],
                                                                tab_screens_id=target_list.pk, group_id=obj.pk)
                                    TabScreens.objects.filter(id=target_list.pk).update(is_active=Per['active'])
                                        
                        for partions_list in tab_partions_permission:
                            Per2 = {'is_active': 0}
                            if 'pre_' + str(partions_list.pk) + "" in request.POST.keys():
                                Per2['is_active'] = 1
                            if Per2['is_active']:
                                updated_rows2 = GroupPartionPermission.objects.filter(tab_partions_id=partions_list.pk,
                                                                                      group_id=obj.pk).update(
                                    is_active=Per2['is_active'])

                                if not updated_rows2:
                                    GroupPartionPermission.objects.create(is_active=Per2['is_active'],
                                                                          tab_partions_id=partions_list.pk,
                                                                          group_id=obj.pk)

                        for system_list in for_system:
                            Per3 = {'is_active': 0}
                            if 'tab_' + str(system_list.pk) + "" in request.POST.keys():
                                Per3['is_active'] = 1
                            if Per3['is_active']:
                                updated_rows3 = GroupSystems.objects.filter(systems_id=system_list.pk,
                                                                            group_id=obj.pk).update(
                                    is_active=Per3['is_active'])
                                if not updated_rows3:
                                    GroupSystems.objects.create(is_active=Per3['is_active'],
                                                                systems_id=system_list.pk, group_id=obj.pk)

                        for tabs_is_system in for_tab:
                            if tabs_is_system.is_system:
                                Per4 = {'is_active': 0}
                            else:
                                Per4 = {'is_active': 1}

                            if 'tab_' + str(tabs_is_system.pk) + "" in request.POST.keys():
                                Per4['is_active'] = 1
                            if Per4['is_active']:
                                updated_rows4 = GroupTabs.objects.filter(system_tabs_id=tabs_is_system.pk,
                                                                         group_id=obj.pk).update(
                                    is_active=Per4['is_active'])
                                if not updated_rows4:
                                    GroupTabs.objects.create(is_active=Per4['is_active'],
                                                             system_tabs_id=tabs_is_system.pk, group_id=obj.pk)
                        for branchsystemgroup in branchsystem:
                            branchsystemgroup.branch_group.add(obj.pk)

                    messages.success(request, _("The Save Operation Completed Successfully"))

                    return HttpResponseRedirect(reverse('add_new_permission'))

                except:
                    messages.error(request, _('A mistake in The Save Process'))
                    collpase = ''
                    collpase2 = 'collapsed-box'

    data['collpase'] = collpase
    data['collpase2'] = collpase2
    data['title'] = title 
    data['button_title'] = button_title
    return render(request, 'addNewPermission.html', context=data)


def permission_group_delete(request, pk):
    """ TO DELETE  permission group 
    
    Arguments:
        request {[id]} -- [the id og permission group ]
      
    """
    if has_screen(request, 'addNewPermission', 'delete'):
        if pk:
            try:
                if not PermissionGroup.objects.filter(pk=pk, branchsystem__branch_id=request.session.get(
                        'branch_id')).count() > 0:
                    messages.success(request, _("You can't do this process"))
                    return HttpResponseRedirect(reverse('add_new_permission'))

                data = get_object_or_404(PermissionGroup, pk=pk)
                data.delete()
                message.delete_successfully(request)
            except:
                message.delete_error(request)
                result = {'status': 0, 'data': ''}
        else:
            message.delete_error(request)
        return HttpResponseRedirect(reverse('add_new_permission'))
    else:
        return HttpResponseRedirect(reverse('add_new_permission'))


class PermissionGroupListJson(BaseDatatableView):
    """
    Users  To Show in Table
    Returns:
        [json] -- List From  Users List  To Show
    """

    # def get_initial_queryset(self):
    #     print("A"*100)
    #     print(self.request.session.get("branch_id"))
    #     return self.model.objects.filter(branchsystem__branch_id=self.request.session.get("branch_id"))

    model = PermissionGroup
    columns = [
        "id",
        'group_name',
        'action',

    ]
    order_columns = [
        "id",
        'group_name',
        'action',

    ]

    count = 0

    def render_column(self, row, column):
        """Render Column For Datatable
        """
        if column == "id":
            self.count += 1
            return self.count

        elif column == "action":

            # if not has_screen(self.request, 'addNewPermission', "edit") and not has_screen(self.request, 'addNewPermission',"delete") and not has_partion(
            #         self.request, "change user password") and not has_partion(self.request, "change user Info"):
            #     return

            action_var = ""
            if has_screen(self.request, 'addNewPermission', "edit"):  # check permission
                action_var = action_var + '' + '<a  href="{3}?data={0}"  class=" btn-xs " data-toggle="tooltip" data-placement="top" title="{1}"><i class="fa fa-edit"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("add_new_permission"))

            if has_screen(self.request, 'addNewPermission', "delete"):  # check permission
                action_var = action_var + '' + '<a  href="{4}" onclick="return confirm(\'{5}\')" class="btn-xs " data-toggle="tooltip" data-placement="top" title="{2}"><i class="fa fa-trash"></i></a></td>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("add_new_permission", ),
                    reverse("permission_group_delete", kwargs={'pk': row.pk}),
                    _("Are You sure To complate Delete Process ? "))
            return action_var
        else:
            return super(PermissionGroupListJson, self).render_column(row, column)

    def filter_queryset(self, qs):
        """To Filter data in table using in search
        """
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            qs = qs.filter(
                Q(group_name__icontains=sSearch)

            )
        return qs


class UsersDetilesView(CreateView):
    """
     show main user page  and  add & delete and edit 
    """

    # @method_decorator(decorator_has_perm('tab','user_initialization'))
    def get(self, request, *args, **kwargs):


        request.session["top_menu"] = {"system_administration": "active"}
        request.session["sup_top_menu"] = {"permation_and_security": "active mm-active"}
        request.session["sub_menu"] = {"users": "activeli"}


        context = {}
        if "id" in request.GET.keys():

            if request.GET.get("id"):
                # try:
                li_permissiongroup=list()
                li_branch=list()
                li_TypeDevice=list()

                data = UsersDetiles.objects.filter(pk=int(request.GET.get("id")))
                
                filde_ = UsersDetilesUserPermissionGroup.objects.filter(usersdetiles_id=int(request.GET.get("id")))
                my_permissiongroup = [permissiongroup_ for permissiongroup_ in filde_.values("permissiongroup_id")]
                
                for rperm in my_permissiongroup:
                    li_permissiongroup.append(rperm["permissiongroup_id"])
                
                filde_= UsersDetilesUserBranch.objects.filter(usersdetiles_id=int(request.GET.get("id")))
                my_branch = [branch_ for branch_ in filde_.values("branch_id")]
                
                for rperm in my_branch:
                    li_branch.append(rperm["branch_id"])
                
                filde_= UsersDetilesTypeDevice.objects.filter(usersdetile_id=int(request.GET.get("id")))
                my_TypeDevice = [TypeDevice_ for TypeDevice_ in filde_.values("typedevice_id")]
                
                for rperm in my_TypeDevice:
                    li_TypeDevice.append(rperm["TypeDevice_id"])
                
                result = {
                    "status": 1,
                    "data1": {"active": "data.active", "group": "group_dic"},
                    "mselect_permissiongroup": li_permissiongroup,
                    "mselect_branch": li_branch,
                    "mselect_TypeDevice": li_TypeDevice,
                    "data": serializers.serialize("json", data),
                }
                # except:
                #     result = {"status": 0, "data": ""}


            return JsonResponse(result)
        if has_screen(request, 'usersdetiles', 'add'):
            context = {'status': 0, 'error': _("Sorry You not have permssion")}
            form = UsersDetilesForm()
            data = ""
            context['form'] = form
            context['url'] = reverse('UsersDetilesView')
            context['title_form'] = _('add new User View ')
            context['title_list'] = _(' User List')
        else: 
            form = UsersDetilesForm()
            data = ""
            context['error'] = "0"
            context['form'] = form
            context['id'] = data
            context['url'] = reverse('UsersDetilesView')
            context['title_form'] = _('add new User View ')
            context['title_list'] = _(' User List')
        return render(request, 'usersdetiles.html', context)

    def post(self, request, *args, **kwargs):
        if request.POST and request.is_ajax():
          
            if not has_screen(request, "usersdetiles", "add") and has_screen(request, "usersdetiles", "edit"):
                result = {'status': 0, 'error': _("Sorry You not have permssion")}
                return JsonResponse(result)  # check permission

            if request.POST.get('id'):
                if not has_screen(request, "usersdetiles", "edit"):
                    result = {'status': 0, 'error': _("Sorry You not have permssion")}
                    return JsonResponse(result)  # check permission
                
                data = get_object_or_404(UsersDetiles, pk=int(request.POST.get('id')))
                form = UsersDetilesForm(request.POST, instance=data)
                
            else:
                if not has_screen(request, "usersdetiles", "add"):
                    result = {'status': 0, 'error': _("Sorry You not have permssion")}
                    return JsonResponse(result)  # check permission
                form = UsersDetilesForm(self.request.POST or None)
               
            if form.is_valid():
                try:
                    with transaction.atomic():
                        obj = form.save(commit=False)
                        obj.password = make_password(request.POST['password'])
                        if obj.is_superuser is True:
                            if not request.user.is_superuser:
                                result = {'status': 2, 'message': message.add_error(_("D' JECFC 'D*9/JD 9DI (J'F'*  G0' 'DE3*./E"))}
                                return JsonResponse(result)

                        obj.save()
                        
                        if not obj.is_superuser is True:
                            form.save_m2m()
                        # print(request.POST.get('user_permission_group'))
                        
                        # for dain in form.cleaned_data['user_permission_group']:
                        for dabr in  form.cleaned_data['user_branch']:
                            if not UsersDetilesUserBranch.objects.filter(usersdetiles_id=obj.id,branch_id=dabr.id):
                                UsersDetilesUserBranch.objects.create(usersdetiles_id=obj.id,branch_id=dabr.id)
                        for dabr in  form.cleaned_data['user_permission_group']:
                            if not UsersDetilesUserPermissionGroup.objects.filter(usersdetiles_id=obj.id,permissiongroup_id=dabr.id):
                                UsersDetilesUserPermissionGroup.objects.create(usersdetiles_id=obj.id,permissiongroup_id=dabr.id)
                             
                except:
                    result = {'status': 0, 'error': message.add_error(_("error"))}
                if request.POST.get('id'):
                    if obj.id:
                        msg = message.update_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.edit_error()
                        result = {'status': 2, 'message': msg}
                else:
                    if obj.id:
                        msg = message.add_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.add_error(request)
                        result = {'status': 2, 'message': msg}
            else:
                result = {'status': 0, 'error': form.errors.as_json()}
        else:
            result = {'status': 0, 'message': _("Request Method not Accepted")}
        # else:
        #     result={'status':0,'error':_("Sorry You not have permssion")}
        return JsonResponse(result)

    def delete(self, request, *args, **kwargs):
        if has_screen(request, 'users', 'delete'):
            pk = int(QueryDict(request.body).get('id'))
            if pk:
                try:
                    data = get_object_or_404(UsersDetiles, pk=pk)
                    if not data.is_superuser:
                        data.delete()
                        msg = message.delete_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        raise Exception('error')
                except:
                    msg = message.delete_error()
                    result = {'status': 0, 'message': msg}
            else:
                msg = message.delete_error()
                result = {'status': 0, 'message': msg}
        else:
            msg = message.delete_error(_("You NOT have permission"))
            result = {'status': 0, 'message': msg}
        return JsonResponse(result)


def change_password(request):
    """
    return change password form and save new password in post function  

    """

    if request.method == 'GET' and request.is_ajax():
        if 'id' in request.GET.keys():
            if request.GET.get('id'):
                data = get_object_or_404(UsersDetiles, pk=request.GET.get('id'))
                form = UserPassword(request.POST or None, instance=data)

            context = {
                'form': form,
                'id': data.pk,
                'url': reverse('UsersDetilesViewPassword'),
                'title_form': _('Change Password View '),
                'title_list': _('List'),
            }
            return render(request, 'model.html', context)

    elif request.method == 'POST' and request.is_ajax():
        if request.POST.get('id'):
            data = get_object_or_404(UsersDetiles, pk=int(request.POST.get('id')))
            form = UserPassword(request.POST, instance=data)

        if form.is_valid():
            try:
                with transaction.atomic():
                    obj = form.save(commit=False)
                    obj.password = make_password(request.POST['password'])
                    if obj.is_superuser is True:
                        if not request.user.is_superuser:
                            result = {'status': 2, 'message': message.add_error(_("D' JECFC 'D*9/JD 9DI (J'F'*  G0' 'DE3*./E"))}
                            return JsonResponse(result)
                    obj.save()
                    form.save_m2m()
            except:
                result = {'status': 0, 'error': message.add_error(_("error"))}
            if request.POST.get('id'):
                if obj.id:
                    msg = message.update_successfully()
                    result = {'status': 1, 'message': msg}
                else:
                    msg = message.edit_error()
                    result = {'status': 2, 'message': msg}
            else:
                if obj.id:
                    msg = message.add_successfully()
                    result = {'status': 1, 'message': msg}
                else:
                    msg = message.add_error(request)
                    result = {'status': 2, 'message': msg}
        else:
            result = {'status': 0, 'error': form.errors.as_json()}
    else:
        result = {'status': 0, 'error': message.add_error(_("request method not Accepted"))}

    return JsonResponse(result)


def change_usergroup(request):
    """
    return form to change user group and branch to edit  form and save new

    """

    if has_partion(request, "change user Info"):
        if request.method == 'GET' and request.is_ajax():

            if 'id' in request.GET.keys():
                if request.GET.get('id'):
                    # try:
                    data = get_object_or_404(UsersDetiles, pk=request.GET.get('id'))
                    form = UserDetailForm(request.POST or None, instance=data)
                    # except:
                    # form = UserDetailForm(requst.GET , instance= data)
                    # form = UserDetailForm()

                context = {
                    'form': form,
                    'id': data.pk,
                    'title_form': _('Add Type Device View '),
                    'title_list': _('Lsit Type Device Type View '),
                }
                return render(request, 'model.html', context)

        elif request.method == 'POST':
            if request.POST.get('id'):
                data = get_object_or_404(UsersDetiles, pk=int(request.POST.get('id')))
                form = UserDetailForm(request.POST, instance=data)

            if form.is_valid():
                try:
                    with transaction.atomic():
                        obj = form.save(commit=False)
                        if obj.is_superuser is True:
                            if not request.user.is_superuser:
                                result = {'status': 2, 'message': message.add_error(_("D' JECFC 'D*9/JD 9DI (J'F'*  G0' 'DE3*./E"))}
                                return JsonResponse(result)
                        obj.save()
                     
                        # UsersDetilesUserBranch.objects.create(usersdetiles_id=,branch_id=)
                        if not obj.is_superuser is True:
                            form.save_m2m()
                except:
                    result = {'status': 0, 'error': message.add_error(_("error"))}
                if request.POST.get('id'):
                    if obj.id:
                        msg = message.update_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.edit_error()
                        result = {'status': 2, 'message': msg}
                else:
                    if obj.id:
                        msg = message.add_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.add_error(request)
                        result = {'status': 2, 'message': msg}
            else:
                result = {'status': 0, 'error': form.errors.as_json()}
        else:
            result = {'status': 0, 'error': message.add_error(_("request method not Accepted"))}
    else:
        result = {'status': 0, 'error': message.add_error(_("You Not hav Permission"))}
    return JsonResponse(result)


class UsersDetilesListJson(BaseDatatableView):
    """
    Users  To Show in Table
    Returns:
        [json] -- List From  Users List  To Show
    """
    model = UsersDetiles
    columns = [
        "id",
        "emplayee",
        'username',
        'status',
        "action",
    ]
    order_columns = [
        "id",
        "emplayee",
        'username',
        'status',
        "action",
    ]

    count = 0

    def render_column(self, row, column):
        """Render Column For Datatable
        """
        if not has_screen(self.request, 'usersdetiles', "view"):
            return
        if column == "id":
            self.count += 1
            return self.count
        if column =='status':
            if row.active:
                return 'نشط'
            else:
                return 'موقف'
        if column == "user_permission_group":
            group_name = " "
            for x in row.user_permission_group():
                group_name += str(x) + "-"  + "<br>"
            return group_name
        if column == "user_branch":
            branch_name = " "
            for n in row.user_branch():
            # for n in UsersDetilesUserBranch.objects.filter(usersdetiles_id=1).distinct('branch_id'):
                branch_name += str(n) + "-" + "<br>"
            return branch_name
        if column == "action":

            if not has_screen(self.request, 'usersdetiles', "edit") and not has_screen(self.request, 'usersdetiles',
                                                                                "delete") and not has_partion(
                    self.request, "change user password") and not has_partion(self.request, "change user Info"):
                return

            action_var = ""
            if has_screen(self.request, 'usersdetiles', "edit"):  # check permission
                action_var = action_var + '' + '<a class="edit_row1" data-url="{5}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  data-toggle="tooltip" title="{1}"><i class="fa fa-edit"></i></a>-----'.format(
                    row.pk, _("Edit"), _("Edit Password"), _("Edit User Group"), _("Delete"),
                    reverse("UsersDetilesView"), reverse("UsersDetilesViewPassword"),
                    reverse("UsersDetilesViewPermission"))

            # if has_partion(self.request, "change user password"):  # check permission
            #     action_var = action_var + '' + '<a class="edit_row2" data-url="{6}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  data-toggle="tooltip" title="{2}"><i class="fa fa-edit"></i></a>----'.format(
            #         row.pk, _("Edit"), _("Edit Password"), _("Edit User Group"), _("Delete"),
            #         reverse("UsersDetilesView"), reverse("UsersDetilesViewPassword"),
            #         reverse("UsersDetilesViewPermission"))

           

            if has_screen(self.request, 'usersdetiles', "delete"):  # check permission
                action_var = action_var + '' + '<a class="delete_row" data-url="{5}" data-id="{0}"  style="    DISPLAY: -webkit-inline-box;"     data-toggle="tooltip" title="{4}"><i class="fa fa-trash"></i></a>'.format(
                    row.pk, _("delete"), _("delete user"), _("Edit User Group"), _("Delete"),
                    reverse("UsersDetilesView"), reverse("UsersDetilesViewPassword"),
                    reverse("UsersDetilesViewPermission"))
            return action_var
        else:
            return super(UsersDetilesListJson, self).render_column(row, column)

    def filter_queryset(self, qs):
        """To Filter data in table using in search
        """
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            qs = qs.filter(
                Q(username__icontains=sSearch)

            )
        return qs


class TypeDeviceView(CreateView):
    """
    Type Device  View for create new Type Device 
    """

    def get(self, request, *args, **kwargs):
        request.session["top_menu"] = {"system_administration": "active"}
        request.session["sup_top_menu"] = {"permation_and_security": "active mm-active"}
        request.session["sub_menu"] = {"users": "activeli"}

 
        request.session["sub_menu"] = {"typedevice": "activeli"}
        context = {}
        # if has_screen(request,'users','add'):
        if 'id' in request.GET.keys():
            if request.GET.get('id'):
                if not has_screen(request, 'type_device', 'edit'):
                    result = {'status': 0, 'data': ''}
                    return JsonResponse(result)
                try:
                    data = TypeDevice.objects.filter(pk=request.GET.get('id'))
                    result = {'status': 1, 'data': serializers.serialize('json', data)}
                except:
                    result = {'status': 0, 'data': ''}
            else:
                result = {'status': 0, 'data': ''}

            return JsonResponse(result)
        else:
            if has_screen(request, 'type_device', 'add') or has_screen(request, 'type_device', 'edit'):
                context['form'] = TypeDeviceForm()
            context['url'] = reverse('TypeDeviceView')
            context['title_form'] = _('Adding Type Device View ')
            context['title_list'] = _('List Device Type View ')
            return render(request, 'typedevice.html', context)

    def post(self, request, *args, **kwargs):
        if request.POST.get('id'):
            if not has_screen(request, 'type_device', 'edit'):
                result = {'status': 2, 'message': message.permission_error()}
                return JsonResponse(result)
            data = get_object_or_404(TypeDevice, pk=int(request.POST.get('id')))
            form = TypeDeviceForm(request.POST, instance=data)
        else:
            if not has_screen(request, 'type_device', 'add'):
                result = {'status': 2, 'message': message.permission_error()}
                return JsonResponse(result)
            form = TypeDeviceForm(request.POST or None)
        if request.method == 'POST' and request.is_ajax():
            if form.is_valid():
                obj = form.save()
                obj.save()
                if request.POST.get('id'):
                    if obj.id:
                        msg = message.update_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.edit_error()
                        result = {'status': 2, 'message': msg}
                else:
                    if obj.id:
                        msg = message.add_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.add_error(request)
                        result = {'status': 2, 'message': msg}
            else:
                result = {'status': 0, 'error': form.errors.as_json()}
        else:
            result = {'status': 2, 'error': message.request_error()}
        return JsonResponse(result)

    def delete(self, request, *args, **kwargs):
        if not has_screen(request, 'type_device', 'delete'):
            msg = message.delete_error(_("you have not permission"))
            result = {'status': 0, 'message': msg}
            return JsonResponse(result)

        pk = int(QueryDict(request.body).get('id'))
        if pk:
            try:
                data = get_object_or_404(TypeDevice, pk=pk)
                data.delete()
                msg = message.delete_successfully()
                result = {'status': 1, 'message': msg}
            except:
                msg = message.delete_error()
                result = {'status': 0, 'message': msg}
        else:
            msg = message.delete_error()
            result = {'status': 0, 'message': msg}
        return JsonResponse(result)


class TypeDeviceListJson(BaseDatatableView):
    """Type Device  To Show in Table
    Returns:
        [json] -- List From  Type Device List  To Show
    """

    model = TypeDevice
    columns = [
        "id",
        'name_device',
        'mac_address',
        'ip_address',
        'serel_cpu',
        "action",
    ]
    order_columns = [
        "id",
        'name_device',
        'mac_address',
        'ip_address',
        'serel_cpu',
        "action",
    ]
    count = 0

    def render_column(self, row, column):
        """Render Column For Datatable
        """
        if not has_screen(self.request, 'type_device', "view"):
            return

        if column == "id":
            self.count += 1
            return self.count
        elif column == "action":
            if not has_screen(self.request, 'type_device', "edit") and not has_screen(self.request, 'type_device',
                                                                                      "delete"):
                return
            action_var = ""
            if has_screen(self.request, 'type_device', "edit"):
                action_var = action_var + ' ' + '<a class="edit_row" data-url="{3}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  data-toggle="tooltip" title="{1}"><i class="fa fa-edit"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("TypeDeviceView"))
            if has_screen(self.request, 'type_device', "delete"):
                action_var = action_var + ' ' + '<a class="delete_row" data-url="{3}" data-id="{0}"  style="    DISPLAY: -webkit-inline-box;"     data-toggle="tooltip" title="{2}"><i class="fa fa-trash"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("TypeDeviceView"))

            return action_var
        else:
            return super(TypeDeviceListJson, self).render_column(row, column)

    def filter_queryset(self, qs):
        """To Filter data in table using in search
        """
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            qs = qs.filter(
                Q(name_device__icontains=sSearch)
                | Q(mac_address__icontains=sSearch)
                | Q(ip_address__icontains=sSearch)
                | Q(serel_cpu__icontains=sSearch)
            )
        return qs


class UsersGroupView(CreateView):
    """
    Users Group  View for created  
    """

    def get(self, request, *args, **kwargs):
        # request.session["top_menu"] = {"users": "active"}
        # request.session["sup_top_menu"] = {"users_Initialization": "active"}
        # request.session["sub_menu"] = {"user_group": "active"}
    
        request.session["top_menu"] = {"system_administration": "active"}
        request.session["sup_top_menu"] = {"permation_and_security": "active mm-active"}
        request.session["sub_menu"] = {"users": "activeli"}
        request.session["sub_menu"] = {"user_group": "activeli"}
 

        context = {}
        if 'id' in request.GET.keys():
            if not has_screen(request, 'users_group', 'edit'):
                result = {'status': 0, 'data': ''}
                return JsonResponse(result)
            if request.GET.get('id'):
                try:
                    data = UsersGroup.objects.filter(pk=request.GET.get('id'))
                    result = {'status': 1, 'data': serializers.serialize('json', data)}
                except:
                    result = {'status': 0, 'data': 'ee'}
            else:
                result = {'status': 0, 'data': ''}
            return JsonResponse(result)
        else:
            if has_screen(request, 'users_group', 'add') or has_screen(request, 'users_group', 'edit'):
                context['form'] = UsersGroupForm()
            context['url'] = reverse('UsersGroupView')
            context['title_form'] = _('Add Users Group View ')
            context['title_list'] = _('List Users Group  View ')
            return render(request, 'usersgroup.html', context)

    def post(self, request, *args, **kwargs):
        if request.POST.get('id'):
            if not has_screen(request, 'users_group', 'edit'):
                result = {'status': 2, 'message': message.add_error(_("Sorry You not have permssion"))}
                return JsonResponse(result)
            data = get_object_or_404(UsersGroup, pk=int(request.POST.get('id')))
            form = UsersGroupForm(request.POST, instance=data)
        else:
            if not bool(has_screen(request, 'users_group', 'add')):
                result = {'status': 2, 'message': message.add_error(_("Sorry You not have permssion"))}
                return JsonResponse(result)
            form = UsersGroupForm(request.POST)

        if request.method == 'POST' and request.is_ajax():
            if form.is_valid():
                obj = form.save()
                obj.save()
                if request.POST.get('id'):
                    if obj.id:
                        msg = message.update_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.edit_error()
                        result = {'status': 2, 'message': msg}
                else:
                    if obj.id:
                        msg = message.add_successfully()
                        result = {'status': 1, 'message': msg}
                    else:
                        msg = message.add_error(request)
                        result = {'status': 2, 'message': msg}
            else:
                result = {'status': 0, 'error': form.errors.as_json()}
        else:
            result = {'status': 2, 'error': _("Request Method not Accepted")}
        return JsonResponse(result)

    def delete(self, request, *args, **kwargs):
        if not has_screen(request, 'users_group', 'delete'):
            msg = message.delete_error(_("you have not permission"))
            result = {'status': 0, 'message': msg}
            return JsonResponse(result)
        pk = int(QueryDict(request.body).get('id'))
        if pk:
            try:
                data = get_object_or_404(UsersGroup, pk=pk)
                data.delete()
                msg = message.delete_successfully()
                result = {'status': 1, 'message': msg}
            except:
                msg = message.delete_error()
                result = {'status': 0, 'message': msg}
        else:
            msg = message.delete_error()
            result = {'status': 0, 'message': msg}
        return JsonResponse(result)


class UsersGroupListJson(BaseDatatableView):
    """Users Group  To Show in Table
    Returns:
        [json] -- List From  Users Group List  To Show
    """

    model = UsersGroup
    columns = [
        "id",
        'name_ar',
        'name_en',
        "action",
    ]
    order_columns = [
        "id",
        'name_ar',
        'name_en',
        "action",
    ]
    count = 0

    def render_column(self, row, column):
        """Render Column For Datatable
        """
        if not has_screen(self.request, 'users_group', "view"):
            return
        if column == "id":
            self.count += 1
            return self.count
        elif column == "action":
            action_var = ""
            if not has_screen(self.request, 'users_group', "edit") and not has_screen(self.request, 'users_group',
                                                                                      "delete"):
                return
            if has_screen(self.request, 'users_group', "edit"):
                action_var = action_var + " " + '<a class="edit_row" data-url="{3}" data-id="{0}" style="DISPLAY: -webkit-inline-box;"  data-toggle="tooltip" title="{1}"><i class="fa fa-edit"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("UsersGroupView"))
            if has_screen(self.request, 'users_group', "delete"):
                action_var = action_var + " " + '<a class="delete_row" data-url="{3}" data-id="{0}"  style="    DISPLAY: -webkit-inline-box;"     data-toggle="tooltip" title="{2}"><i class="fa fa-trash"></i></a>'.format(
                    row.pk, _("Edit"), _("Delete"), reverse("UsersGroupView"))
            return action_var
        else:
            return super(UsersGroupListJson, self).render_column(row, column)

    def filter_queryset(self, qs):
        """To Filter data in table using in search
        """
        sSearch = self.request.GET.get("sSearch", None)
        if sSearch:
            qs = qs.filter(
                Q(name_ar__icontains=sSearch)
                | Q(name_en__icontains=sSearch)

            )
        return qs


def load_branch_device(request):
    """
    
    return the device that branches has by the [ids] that get from ajax on or more id
    ex.... [1,2,2] 
    """

    if 'id' in request.GET.keys():
        if request.GET.get('id'):
            try:
                data = TypeDevice.objects.filter(branch__id__in=json.loads(request.GET.get('id')))
                result = {'status': 1, 'data': serializers.serialize('json', data)}
            except:
                result = {'status': 0, 'data': ''}
        else:
            result = {'status': 0, 'data': ''}
            return JsonResponse(result)


def change_db(request):
    ob_db = SaveDB()
    if request.GET.get('year_db') == '':
        db_name = "default"
    else:
        db_name = request.GET.get('year_db')
    
    ob_db.make_copy(db_name)
    context = {
        'form': LoginForm(db_name = db_name),
    }
    
    return render(request, 'login_load_form.html', context)


# from django.contrib.auth.decorators import login_required
# import signal
def SigIntHand(SIG, FRM):
    print("Please Right click-copy. Ctrl-C does not work on the cmd prompt")


    
def login(request):
    # form = LoginDataForm(request.POST or None)
    form2 = LoginForm(request.POST or None)

    context = {}
    logout_user(request)
    
    
    if request.method == 'POST':
        password = request.POST['password']
        username = request.POST['username']
        request.session['db_name'] = "trainers" 
        context=[]    

        if form2.is_valid():

            user = authenticate(username=username, password=password)
            if user is not None:
                if user.active:
                
                    login_user(request, user)
                    
                    
                    
                    
                    set_session_variables(request,

                    
                    permission= get_all(request),
                    permission_partion= get_all_partion(request),
                    )
                    def isNum(data):
                        try:
                            int(data)
                            return True
                        except ValueError:
                            return False
                    
                    request.session['years_prod'] = "trainers"
                    
                    # تعيين وقت انتهاء الجلسة بعد 30 دقيقة
                    request.session.set_expiry(1800)
                    # if Activ:
                    if request.GET.get('next'):
                        homee=request.GET.get('next')
                    else:
                        homee=request.GET.get('/')
                    return redirect(homee)
            
    return render(request, 'login.html', { 'form2': form2,"context":context})

def logout(request):
    cache.delete('branch')
    return redirect(settings.LOGOUT_REDIRECT_URL)
    # logout_user(request)




def load_branch_device(request):
    if 'id' in request.GET.keys():

        if request.GET.get('id'):
            try:
                data = TypeDevice.objects.filter(branch__id__in=json.loads(request.GET.get('id')))
                result = {'status': 1, 'data': serializers.serialize('json', data)}
            except:
                result = {'status': 0, 'data': ''}
        else:
            result = {'status': 0, 'data': ''}
        return JsonResponse(result)


def change_branch(request):
    from django.utils.http import url_has_allowed_host_and_scheme
    from urllib.parse import unquote
    from our_core.models import Branch
    next = request.POST.get('next', request.GET.get('next'))
    if (
            (next or not request.is_ajax()) and
            not url_has_allowed_host_and_scheme(
                url=next, allowed_hosts={request.get_host()}, require_https=request.is_secure(),
            )
    ):
        next = request.META.get('HTTP_REFERER')
        next = next and unquote(next)  # HTTP_REFERER may be encoded.
        if not url_has_allowed_host_and_scheme(
                url=next, allowed_hosts={request.get_host()}, require_https=request.is_secure(),
        ):
            next = '/'
            response = HttpResponseRedirect(next) if next else HttpResponse(status=204)
            return response
    if request.method == "POST":
        # get_object_or_404(Branch,pk=request.POST['branch'])

        if UsersDetiles.objects.filter(pk=request.user.pk, user_branch=request.POST['branch']):
            cache.set("branch", request.POST['branch'])
            request.session['branch_id'] = request.POST['branch']
            request.session['permission'] = get_all(request)
            request.session['permission_partion'] = get_all_partion(request)
        else:
            pass
    # from reporters.reporter_query_manger import set_defualt
    # set_defualt(request.session.session_key, int(request.POST['branch']))
    response = HttpResponseRedirect(next) if next else HttpResponse(status=204)
    return response


def test(requset):
    for i in range(1, 8):

        obj = Systems.objects.create(system_name="system_" + str(i), system_code="system_" + str(i))
        for s_t in range(1, 8):

            obj1 = SystemTabs.objects.create(tab_name="tab_" + str(s_t) + "_" + str(i),
                                             tab_code="tab_" + str(s_t) + "_" + str(i), system=obj)
            for t_s in range(1, 10):
                TabScreens.objects.create(screen_name="screen_" + str(t_s) + "_" + str(s_t) + "_" + str(i),
                                          screen_code="screen_" + str(t_s) + "_" + str(s_t) + "_" + str(i),
                                          has_view=True, has_add=True, has_edit=True, has_delete=True, has_print=True,
                                          system_tabs=obj1)
                # TabPartionsPermission.objects.create(permission_name="partion",is_active,tab_screens)
    return HttpResponse('x')


from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(request):
    # try:
    user = request.POST.get('id')
    token, _ = Token.objects.get_or_create(user=UsersDetiles.objects.get(id=user))  # Efficient token creation
    result = {'status': 1, 'data': token.key}
    print(result)
    return JsonResponse(result)
    # Handle the error gracefully (e.g., log or send notification)