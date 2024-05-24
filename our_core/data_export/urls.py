import os
from django.conf.urls import url

from AccountingSystem import settings
from django.urls import path
from django.conf.urls.i18n import i18n_patterns
from our_core.data_export import views


urlpatterns = [

   
   # data_import
   
   path('data-export/',views.DataExportView.as_view(),name='DataExportView'),
   path('data-export/<int:type_file>/<str:document_name>/',views.export_xls,name='export_xls_csv',),
   path('data-exportJson/',views.DataExportJson.as_view(),name='DataExportJson'),
   path('max_number_data_export/',views.max_number,name='max_number_data_export'),
   path('GetALLModelAutoComplete/', views.GetALLModelAutoComplete.as_view(),name='GetALLModelAutoComplete'),
   path('get-filde-document/',views.get_filde_document_name,name='get_filde_document_name'),

]