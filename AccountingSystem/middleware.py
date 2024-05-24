import re

from django.conf import settings
from django.contrib.auth.middleware import AuthenticationMiddleware
from django.contrib.auth.views import redirect_to_login
from django.http import Http404
from django.urls import resolve
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.db import connection
from django.http import Http404
from tenant_schemas.utils import get_tenant_model, remove_www_and_dev, get_public_schema_name
from django.db import utils

IGNORE_PATHS = [
    re.compile(url) for url in getattr(settings, "LOGIN_REQUIRED_IGNORE_PATHS", [])
]

IGNORE_VIEW_NAMES = [
    name for name in getattr(settings, "LOGIN_REQUIRED_IGNORE_VIEW_NAMES", [])
]


class LoginRequiredMiddleware(AuthenticationMiddleware):
    def _login_required(self, request):
        if request.user.is_authenticated:
            return None

        path = request.path
        if "api"== path.split("/")[1]:
            return None
        
        if any(url.match(path) for url in IGNORE_PATHS):
            return None

        try:
            resolver = resolve(path)
        except Http404:
            return redirect_to_login(path)

        view_func = resolver.func

        if not getattr(view_func, "login_required", True):
            return None

        view_class = getattr(view_func, "view_class", None)
        if view_class and not getattr(view_class, "login_required", True):
            return None

        if resolver.view_name in IGNORE_VIEW_NAMES:
            return None

        return redirect_to_login(path)

    def __call__(self, request):
        response = self._login_required(request)
        if response:
            return response

        return self.get_response(request)






class TenantTutorialMiddleware(AuthenticationMiddleware):
    def process_request(self, request):
        connection.set_schema_to_public()
        hostname_without_port = remove_www_and_dev(request.get_host().split(':')[0])

        TenantModel = get_tenant_model()
        try:
            request.tenant = TenantModel.objects.get(domain_url=hostname_without_port)
        except utils.DatabaseError:
            request.urlconf = settings.PUBLIC_SCHEMA_URLCONF
            return
        except TenantModel.DoesNotExist:
            if hostname_without_port in ("127.0.0.1", "localhost"):
                request.urlconf = settings.PUBLIC_SCHEMA_URLCONF
                return
            else:
                raise Http404

        connection.set_tenant(request.tenant)
        ContentType.objects.clear_cache()

        if hasattr(settings, 'PUBLIC_SCHEMA_URLCONF') and request.tenant.schema_name == get_public_schema_name():
            request.urlconf = settings.PUBLIC_SCHEMA_URLCONF

from django.utils import translation
class UserLocaleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        translation.activate("ar")
        response = self.get_response(request)
        translation.deactivate()
        return response