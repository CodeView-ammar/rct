from django.core.management.base import BaseCommand
import os
from django.core.management.templates import TemplateCommand
from pathlib import Path
from django.conf import settings

class Command(TemplateCommand):
    def handle(self, **options):
        app_name = options.pop('name')
        target = options.pop('directory')
        BASE_DIR = settings.BASE_DIR

        # Call handle_template with template_dir argument
        super().handle('app', app_name, target, **options)
        # قم بتعديل الاسم والمسار حسب حاجتك
        hooks_file_path = os.path.join(BASE_DIR, app_name, 'hooks.py')
        urls_file_path = os.path.join(BASE_DIR, app_name, 'urls.py')
        template_file_path = os.path.join(BASE_DIR, app_name)
        folder_path = os.path.join(template_file_path, 'templates')

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        with open(hooks_file_path, 'w') as hooks_file:
            hooks_file.write('''
"""
hooks models {0}
"""
app_name = "{0}"
app_title = "{1}"
app_publisher = ""
app_description = ""
sub_app_name=[]
            '''.format(app_name,app_name))
        with open(urls_file_path, 'w') as urls_file:
            urls_file.write('''
"""
url models {0}
"""
from django.urls import path,include
urlpatterns = []

from .hooks import sub_app_name
if sub_app_name:
   for sub_app_name_ in sub_app_name:
      urlpatterns+=[path("{0}"+"/",include("{0}"+"."+sub_app_name_+".urls")),]
            '''.format(app_name,app_name))
        
        
