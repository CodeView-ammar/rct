from django.contrib import admin
from .models import (UsersDetilesUserPermissionGroup,Systems,TabScreens,PermissionGroup,TabPartionsPermission
,SystemTabs,BranchSystem,GroupScreens,GroupPartionPermission,UsersDetiles,GroupTabs,UsersGroup,TypeDevice,
UsersDetilesUserBranch,UsersDetilesTypeDevice,GroupSystems)
from our_core.models import   Company
from translations.admin import TranslatableAdmin,TranslationInline


@admin.register(Systems)
class Systems(admin.ModelAdmin):
    # inlines=[TranslationInline]
    list_display = ["system_name_ar"]


@admin.register(PermissionGroup) 
class PermissionGroup(admin.ModelAdmin):
    # inlines = [TranslationInline]
    list_display = ["group_name"]

@admin.register(TabPartionsPermission)
class TabPartionsPermission(admin.ModelAdmin):
    list_display = ["permission_name"]

@admin.register(SystemTabs)
class SystemTabs(admin.ModelAdmin):
    list_display = ["tab_name_ar","tab_code"]


@admin.register(BranchSystem)
class BranchSystem(admin.ModelAdmin):
    list_display = ["branch","system"]

@admin.register(GroupScreens)
class GroupScreens(admin.ModelAdmin):
    list_display = ["tab_screens"]

@admin.register(GroupPartionPermission)
class GroupPartionPermission(admin.ModelAdmin):
    list_display = ["is_active","group"]

    
@admin.register(GroupSystems)
class GroupSystems(admin.ModelAdmin):
    list_display = ["group","systems"]

@admin.register(GroupTabs)
class GroupTabs(admin.ModelAdmin):
    list_display = ["system_tabs","group"]
@admin.register(UsersGroup)
class UsersGroup(admin.ModelAdmin):
    list_display = ["name_en","company"]


# @admin.register(BranchSystemBranchGroup)
# class BranchSystemBranchGroup(admin.ModelAdmin):
#     list_display = ["name_en","company"]

@admin.register(UsersDetilesUserPermissionGroup)
class UsersDetilesUserPermissionGroup(admin.ModelAdmin):
    list_display = ["usersdetiles","permissiongroup"]
    
@admin.register(UsersDetilesUserBranch)
class UsersDetilesUserBranch(admin.ModelAdmin):
    list_display = ["usersdetiles","branch"]








from django.utils.translation import ugettext_lazy as _
from django.db.models import Q
class TabScreensAdmin(admin.ModelAdmin):
    list_display = ('display_screen_name_ar',)
    search_fields = ('screen_name_ar', 'system_tabs__tab_name_ar',"screen_code","screen_name")  # Add the fields to search here

    def display_screen_name_ar(self, obj):
        if obj.screen_name_ar:
            return _(obj.screen_name_ar)
    
    display_screen_name_ar.short_description = 'Title (Arabic)'
    


admin.site.register(TabScreens, TabScreensAdmin)# admin.site.register(Company)

