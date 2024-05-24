from django import template

register = template.Library()

from permission.permission.permission import has_screen as _has_screen
from permission.permission.permission import active_has_screen as _active_has_screen

from permission.permission.permission import has_tab as _has_tab
from permission.permission.permission import has_system as _has_system
from permission.permission.permission import has_partion as _has_partion


def active_screen(data):
    global active_screen_global
    active_screen_global = data

def change_screen(data):
    global group_screen_global
    group_screen_global = data

def change_system(data):
    global group_system_global
    group_system_global = data

def change_tab(data):
    global group_tab_global
    group_tab_global = data

def change_partion(data):
    global group_partion_global
    group_partion_global = data

@register.simple_tag
def contains(value , per):
    
    for screen in group_screen_global:

        if value == screen.get('tab_screens_id') :
            if screen[per]:
                return "checked"
                
            else:
                return " " 
    return ' '
@register.simple_tag
def contains_screen(value , per):
    
    for screen in active_screen_global:

        if value == screen.get('tab_screens_id') :
            if screen[per]:
                return "checked"
                
            else:
                return " " 
    return ' '
    
@register.simple_tag
def has_screen(value , per):
    
    for screen in active_screen_global:

        if value == screen.get('tab_screens_id') :
            if screen[per]:
                return "checked"
                
            else:
                return " " 
    return ' '

@register.simple_tag
def contains_system(value):
    
    for screen in group_system_global:

        if value == screen.get('systems') or value == screen.get('tab_screens_id') :
            if screen['is_active']:
                return "checked"
            else:
                return " " 
    return ' '
@register.simple_tag
def contains_tab(value ):
    
    for screen in group_tab_global:

        if value == screen.get('system_tabs') :
            if screen['is_active']:
                return "checked"
            else:
                return " " 
    return ' '


@register.simple_tag
def contains_partion(value ):
    
    for screen in group_partion_global:

        if value == screen.get('tab_partions') :
            if screen['is_active']:
                return "checked"
            else:
                return " " 
    return ' '

#################### tag

    
@register.simple_tag
def has_screen(requset ,screen_name , per):
    
    return _has_screen(requset ,screen_name , per)

from our_core.models import SidebarItem
from django.shortcuts import render
from django.template.loader import render_to_string

@register.simple_tag
def has_sidebar(requset):
    sidebar_items = SidebarItem.objects.filter(is_active=True).order_by('order')
    
    context = { 
          "sidebar_items":sidebar_items}
    
    html_template = render_to_string('layout/sidebar.html',{'sidebar_items': sidebar_items},requset)
    return html_template

@register.simple_tag
def active_has_screen(requset ,screen_name ):
    return _active_has_screen(requset ,screen_name)
@register.simple_tag
def has_tab(requset,per):
    return _has_tab(requset,per)

@register.simple_tag
def has_system(requset, per):
    return _has_system(requset, per)  

@register.simple_tag
def has_partion(requset, per):
    return _has_partion(requset, per)


