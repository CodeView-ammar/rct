
from django.urls import path,include
from our_core.views import ViewMixin,max_number
# from core.list_view import ListView
# from .views import Autocomplete
# from .helper import i18n_javascript
# from .views import index

# for cls in [*BaseView.__subclasses__(),*ListView.__subclasses__()]:
#     if cls.model_name is None:
#         raise Exception('the class {} is has not model_name '.format(cls.__name__))

# urlpatterns = [
#     path('%s/%s' % (cls.model_name._meta.app_label, cls.__name__.lower()), cls.as_view(),
#          name='%s' % (cls.__name__.lower())) for cls in [*BaseView.__subclasses__(),*ListView.__subclasses__(),*TreeView.__subclasses__()]
#     ]
# urlpatterns += [path('jsi18n/', i18n_javascript, name='jsi18n'), path('', index, name='index')]

urlpatterns = [
    # path(
    #     "Autocomplete/<str:model>/<str:field>",
    #     Autocomplete.as_view(),
    #     name="Autocomplete",
    # ),
    path("core_fromset",ViewMixin.core_formset, name="core_fromset"),
    path("", include("our_core.templatetags.urls")),
    # path("", include("our_core.urls")),
    path('', include('our_core.data_import.urls')),
    path('', include('our_core.data_export.urls')),
    path("max-number",max_number,name="max_number_core"),
    # path("", include("our_core.address.urls")), 
        
    ]