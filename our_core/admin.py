from django.contrib import admin

from .models import SidebarItem
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

from datetime import date
from guardian.models import UserObjectPermission,GroupObjectPermission
from django.utils.translation import gettext_lazy as _
app_name = _("core")
class DecadeBornListFilter(admin.SimpleListFilter):
    # Human-readable title which will be displayed in the
    # right admin sidebar just above the filter options.
    title = _("parent")

    # Parameter for the filter that will be used in the URL query.
    parameter_name = "decade"

    def lookups(self, request, model_admin):
        """
        Returns a list of tuples. The first element in each
        tuple is the coded value for the option that will
        appear in the URL query. The second element is the
        human-readable name for the option that will appear
        in the right sidebar.
        """
        return [
            ("parent", _("parent")),
            ("children", _("children")),
            ("sub_parent", _("sub parent")),
            
        ]

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        # Compare the requested value (either '80s' or '90s')
        # to decide how to filter the queryset.
        if self.value() == "parent":
            return queryset.filter(Q(parent__isnull=True))
        if self.value() == "children":
            return queryset.filter(Q(parent__isnull=False))
        if self.value() == "sub_parent":
            return queryset.filter(Q(is_sub_parent=True))


class SidebarItemAdmin(admin.ModelAdmin):
    list_display = ('display_title_ar', 'display_parent_title_ar')
    search_fields = ('title_ar', 'parent__title_ar',"name_code","url")  # Add the fields to search here
    list_filter = [DecadeBornListFilter]

    def display_title_ar(self, obj):
        if obj.title_ar:
            return _(obj.title_ar)
    
    display_title_ar.short_description = 'Title (Arabic)'
    
    def display_parent_title_ar(self, obj):
        if obj.parent:
            return _(obj.parent.title_ar)
        else:
            return ''
    
    display_parent_title_ar.short_description = 'Parent Title (Arabic)'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'parent':
            # استعلم فقط عن العناصر التي ليست لها أب
            kwargs['queryset'] = SidebarItem.objects.filter(Q(parent__isnull=True) | Q(is_sub_parent=True))
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


# admin.site.register(SidebarItem, SidebarItemAdmin)# admin.site.register(Company)



