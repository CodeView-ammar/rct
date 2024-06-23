
from django.urls import path,include
from our_core.views import ViewMixin,max_number

urlpatterns = [
    path("core_fromset",ViewMixin.core_formset, name="core_fromset"),
    path("", include("our_core.templatetags.urls")),
    path("max-number",max_number,name="max_number_core"),
    ]