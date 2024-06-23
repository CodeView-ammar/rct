
"""
url models Subject
"""
from django.urls import path,include
from configration.subject import views
urlpatterns = [
    path("subject/",views.SubjectView.as_view(),name="SubjectView"),
    path("division/",views.SubjectView.as_view(),name="DivisionView"),
    
    
]
            