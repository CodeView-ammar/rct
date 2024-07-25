from django.apps import AppConfig

from django.utils.translation import gettext_lazy as _

class SimpleAdminConfig(AppConfig):
    """Simple AppConfig which does not do automatic discovery."""

    default_auto_field = "django.db.models.AutoField"
    default_site = "django.contrib.admin.sites.AdminSite"
    name = 'permission'
    verbose_name = _("permission")

class PermissionConfig(SimpleAdminConfig):
    name = 'permission'
    def ready(self):
        import our_core.signals