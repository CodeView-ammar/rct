
"""
url models Department
"""
from django.urls import path,include
from configration.department import views
urlpatterns = [
    path("department/",views.DepartmentView.as_view(),name="DepartmentView")
    
]
            