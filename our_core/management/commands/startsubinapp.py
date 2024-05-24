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
from django.apps import apps

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

def split_camel_case(word,ty='-'):
    return re.sub(r'(?<!^)(?=[A-Z])', ty, word).lower()

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

def control_sidbar(table_name,name_code,choices=1,is_sub_parent_=False,url_l=None,is_system_=False):
    from our_core.models import SidebarItem,Branch
    from permission.models import TabScreens,SystemTabs,Systems,BranchSystem,GroupSystems,PermissionGroup
    
    if choices == 1:
        sidebar_items = SidebarItem.objects.filter(is_active=True,name_code=name_code)
        if sidebar_items:
            if not url_l:
                url_=table_name+"View"
            else:
                url_=url_l
            if is_sub_parent_:
                table_name_=table_name
                SidebarItem.objects.create(
                    parent_id=sidebar_items.values("id")[0]['id'],
                    title_ar= _(split_camel_case(table_name," ")),
                    title_en= split_camel_case(table_name," "),
                    name_code= table_name,
                    url= url_,
                    is_sub_parent= is_sub_parent_,
                    icon_right="metismenu-state-icon pe-7s-angle-down caret-left",
                    is_active= True,
                )
            else:
                table_name_=table_name+"View"

                SidebarItem.objects.create(
                    parent_id=sidebar_items.values("id")[0]['id'],
                    title_ar= _(split_camel_case(table_name," ")),
                    title_en= split_camel_case(table_name," "),
                    name_code= table_name+"View",
                    url= url_,
                    is_sub_parent= is_sub_parent_,
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
                        screen_code=table_name_,
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

class Command(BaseCommand):
    help = 'Command to add or manage sub apps'

    def add_arguments(self, parser):
        parser.add_argument('--remove', dest='remove_app', action='store_true', help='Remove the app_name')
        parser.add_argument('-rm', dest='rm_app', action='store_true', help='Remove the app_name')
        parser.add_argument('parent_app', type=str, help='The target parent_app')
        parser.add_argument('child_app', type=str, help='The target child_app')
        parser.add_argument('app_name', nargs='?', type=str, help='The target app_name (optional)')


    def handle(self, *args, **options):

        remove_app = options['remove_app']
        rm_app = options['rm_app']
        parent_app = options['parent_app']
        child_app = options['child_app']
        app_name =""
        if "app_name" in options:
            if options['app_name']:
                app_name = options['app_name']
        BASE_DIR = settings.BASE_DIR
        model_path = os.path.join(BASE_DIR,parent_app,child_app)
        # Improved logic for handling parent and child app options
        if not parent_app or not child_app:
            print("""usage: manage.py startsubinapp [-h] [--remove] [--parent PARENT_APP] [--child CHILD_APP] [-r] [--version] [-v {0,1,2,3}] [--settings SETTINGS]
                               [--pythonpath PYTHONPATH] [--traceback] [--no-color] [--force-color] [--skip-checks]""")
            return False
        hooks_file_path = os.path.join(BASE_DIR,parent_app,child_app, 'subhooks.py')
        parent_hooks_file_path = os.path.join(BASE_DIR,parent_app, 'hooks.py')
        if app_name:
            if not os.path.exists(model_path):
                """
                    check is found app master
                
                """
                print(f"ERROR: The app {child_app}  does not  exist.")
                return False
            
            # Handle app removal based on 'remove_app' or 'rm_app' flags
            if remove_app or rm_app:
                if os.path.exists(os.path.join(BASE_DIR,parent_app,child_app,app_name)):
                    list_app=[]
                    sub_apps_module = import_module(parent_app+"."+child_app+".subhooks")
                    list_app=sub_apps_module.sub_app_name
                    control_sidbar(app_name,child_app,0)
                    if split_camel_case(app_name,"_") in list_app:
                        list_app.remove(split_camel_case(app_name,"_"))
                    # Delete the folder
                    shutil.rmtree(os.path.join(BASE_DIR,parent_app,child_app,app_name))
                    if os.path.exists(hooks_file_path):
                        modify_hooks_file(list_app,hooks_file_path)
                    print(f"The app {parent_app}.{child_app}/{app_name} has been deleted.")
                    return False
                else:
                    print(f"The app {parent_app}.{child_app}/{app_name}  does not exist.")
                    return False
            if not os.path.exists(model_path+"/"+split_camel_case(app_name,"_")):
                os.makedirs(model_path+"/"+split_camel_case(app_name,"_"))
            path_sub_app=model_path+"/"+split_camel_case(app_name,"_")
            if os.path.exists(hooks_file_path):
                list_app=[]
                sub_apps_module = import_module(parent_app+"."+child_app+".subhooks")
                list_app=sub_apps_module.sub_app_name
                if app_name in list_app :
                    print(f"The app {parent_app}.{child_app}/{app_name}  is exist.")
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
'''.format(split_camel_case(app_name,"_"),model_path))    
            urls_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), 'urls.py')
            
            with open(urls_file_path, 'w') as urls_file:
                urls_file.write('''
"""
url models {0}
"""
from django.urls import path,include
from {1}.{4}.{3} import views
urlpatterns = [
    path("{2}",views.{0}View.as_view(),name="{0}View")
    
]
            '''.format(app_name,parent_app,split_camel_case(app_name),split_camel_case(app_name,"_"),child_app))
            views_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), 'views.py')
            forms_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), 'forms.py')
            __init_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), '__init__.py')
            # --------------------------------------
            generic_createview = os.path.join(os.path.dirname(__file__), "tempr/generic_createview.py")
            view_class_template=''
            with open(generic_createview, 'r') as template_file:
                view_class_template = template_file.read()

            formatted_view_class = view_class_template.format(app_name=split_camel_case(app_name,"_"), app_directory=parent_app+"."+child_app,app_model=app_name,title_form=split_camel_case(app_name," "))
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

            formatted_view_class = view_class_template.format(app_name=app_name, app_directory=parent_app+"."+child_app)
            formatted_view_class=formatted_view_class.replace("-|","{").replace("|-","}").replace("} }","}}")
            with open(forms_file_path, 'w') as view_file:
                try:
                    view_file.write(formatted_view_class)
                except IOError as e:
                    print(f"Error writing view file: {e}")
            # --------------------------------------
            
            
            
            
            
            with open(__init_file_path, 'w') as __init_file_path_:
                __init_file_path_.write("")
            
            control_sidbar(app_name,child_app)

        else:
            __init_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), '__init__.py')
            urls_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), 'urls.py')
            models_file_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"), 'models.py')
            folder_app_path = os.path.join(BASE_DIR,parent_app,child_app, split_camel_case(app_name,"_"))
            # Construct the model path based on provided options (if any)
            
            # create folder sub app
            folder_path = os.path.join(folder_app_path)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            
            # create file hooks in sub app 
            with open(hooks_file_path, 'w') as hooks_file:
                    hooks_file.write('''
"""
sub hooks models {1}.{0}
"""
app_name = "{0}"
app_title = "{1} {0}"
app_publisher = ""
app_description = ""
sub_app_name = []
'''.format(child_app,parent_app))
            if os.path.exists(parent_hooks_file_path):
                list_app=[]
                sub_apps_module = import_module(parent_app+".hooks")
                list_app=sub_apps_module.sub_app_name
                if app_name in list_app :
                    print(f"The app {parent_app}.{child_app}/{app_name}  is exist.")
                    return 
                else:
                    list_app+=[str(split_camel_case(child_app,"_"))]
                    modify_hooks_file(list_app, parent_hooks_file_path)
            else:
                with open(parent_hooks_file_path, 'w') as hooks_file:
                    hooks_file.write('''
"""
hooks models {1}
"""
app_name = "{1}"
app_title = "{1}"
app_publisher = ""
app_description = ""
sub_app_name = ["{0}"]
'''.format(split_camel_case(app_name,"_"),parent_app))
            # create file __init__.py in sub app
            with open(__init_file_path, 'w') as __init_file:
                __init_file.write("")
            # create file models.py in sub app 
            with open(urls_file_path, 'w') as urls_file:
                urls_file.write('''
"""
url models {0}.{1}
"""
from django.urls import path,include
from .subhooks import sub_app_name
urlpatterns = []

if sub_app_name:
    for sub_app_name_ in sub_app_name:
        urlpatterns+=[path("{1}/",include("{0}.{1}"+"."+sub_app_name_+".urls")),]
            '''.format(parent_app,child_app))

            # create file __init__.py in sub app
            with open(models_file_path, 'w') as models_file:
                models_file.write("")

            # create folder templates in sub app
            if not os.path.exists(folder_path+"/templates"):
                os.makedirs(folder_path+"/templates")
            control_sidbar(child_app,parent_app,is_sub_parent_=True,url_l="#")
            