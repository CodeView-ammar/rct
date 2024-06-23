from our_core.our_form import CustomModelForm
from our_core.views import max_number
from  init_input.models import Trainer
from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserChangeForm,UserCreationForm
from permission.models import UsersDetiles
from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()  # Get the User model

class customUserForm(forms.Form):
    username = forms.CharField(max_length=100, label='Username')
    password1 = forms.CharField(widget=forms.PasswordInput, label='Password')
    password2 = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError('Passwords don\'t match.')
        return password2

    def save(self, commit=True):
        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            active=True,
            password=self.cleaned_data['password1']
        )
        # Add additional user profile fields if needed (optional)
        return user
# class customUserForm(UserCreationForm):
#     class Meta:
#         model = UsersDetiles
#         fields = '__all__'
#         exclude = ["last_login","user_permissions","is_staff","is_superuser","is_admin"]


class TrainerForm(CustomModelForm):
    # user = forms.CharField(required=False)
    def __init__(self, *args, **kwargs):
        super(TrainerForm, self).__init__(*args, **kwargs)
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
                    'value':str(max_number(Trainer)),
                }
                ),
            )
    class Meta:
        model = Trainer
        fields ="__all__"
        exclude = ["User","created_at", "modified_at", "created_by", "modified_by"]

