
''' Class Oaks Form '''
import re
from django import forms
from django.utils.translation import gettext_lazy as _
from django.forms import DateField
from datetime import date
from dal import autocomplete
class MainForm(forms.Form):
    
    model = None  # Placeholder for the specific model
    fields = ("__all__",)  # Default to include all fields (can be overridden)
    exclude = []  # Optional list of fields to exclude

    ''' Class Oaks Form '''
    def __init__(self, *args, **kwargs):
        super(MainForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if str(self.fields[name].__class__.__name__)=='DateField':
                self.fields[name] = forms.DateField(
                    initial=date.today(),
                    widget=forms.DateInput(
                        attrs={"type": "date"}
                    ),
                )

            if str(self.fields[name].__class__.__name__)=='BooleanField':
                self.fields[name].widget.attrs.update({"class": "form-check-input"})
            
            

        for k, field in self.fields.items():
            # field.widget.attrs.update({"class": " form-control"})
            # if str(field.__class__.__name__)=='BooleanField':
                # field.widget.attrs.update({"class": " radio-controll"})
            if 'required' in field.error_messages:
                field.error_messages['required'] = _('The {0} Must be Entered.'.format(field.label))
               
            if 'null' in field.error_messages:
                field.error_messages['null'] = _('The {0} can\'t be Null .'.format(field.label))
                 
            if 'blank' in field.error_messages:
                field.error_messages['blank'] = _(' The {0} can\'t be Blank .'.format(field.label))
                 
            if 'invalid' in field.error_messages:
                field.error_messages['invalid'] = _(' The  value for {0} is invalid .'.format(field.label))
                 
            if 'invalid_choice' in field.error_messages:
                field.error_messages['invalid_choice'] = _(' The invalid choice  for {0}.'.format(field.label))
                 
            if 'unique' in field.error_messages:
                field.error_messages['unique'] = _('The {0} must be unique.'.format(field.label))
            
            if 'unique' in field.error_messages:
                field.error_messages['unique'] = _('The {0} must be unique.'.format(field.label))
            
            if 'max_length' in field.error_messages:
                field.error_messages['max_length'] = _('Ensure this value has at most %(max)d characters (it has %(length)d).')
            
            if 'min_length' in field.error_messages:
                field.error_messages['min_length'] = _('Ensure this value has at least %(min)d characters (it has %(length)d).')

                
    # def clean_phone(self):
        # regex= r"^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?"
        # if self.cleaned_data["phone"]:
        #     if not re.search(regex, self.cleaned_data["phone"]):
        #         return forms.ValidationError(_("Phone Number Must be This Format xxx-xxx"))
        #     return self.cleaned_data["phone"]
        # else:
        # return True
 

class MainModelForm(MainForm,forms.ModelForm):

    pass     



from django.apps import apps

def get_all_models():
    all_models = []
    app_configs = apps.get_app_configs()
    
    for app_config in app_configs:
        models = app_config.get_models()
        all_models.extend(models)
    
    return all_models

def get_app_name(model_name):
    models = get_all_models()
    app_label=[]
    for model in models:
        app_label.append(str(model._meta.app_label))
    unique_list = [x for i, x in enumerate(app_label) if x not in app_label[:i]]
    name_app=None
    for unique_list_ in unique_list:
        try:
            model_instance = apps.get_model(str(unique_list_), model_name)
            name_app=unique_list_
            
            break
        except LookupError:
            pass
    return name_app

# TODO: autocomplate all fildes
class AutocompleteMaster(autocomplete.Select2QuerySetView):
    def get_result_label(self, obj):
        excluded_fields = [ 'created_at','modified_by','created_by',"created_by_id","modified_by_id",'modified_at']  # قائمة بأسماء الحقول التي ترغب في استثنائها
        include_fields = ['number','local_name',"name","arabic_name","name_ar","name_location","code"]  # قائمة بأسماء الحقول التي ترغب في تواجدها
        field_names = [field.name for field in obj._meta.fields if field.name not in excluded_fields]
        field_values = [getattr(obj, field_name) for field_name in field_names]
        return format_html("{} - {}", *field_values)

    def get_queryset(self):
        namemodel = self.kwargs['namemodel']
        model = apps.get_model(app_label=get_app_name(namemodel), model_name=namemodel)
        qs = model.objects.all()
        if self.q:
            qs = qs.filter(
                Q(number__icontains=self.q)
            )
        return qs



CustomForm =MainForm    
CustomModelForm =MainModelForm    
           