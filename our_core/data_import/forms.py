from django import forms
from django.core import validators
from django.utils.translation import ugettext_lazy as _
from dal import autocomplete

from ..models import (
    DataImport ,
    )
from . import (
    views
    )
from django.urls import reverse,reverse_lazy
from our_core.models import Branch
from dal import forward
from django.contrib.contenttypes.models import ContentType
import datetime

class GetAllModel(forms.Form):
    document_name_temp = forms.ModelChoiceField(
        queryset=ContentType.objects.all(),
        widget=autocomplete.ModelSelect2(url='ImportGetALLModelAutoComplete'),
        required=True,
        label=_('اسم الشاشة')
    )
    def __init__(self, *args, **kwargs):
        super(GetAllModel, self).__init__(*args, **kwargs)
        self.fields["document_name_temp"].widget.attrs.update(
            { 'class': 'form-control',"required":True})
        
 
class DataImportForm(forms.ModelForm):
    """
    customer Data Form for represent customer Data models in template
    """
    def __init__(self, *args, **kwargs):
        super(DataImportForm, self).__init__(*args, **kwargs)
        


        self.fields["number"] = forms.CharField(
            label="الرقم",
            # initial=str(view.max_number()),
            widget=forms.TextInput(
                attrs={
                    "readonly": "readonly",
                    'class':"form-control",
                    'value':str(views.max_number()),
                }
            ),
        ) 
        self.fields["document_name"].widget.attrs.update(
            {'type': 'text', 'class': 'hidden form-control'})

        self.fields["import_type"].widget.attrs.update(
            { 'class': 'form-control'})

        self.fields["file_type"].widget.attrs.update(
            { 'class': 'form-control',"required":False})

    class Meta:
        model = DataImport
        fields = [
        "number",
        "document_name",
        "import_type",
        "file_type"]
     
        widgets = { 
             'name_DataImport': forms.TextInput(attrs={
                 'class':'form-control',
                
                }),
            }
        labels = {
            "number":"الرقم",
            "document_name":"اسم الشاشة",
            "import_type":"نوع الاسترداد",
            "file_type":"نوع الملف",
            }
   
    def clean(self):
        all_clean_data= super().clean()
        num = all_clean_data['number']
        if num == 0 :
            msg = "The Number is exist"
            self.add_error('number', msg)


            
 

