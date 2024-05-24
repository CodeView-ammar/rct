from django.conf import settings
from django.core.cache import cache
import traceback

route_app_labels = {'contenttypes', 'sites', 'auth', 'admin', 'flatpages', 'redirects', 'auditlog', 'sessions'}


try:
    extra_route_app_labels = settings.ROUTE_APP_LABELS
    assert isinstance(extra_route_app_labels, (list, tuple, set)), 'ROUTE_APP_LABELS must be a list, tuple or set'
except (AttributeError, NameError):
    extra_route_app_labels = ()
except AssertionError as e:
    raise e


route_app_labels.update(extra_route_app_labels)


class DefaultRouter:
    try:
        token_table = settings.REST_AUTH_TOKEN_TABLE
    except (AttributeError, NameError):
        token_table = 'AUTHENTICATION_TOKEN'

    route_db_tables = {token_table, 'django_session'}

    try:
        auth_db = settings.AUTH_DB
    except (AttributeError, NameError):
        auth_db = 'default'

    if auth_db != 'default':
        auth_app_name = settings.AUTH_USER_MODEL.split('.')[0]
        route_app_labels.add(auth_app_name)

    def db_for_read(self, model, **hints):
        if hasattr(model, 'Database') and getattr(model.Database, 'db'):
            return getattr(model.Database, 'db')
        if model._meta.db_table in self.route_db_tables:
            return self.auth_db
        if model._meta.app_label in route_app_labels:
            return self.auth_db
        return None

    def db_for_write(self, model, **hints):
        if hasattr(model, 'Database') and getattr(model.Database, 'db'):
            return getattr(model.Database, 'db')
        if model._meta.db_table in self.route_db_tables:
            return self.auth_db
        if model._meta.app_label in route_app_labels:
            return self.auth_db
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if (
                obj1._meta.app_label in route_app_labels or
                obj2._meta.app_label in route_app_labels or
                obj1._meta.db_table in self.route_db_tables or
                obj2._meta.db_table in self.route_db_tables
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in route_app_labels:
            return db == self.auth_db
        return None





# class RouterMiddleware(object):
#     def __init__(self, get_response=None):
#         self.get_response = get_response
#         super().__init__()

#     def __call__(self, request):
#         if "db_name" in request.session.keys():

#             cache.set("db_name", request.session["db_name"])

#         response = self.get_response(request)
#         return response
class DatabaseRouter(object):
    """
    A router to control all database operations on models in the
    auth and contenttypes applications.
    """
    def db_for_read(self, model,**hints):
        """
        Attempts to read auth and contenttypes models go to auth_db.
        """
        try:
            from our_core.our_middleware import RequestMiddleware
            request = RequestMiddleware(get_response=None)
            db = request.thread_local.db_name
        
            return db
        except Exception as e:
            pass
            return "default"
        return "default"

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth and contenttypes models go to auth_db.
        """
        try:
            from our_core.our_middleware import RequestMiddleware
            request = RequestMiddleware(get_response=None)
            db = request.thread_local.db_name
            return db
        except Exception as e:
            return "default"
        return "default"
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if a model in the user app is involved.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the  app only appears in the 'database'.
        """
        return True