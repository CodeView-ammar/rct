
"""
url models TypeFile
"""
from django.urls import path,include
from configration.type_file import views
urlpatterns = [
    path("typefile/",views.TypeFileView.as_view(),name="TypeFileView")
    
]
            