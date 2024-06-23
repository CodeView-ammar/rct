from our_core.our_form import CustomModelForm
from our_core.views import max_number
from  configration.models import Subject
from django import forms
from django.utils.translation import gettext_lazy as _
class SubjectForm(CustomModelForm):
    def __init__(self, *args, **kwargs):
        super(SubjectForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if str(self.fields[name].__class__.__name__)=='BooleanField':
                self.fields[name].widget.attrs.update({"class": "form-check-input"})
            else:
                self.fields[name].widget.attrs.update({"class": "form-control"})
        if "number" in self.fields:
            self.fields["number"] = forms.CharField(
                label=_("The Number"),
                widget=forms.TextInput(
                attrs={
                    "readonly": "readonly",
                    "data-mask": "",
                    
                    'class':"form-control",
                    'value':str(max_number(Subject)),
                }
                ),
            )
    class Meta:
        model = Subject
        fields ="__all__"
        exclude = ["created_at", "modified_at", "created_by", "modified_by"]

