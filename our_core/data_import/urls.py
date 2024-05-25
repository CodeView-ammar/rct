import os
from django.conf.urls import url

from training import settings
from django.urls import path
from django.conf.urls.i18n import i18n_patterns
from our_core.data_import import views


urlpatterns = [

   
   # data_import
   
   path('data-import/',views.DataImportView.as_view(),name='DataImportView'),
   path('export-xls/<int:type_export>/<int:type_file>/<str:document_name>/',views.export_xls,name='export_xls',),
   path('data-importJson/',views.DataImportJson.as_view(),name='DataImportJson'),
   path('max_number_data_import/',views.max_number,name='max_number_data_import'),
   path('read-excel/',views.read_excel,name='read_excel'),
   path('ImportGetALLModelAutoComplete/', views.importGetALLModelAutoComplete.as_view(),name='ImportGetALLModelAutoComplete'),
   
   path('export-xls/',views.export_xls,name='export_xlsa',),
   
    # path("export-xls/<type_export:int>/<type_file:int>/<document_name:string>", views.download_file_view, name="download"),
]