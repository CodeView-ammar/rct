        
# from permission.models import Systems , TabPartionsPermission
from django.http import HttpResponseForbidden
from django.shortcuts import render,get_object_or_404,redirect,reverse
from collections.abc import Iterable
# from permission.models import Systems, SystemTabs, TabScreens, GroupScreens, GroupTabs, GroupSystems, PermissionGroup, BranchSystem, Branch, BranchSystemBranchGroup, UsersDetilesUserGroup
from guardian.shortcuts import get_objects_for_user
from django.db import models
from django.apps import apps

def get_all_models():
        all_models = []
        app_configs = apps.get_app_configs()
        
        for app_config in app_configs:
            models = app_config.get_models()
            all_models.extend(models)
        
        return all_models
def get_app_name(model_name):
    models = get_all_models()
    app_label=[]
    for model in models:
        app_label.append(str(model._meta.app_label))
    unique_list = [x for i, x in enumerate(app_label) if x not in app_label[:i]]
    name_app=None
    for unique_list_ in unique_list:
        try:
            model_instance = apps.get_model(str(unique_list_), model_name)
            name_app=unique_list_
            
            break
        except LookupError:
            pass
    return name_app

class permission_class(object):

    def get_all_permission(request):
        """ this function reurn all permission in data base 
        as list[ and inside list dictionary for each permission ]
        take **arg request-> to get user permission group 
        """
        permission_list = [] 


        # result = Systems.objects.filter(
        #     systemtabs__permission_tabscreens__permission_groupscreens__permission_permissiongroup__id=GroupTabs.objects.filter(system_tabs=models.OuterRef('id')).values('group_id'),
        #     permission_groupsystems__group_id=models.OuterRef('permission_permissiongroup__id'),
        #     permission_groupscreens__group_id=models.OuterRef('permission_permissiongroup__id'),
        #     permission_branchsystem__branch_id=request.session.get('branch_id'),
        #     permission_usersdetiles_user_permission_group__usersdetiles_id=request.user.pk,
        #     is_active=True
        # ).order_by('system_code', 'permission_systemtabs__tab_code')
        # for system in Systems.objects.raw('''

        # select 
        # permission_systems.id as id ,
        # permission_systems.system_code as system_code ,
        # permission_systems.system_name as system_name ,
        # permission_groupsystems.is_active as system_active,
        # permission_systemtabs.tab_code as tab_code ,
        # permission_grouptabs.is_active as tab_active,
        # permission_tabscreens.screen_code as screen_code ,
        # permission_tabscreens.is_active as active_screen ,
        # permission_groupscreens.can_view  ,
        # permission_groupscreens.can_add ,
        # permission_groupscreens.can_edit ,
        # permission_groupscreens.can_delete ,
        # permission_groupscreens.can_print  
        #     from permission_systems 
        # join permission_systemtabs
		# on permission_systems.id = permission_systemtabs.system_id 
		# join permission_tabscreens 
		# on permission_systemtabs.id = permission_tabscreens.system_tabs_id
		# left join permission_groupscreens 
		# on permission_groupscreens.tab_screens_id = permission_tabscreens.id
		# left join permission_grouptabs 
		# on permission_systemtabs.id = permission_grouptabs.system_tabs_id 
		# left join permission_groupsystems
		# on permission_systems.id = permission_groupsystems.systems_id 
        # join permission_permissiongroup
		# on permission_permissiongroup.id = permission_grouptabs.group_id 
		# and
		# permission_permissiongroup.id = permission_groupsystems.group_id
		# and permission_permissiongroup.id = permission_groupscreens.group_id 
		# join permission_branchsystem 
		# on permission_branchsystem.system_id = permission_systems.id 
		# join our_core_branch
		# on permission_branchsystem.branch_id = our_core_branch.id 
		# join permission_usersdetiles_user_permission_group
		# on 
	    # permission_usersdetiles_user_permission_group.permissiongroup_id = permission_permissiongroup.id
		# where 
		# permission_usersdetiles_user_permission_group.usersdetiles_id = %s
		# and our_core_branch.id = %s
        # and permission_systems.is_active = %s
        # order by  system_code ,tab_code 
        #                                 ''',[request.user.pk,request.session.get('branch_id'),True]):
                                        
        dic  = {}
        
        # dic['id'] = system.id
        # dic['system_code'] = system.system_code
        # dic['system_name'] = system.system_name
        # dic['tab_code'] = system.tab_code
        # dic['screen_code'] = system.screen_code
        # dic['active_screen'] = system.active_screen
        # dic['tab_active'] = system.tab_active
        # dic['system_active'] = system.system_active
        dic['view'] = "True"
        dic['add'] = "True"
        dic['edit'] = "True"
        dic['delete'] = "True"
        dic['print'] = "True"
        permission_list.append(dic)
        return permission_list


    def get_all_permission_partion(request):
        """ this function reurn all partion permission in database 
        as list[ and inside list dictionary for each permission ]
        take **arg request-> to get user permission group 
        """
        partion_list = [] 
        dic  = {}
        # dic['id'] = system.id
        # dic['partion_code'] = system.partion_code
        # dic['has_permission'] = system.has_permission
        # dic['system_code'] = system.system_code
        # dic['system_active'] = system.system_active
        # dic['tab_code'] = system.tab_code
        partion_list.append(dic)
        return partion_list
    

    def has_screen_permission(self ,screen_code , permission_type):
        """
            return true if user has permission  

            Args:
                screen_code ([screen_code]): [the code of screen]
                permission_type ([view ,add , edit, delete , print]): [the permission that will check if user has it ]
            Returns:
                [true]: [Flase will redirect user to Forbidden page 403] 
        """
        from django.contrib.contenttypes.models import ContentType
        from permission.models import UsersDetiles
        from guardian.shortcuts import assign_perm,get_perms
        from guardian.shortcuts import get_group_perms
        # Ensure model_name is a valid model class
        content_type =''
        if screen_code:
            screen_code=screen_code.split('View')[0]
            if get_app_name(screen_code.lower()):
                Model = apps.get_model(app_label=get_app_name(screen_code.lower()),model_name=screen_code.lower())
                content_type = ContentType.objects.get_for_model(Model)


        if content_type:
            try:
                dic  = {}
                user = self.user     
                if permission_type =="view":
                    permission_type=content_type.app_label+".view_"+screen_code.lower()
                if permission_type == "edit":
                    permission_type=content_type.app_label+".change_"+screen_code.lower()
                if permission_type == "delete":
                    permission_type=content_type.app_label+".delete_"+screen_code.lower()
                if permission_type == "add":
                    permission_type=content_type.app_label+".add_"+screen_code.lower()
                if permission_type == "print":
                    permission_type=content_type.app_label+".print"
                if permission_type == "view_sidbar":
                    permission_type=content_type.app_label+".view_sidbar"
                if permission_type == "app_view_permission":
                    permission_type=content_type.app_label+".app_view_permission"
                group = user.groups.first()
                return bool(user.has_perm(str(permission_type)))
            except ContentType.DoesNotExist:
                # Handle the case where the content type is not registered
                raise PermissionError("Content type for model '{}' not found. Ensure the app is registered with Django's content types.".format(self.model_name))
        else:
            return False

    def active_has_screen(self ,screen_code):
        """
            return true if user has permission  

            Args:
                screen_code ([screen_code]): [the code of screen]
                perm ([view ,add , edit, delete , print]): [the permission that will check if user has it ]
            Returns:
                [true]: [Flase will redirect user to Forbidden page 403] 
        """
        if self.user.is_superuser:
            return True 
        permission_class.check_permission_session(self)
        for perm_screen in list(self.session.get('permission')):
            if screen_code == perm_screen['screen_code']:
                if perm_screen["active_screen"]:
                    return True
        return False
    def check_to_redirct_to(self,type,code):
        """
            if user group has some permission and need to check te other permisson in all other index 


            Args:
                type ([1,3]): [to check tab_code permission ], type ([2]):[to check system code permissin]

                code ([the code of tab or system depend on type])

            Returns:
                [type]: [true or False]
        """
        if type == 1:
            return permission_class.has_tab_permission(self,code,True)
        elif type == 2:
            return permission_class.has_system_permission(self,code)      
        elif type == 3:
            return permission_class.has_tab_permission(self,code,False)
        return False
    
    
    def has_tab_permission(self,tab_code,single = None):
        """
            check if user has permission in tab 
            {if user has permission in tab and not have in system will return False}

            Args:
                self ([requset])
                tab_code ([string]): ['tab_code']
                single ([type], optional): [description]. Defaults to None.

            Returns:
                [boolean]: [Treu | False]
        """
        if self.user.is_superuser:
            return True 
        permission_class.check_permission_session(self)
        for perm in list(self.session.get('permission')):
            if single:
                if tab_code == perm['tab_code']:
                    if perm['tab_active']:
                        return True
                    continue

            if tab_code == perm['tab_code']:
                if perm['tab_active'] and perm['system_active']  :
                    return True
                elif perm['tab_active']:
                    return permission_class.has_system_permission(self,perm['system_code'])
        return False
    def has_system_permission(self,system_code,single = None):
        """
            check :  if user has permission in system

            Args:
                self ([request]) 
                system_code ([string]): [system code]

            Returns:
                [boolean]: [description]
        """
        user_groups = self.user.groups.all()
        

        return any(self.user.has_perm(system_code.lower()+'.app_view_permission') for group in user_groups)
    def has_partion_permission(self,partion_code):
        """
            check if user has partion permission 

            Args:
                self ([request]) 
                system_code ([string]): [system code]

            Returns:
                [boolean]: [description]
        """
        if self.user.is_superuser:
            return True 
        permission_class.check_partion_session(self)
        for perm in list(self.session.get('permission_partion')):
            if partion_code == perm['partion_code']:
                if perm['has_permission'] and perm['system_active'] and perm['tab_active']:
                    return True
                elif perm['has_permission'] and perm['system_active']:
                    return permission_class.check_to_redirct_to(self,1,perm['tab_code']) 

                elif perm['has_permission']  and perm['tab_active']:
                    return permission_class.check_to_redirct_to(self,2,perm['system_code'])

                elif perm['has_permission'] and not perm['system_active'] and not perm['tab_active']:
                    return permission_class.check_to_redirct_to(self,3,perm['tab_code'])
        return False    
    def check_partion_session(self):
        if not self.user.is_authenticated:
            return redirect('login')
        if self.user.is_superuser:
            return True 
        if 'permission_partion' not in self.session: 
            self.session['permission_partion'] = permission_class.get_all_permission_partion(self)
        if not isinstance(self.session.get('permission_partion'), Iterable):
            return render(self,'403.html',{})
        return True               
    
    def check_permission_session(self):
        if not self.user.is_authenticated:
            return redirect('login')
        if self.user.is_superuser:
            return True 
        if 'permission' not in self.session: 
            self.session['permission'] = permission_class.get_all_permission(self)
        elif not self.session.get('permission'):
            self.session['permission'] = permission_class.get_all_permission(self)

        if not isinstance(self.session.get('permission'), Iterable):
            return render(self,'403.html',{})
        return True             
def decorator_has_perm(perm_type , perm_code , screen_perm = None):
    """
    decorator To check if user has permission or system or tab 
    or partion permission 
    -------------------------------
    syntax = 
    Args:
        perm_type ([screen| tab | system | partion]): 
        perm_code ([code of tab or system or screen or partion_permission]):
        if perm_type = screen ([view | add | edit | delete | print]) 
    """
    def decorator(function):
        def wrapper(request , *args, **kwargs):
            result = function(request,*args, **kwargs)

            if not request.user.is_authenticated:
                return redirect('login')
            if request.user.is_superuser:
                return result 
            if 'permission' not in request.session:
                request.session['permission'] = permission_class.get_all_permission(request)
            elif not request.session.get('permission'):
                request.session['permission'] = permission_class.get_all_permission(request)
            if not isinstance(request.session.get('permission'), Iterable):
                    return render(request,'403.html',{})             
            if perm_type == 'screen':
                if  not permission_class.has_screen_permission(request,perm_code , screen_perm):
                    return render(request,'403.html',{})
            elif perm_type == "tab":
                if  not permission_class.has_tab_permission(request,perm_code):
                    return render(request,'403.html',{})
            elif perm_type == "system":
                if  not permission_class.has_system_permission(request,perm_code):
                    return render(request,'403.html',{})            
            elif perm_type == "partion":
                if 'permission_partion' not in request.session: 
                    request.session['permission_partion'] = permission_class.get_all_permission_partion(request)
                if not isinstance(request.session.get('permission_partion'), Iterable):
                    return render(request,'403.html',{})
                if  not permission_class.has_partion_permission(request,perm_code):
                    return render(request,'403.html',{})
            return result
        return wrapper
    return decorator


        
get_all = permission_class.get_all_permission
get_all_partion = permission_class.get_all_permission_partion
has_system = permission_class.has_system_permission
has_screen = permission_class.has_screen_permission
active_has_screen = permission_class.active_has_screen
has_tab = permission_class.has_tab_permission
has_partion = permission_class.has_partion_permission
