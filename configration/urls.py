
"""
url models configration
"""
from django.urls import path,include
urlpatterns = []

from .hooks import sub_app_name
if sub_app_name:
   for sub_app_name_ in sub_app_name:
      urlpatterns+=[path("configration"+"/",include("configration"+"."+sub_app_name_+".urls")),]
            