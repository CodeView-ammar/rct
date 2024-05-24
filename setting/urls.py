from django.contrib import admin
from django.urls import path, include
from setting import SaveColor,info_login
urlpatterns = [
    path('SaveColor_sidebar/', SaveColor.SaveColor_sidebar,name='SaveColor_sidebar'),
    path('ShowColor_sidebar/',  SaveColor.ShowColor_sidebar,name='ShowColor_sidebar'),

path('saveresponsev_sidebar/', SaveColor.saveresponsev_sidebar,name='saveresponsev_sidebar'),
path('showresponsev_sidebar/', SaveColor.showresponsev_sidebar,name='showresponsev_sidebar'),
# header
path('SaveColor_header/', SaveColor.SaveColor_header,name='SaveColor_header'),
path('ShowColor_header/',  SaveColor.ShowColor_header,name='ShowColor_header'),

# sava login
path('Savelogin/', info_login.Save_logininfo,name='Savelogin'),
path('Showlogin/',  info_login.Showinfo_login,name='Showlogin'),


path('closeui/',  info_login.closeui,name='closeui'),
]
