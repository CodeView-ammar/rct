
"""
url models Section
"""
from django.urls import path,include
from configration.section import views
urlpatterns = [
    path("section",views.SectionView.as_view(),name="SectionView")
    
]
            