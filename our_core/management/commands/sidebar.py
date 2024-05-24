from django.core.management.base import BaseCommand
import os,json
from django.core.management.templates import TemplateCommand
from pathlib import Path
from django.conf import settings
from our_core.models import SidebarItem
def create_sidebar_json(model_):
    sidebar_items = model_.objects.all()
    sidebar_data = []

    for item in sidebar_items:
        sidebar_item = {
            'title_ar': item.title_ar,
            'title_en': item.title_en,
            'name_code': item.name_code,
            "parent":(item.parent.name_code if item.parent else ""),
            'url': item.url,
            'icon_left': item.icon_left,
            'icon_right': item.icon_right,
            'url_value': item.url_value,
            'is_sub_parent': item.is_sub_parent,
            'is_active': item.is_active,
            "order":item.order,
            'subitems': []
        }
        # if item.parent:
        #     parent_item = next((x for x in sidebar_data if x['name_code'] == item.parent.name_code), None)
        #     if parent_item:
        #         parent_item['subitems'].append(sidebar_item)
        # if item.is_sub_parent:
        #     parent_item = next((x for x in sidebar_data if x['parent'] == item.parent.name_code), None)
        #     if parent_item:
        #         parent_item['subitems'].append(sidebar_item)
        # else:
        sidebar_data.append(sidebar_item)

    json_data = json.dumps(sidebar_data, ensure_ascii=False, indent=4)

    with open('sidebar_data.json', 'w', encoding='utf-8') as file:
        file.write(json_data)

def compare_sidebar_json(model_):
    # Load data from JSON file
    try:
        # Open the file for reading (assuming UTF-8 encoding)
        with open('sidebar_data.json', 'r', encoding='utf-8') as file:
            json_data = json.load(file)
    except FileNotFoundError:
        # Handle case where file doesn't exist (create empty list)
        json_data = []
    except json.JSONDecodeError:
        # Handle invalid JSON format
        print("Error: Invalid JSON data in sidebar_data.json")
        return


    model_.objects.all().delete()
    # Check for missing items in the model
    for item in json_data:
        # Create and save new sidebar item in the model
        parent_object = None
        if 'parent' in item and item['parent']:
            # Check for existing parent object based on name_code
            parent_object = model_.objects.filter(name_code=item['parent']).first()

        # ... other code (create new item) ...

        new_item = model_(
            title_ar=item['title_ar'],
            title_en=item['title_en'],
            name_code=item['name_code'],
            url=item['url'],
            icon_left=item['icon_left'],
            icon_right=item['icon_right'],
            url_value=item['url_value'],
            is_sub_parent=item['is_sub_parent'],
            order=item['order'],
            is_active=item['is_active']
        )
        new_item.parent = parent_object
        new_item.save()

class Command(TemplateCommand):

    
    def add_arguments(self, parser):
        parser.add_argument('--up', dest='update_app', action='store_true', help='update the side bar')
        parser.add_argument('-update', dest='rm_app', action='store_true', help='Remove the app_name')
        parser.add_argument('update_sidebar', nargs='?', type=str, help='The update side bar (optional)')        
    def handle(self, **options):
        child_app = options['update_sidebar']
        BASE_DIR = settings.BASE_DIR
        if child_app:
            compare_sidebar_json(SidebarItem)
            print("update file sidebar_data.json is successfully.")
        else:
            create_sidebar_json(SidebarItem)
            print("update table sidebaritem  is successfully.")