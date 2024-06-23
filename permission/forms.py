from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from our_core.our_form import CustomForm
# from .models import PermissionGroup
from our_core.our_form import CustomModelForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout
from crispy_forms.layout import Submit
from crispy_forms.layout import Row
from crispy_forms.layout import Column


# from permission.models import TypeDevice,UsersDetilesUserBranch,UsersDetilesUserPermissionGroup,UsersDetilesTypeDevice
# from permission.models import UsersGroup
from permission.models import UsersDetiles
# from our_core.models import Branch





class UsersDetilesForm(CustomModelForm):
    """
    UsersForm for represent Users models in template
    """

   
    username = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder":_("User Name")}
        ),label=_("User Name")
    )
    password = forms.CharField(required=True,label=_("Password"), widget=forms.PasswordInput())
    
    confirm_password = forms.CharField(
        required=True, label=_("Confirm password"), widget=forms.PasswordInput()
    )
    
    # user_branch = forms.ModelMultipleChoiceField(
    #     required=True,
    #     label=_('User Branch'),
    #     queryset=Branch.objects.all()
    # )
    def __init__(self, *args, **kwargs):
        super(UsersDetilesForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if name != 'active':
                self.fields[name].widget.attrs.update(
                    {
                        "class": "form-control",
                    }
                )


    def clean_confirm_password(self):
        password1 = self.cleaned_data.get("confirm_password")
        password2 = self.cleaned_data.get("password")
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(_("The two password fields didn't match."))
        return password1

    class Meta:
        model = UsersDetiles
        fields = [
            "username",
            "password",
            
        ]
       

class UserPassword(CustomModelForm):
    """
    UsersForm for represent Users password  models in template
    """

    password = forms.CharField(required=False,label=_("Password"),widget=forms.PasswordInput())

    confirm_password = forms.CharField(
        label=_("Confirm password"), widget=forms.PasswordInput()
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column("password", css_class="form-group col-md-4 mb-0"),
                Column("confirm_password", css_class="form-group col-md-4 border-top "),
                css_class="form-row",
            ),
        )

    class Meta:
        model = UsersDetiles
        fields = ["password", "confirm_password"]

    def clean_confirm_password(self):
        password1 = self.cleaned_data.get("confirm_password")
        password2 = self.cleaned_data.get("password")
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(_("The two password fields didn't match."))
        else:
            raise forms.ValidationError(
                (" The confirm_password can't be empty {0}".format(password1))
            )

        return password1







import json


class LoginForm(CustomForm):
    
    def __init__(self, *args,cost_center=None,db_name = None, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
          
        self.fields['username'] = forms.CharField(widget=forms.TextInput(),label=_("User Name"))
        self.fields['password'] = forms.CharField(widget=forms.PasswordInput(),label=_("Password"))
       
        self.fields["username"].widget.attrs.update(
            {"class": " form-control" ,"placeholder":"اسم المستخدم"  }
        )
        self.fields["password"].widget.attrs.update(
                    {"class": " form-control"  ,"placeholder":"كلمة المرور" }
                )


    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")
        

        user = authenticate(username=username, password=password)
        
        if not user:
            raise forms.ValidationError(
                _("Sorry, User name or Password  was incorrect. Please try again.")
            )
        if not user.active:

            raise forms.ValidationError(
                _("Sorry,This user was not active contact admin to solve this problem ")
            )
        return self.cleaned_data



