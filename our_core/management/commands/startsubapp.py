from django.core.management.base import BaseCommand
import os,re
from django.core.management.templates import TemplateCommand
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
import argparse
import shutil
from importlib import import_module
from django.utils.translation import ugettext_lazy as _

def modify_hooks_file(list_app, hooks_file_path):
    """
    Modifies the hooks_file to add the provided app_name to the sub_app_name list.

    Args:
        list_app: A list containing sub-app names.
        hooks_file_path: The path to the hooks file.
    """
    try:
        # Read the file content
        with open(hooks_file_path, 'r') as hooks_file:
            lines = hooks_file.readlines()

        # Find the line that contains the sub_app_name parameter
        for i, line in enumerate(lines):
            if line.startswith("sub_app_name"):
                # Remove the existing sub_app_name line
                lines.pop(i)
                break

        # Construct the modified sub_app_name line
        modified_sub_app_name_str = f'sub_app_name = {list_app}\n'

        # Insert the modified sub_app_name line at the appropriate position
        lines.insert(i, modified_sub_app_name_str)

        # Write the modified content back to the file
        with open(hooks_file_path, 'w') as hooks_file:
            hooks_file.writelines(lines)
    except Exception as e:
        print("An error occurred:", str(e))
        # Perform rollback or error handling actions here
from django.apps import apps

def get_app_from_table_name(table_name):
    """
    Retrieves the app name associated with the specified table name.

    Args:
        table_name (str): The table name as a text string.

    Returns:
        str: The name of the app containing the table, or None if not found.
    """

    for app_config in apps.get_app_configs():
        for model in app_config.models.values():
            if model._meta.db_table.lower() == (app_config.name+"_"+table_name).lower():
                return app_config.name
    return None
def control_sidbar(table_name,name_code,choices=1):
    from our_core.models import SidebarItem,Branch
    from permission.models import TabScreens,SystemTabs,Systems,BranchSystem,GroupSystems,PermissionGroup
    
    if choices == 1:
        sidebar_items = SidebarItem.objects.filter(is_active=True,name_code=name_code)
        if sidebar_items:
            SidebarItem.objects.create(
                parent_id=sidebar_items.values("id")[0]['id'],
                title_ar= _(split_camel_case(table_name," ")),
                title_en= split_camel_case(table_name," "),
                name_code= table_name+"View",
                url= table_name+"View",
                is_sub_parent= False,
                is_active= True,
            )
            app_name = get_app_from_table_name(str(table_name))

            if app_name:
                system_tabs = SystemTabs.objects.filter(tab_code=app_name)
                
                if not system_tabs:
                    systm = Systems.objects.create(
                        system_name=app_name,
                        system_name_ar=split_camel_case(app_name, " "),
                        system_code=app_name,
                        is_active=True
                    )
                    system_tabs = SystemTabs.objects.create(
                        tab_code=app_name,
                        tab_name=app_name,
                        tab_name_ar=app_name,
                        is_system=True,
                        system=systm
                    )
                    BranchSystem.objects.create(
                        branch=Branch.objects.first(),
                        system=systm,
                    )
                    for oup_ in PermissionGroup.objects.all():
                        GroupSystems.objects.create(
                            is_active=True,
                            systems=systm,
                            group_id=oup_.id
                        )
                        

                    system_tabs=system_tabs.id
                else:
                    system_tabs=system_tabs.values("id")[0]['id']
                tabscreens=TabScreens.objects.filter(screen_code=table_name+"View")
                if not tabscreens:
                    tabscreens=TabScreens.objects.create(
                        screen_name=table_name,
                        screen_name_ar=_(split_camel_case(table_name," ")),
                        screen_code=table_name+"View",
                        has_view=True,
                        has_add=True,
                        has_edit=True,
                        has_delete=True,
                        has_print=True,
                        is_active=True,
                        system_tabs_id=system_tabs
                    )
        print("Added sidebar items successfully")
    else:
        sidebar_items = SidebarItem.objects.filter(is_active=True,name_code=table_name+"View").delete()
        tabscreens=TabScreens.objects.filter(screen_code=table_name+"View").delete()
        
        print("delete sidebar items successfully")

def split_camel_case(word,ty='-'):
    return re.sub(r'(?<!^)(?=[A-Z])', ty, word).lower()
class Command(BaseCommand):
    help = 'command add sub app'

    def add_arguments(self, parser):
        parser.add_argument('--remove', dest='remove_app', action='store_true', help='Remove the app_name')
        parser.add_argument('-rm', dest='rm_app', action='store_true', help='Remove the app_name')
        parser.add_argument('directory', type=str, help='The app directory')
        parser.add_argument('app_name', type=str, help='The target app_name')
        parser.add_argument('--sidebar', dest='sidebar_name_code', action='store_true', help='name sidebar parent__name_code')
        
    def handle(self, *args, **options):
        """ 
            remove_app = options['remove_app']: This line is assigning the value associated with the key 'remove_app' in the options dictionary to a new variable named remove_app.
            rm_app = options['rm_app']: This line is doing the same thing as the previous line, but assigning the value to a variable named rm_app. It seems redundant since it's assigning the same value to a different variable.
            app_directory = options['directory']: This line is assigning the value associated with the key 'directory' in the options dictionary to a new variable named app_directory.
            app_name = options['app_name']: This line is assigning the value associated with the key 'app_name' in the options dictionary to a new variable named app_name.
            sidebar_name_code = options['sidebar_name_code']: This line is assigning the value associated with the key 'sidebar_name_code' in the options dictionary to a new variable named sidebar_name_code.
            BASE_DIR = settings.BASE_DIR: This line is assigning the value of the BASE_DIR attribute of the settings module to a variable named BASE_DIR.
        """
        remove_app = options['remove_app']
        rm_app = options['rm_app']
        app_directory = options['directory']
        app_name = options['app_name']
        sidebar_name_code = options['sidebar_name_code']
        BASE_DIR = settings.BASE_DIR
              
        model_path = os.path.join(BASE_DIR,app_directory)
        if not os.path.exists(model_path):
            """
                check is found app master
            
            """
            print(f"ERROR: The app {app_directory}  does not  exist.")
            return
        hooks_file_path = os.path.join(BASE_DIR,app_directory, 'hooks.py')
        views_file_path = os.path.join(BASE_DIR,app_directory, split_camel_case(app_name,"_"), 'views.py')
        forms_file_path = os.path.join(BASE_DIR,app_directory, split_camel_case(app_name,"_"), 'forms.py')
        __init_file_path = os.path.join(BASE_DIR,app_directory, split_camel_case(app_name,"_"), '__init__.py')
        urls_file_path = os.path.join(BASE_DIR,app_directory, split_camel_case(app_name,"_"), 'urls.py')
        template_file_path = os.path.join(BASE_DIR,app_directory, split_camel_case(app_name,"_"))
        name_code=app_directory
        
        # Handle app removal based on 'remove_app' or 'rm_app' flags
        if remove_app or rm_app:
            if os.path.exists(template_file_path):
                list_app=[]
                sub_apps_module = import_module(app_directory+".hooks")
                list_app=sub_apps_module.sub_app_name
                control_sidbar(app_name,name_code,0)
                if split_camel_case(app_name,"_") in list_app:
                    list_app.remove(split_camel_case(app_name,"_"))
                # Delete the folder
                shutil.rmtree(template_file_path)
                if os.path.exists(hooks_file_path):
                    modify_hooks_file(list_app,hooks_file_path)
                print(f"The app {app_directory}/{app_name} has been deleted.")
                return False
            else:
                print(f"The app {app_directory}/{app_name}  does not exist.")
                return False
        folder_path = os.path.join(template_file_path)
        
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        if os.path.exists(hooks_file_path):
            list_app=[]
            sub_apps_module = import_module(app_directory+".hooks")
            list_app=sub_apps_module.sub_app_name
            if app_name in list_app :
                print(f"The app {app_directory}/{app_name}  is exist.")
                return 
            else:
                list_app+=[str(split_camel_case(app_name,"_"))]
                modify_hooks_file(list_app, hooks_file_path)
        else:
            with open(hooks_file_path, 'w') as hooks_file:
                hooks_file.write('''
"""
hooks models {1}
"""
app_name = "{1}"
app_title = "{1}"
app_publisher = ""
app_description = ""
sub_app_name = ["{0}"]
'''.format(split_camel_case(app_name,"_"),app_directory))

        with open(urls_file_path, 'w') as urls_file:
            urls_file.write('''
"""
url models {0}
"""
from django.urls import path,include
from {1}.{3} import views
urlpatterns = [
    path("{2}",views.{0}View.as_view(),name="{0}View")
    
]
            '''.format(app_name,app_directory,split_camel_case(app_name),split_camel_case(app_name,"_")))

        # --------------------------------------
        generic_createview = os.path.join(os.path.dirname(__file__), "tempr/generic_createview.py")
        view_class_template=''
        with open(generic_createview, 'r') as template_file:
            view_class_template = template_file.read()

        formatted_view_class = view_class_template.format(app_name=split_camel_case(app_name,"_"), app_directory=app_directory,app_model=app_name,title_form=split_camel_case(app_name," "))
        formatted_view_class=formatted_view_class.replace("-|","{").replace("|-","}").replace("} }","}}")
        with open(views_file_path, 'w') as view_file:
            try:
                view_file.write(formatted_view_class)
            except IOError as e:
                print(f"Error writing view file: {e}")
        # --------------------------------------
        

        # --------------------------------------
        generic_createview = os.path.join(os.path.dirname(__file__), "tempr/genric_createform.py")
        view_class_template=''
        with open(generic_createview, 'r') as template_file:
            view_class_template = template_file.read()

        formatted_view_class = view_class_template.format(app_name=app_name, app_directory=app_directory)
        formatted_view_class=formatted_view_class.replace("-|","{").replace("|-","}").replace("} }","}}")
        with open(forms_file_path, 'w') as view_file:
            try:
                view_file.write(formatted_view_class)
            except IOError as e:
                print(f"Error writing view file: {e}")
        # --------------------------------------
        
        
        
        
        
        with open(__init_file_path, 'w') as __init_file_path_:
            __init_file_path_.write("")
        
        control_sidbar(app_name,name_code)
    

