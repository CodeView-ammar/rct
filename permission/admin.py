from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UsersDetiles
from django.utils.timezone import now

class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'is_staff', 'active']
    list_filter = ['is_staff', 'is_superuser', 'active', 'groups']
    search_fields = ['username']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),  # Removed date_joined
    )


admin.site.register(UsersDetiles, CustomUserAdmin)