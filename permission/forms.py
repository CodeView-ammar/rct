from django import forms
from django.utils.translation import activate, ugettext_lazy as _

from django.contrib.auth import authenticate
from our_core.our_form import CustomForm
from .models import PermissionGroup
from our_core.our_form import CustomModelForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout
from crispy_forms.layout import Submit
from crispy_forms.layout import Row
from crispy_forms.layout import Column


from permission.models import TypeDevice,UsersDetilesUserBranch,UsersDetilesUserPermissionGroup,UsersDetilesTypeDevice
from permission.models import UsersGroup
from permission.models import UsersDetiles,info_client,ActivityKey
from our_core.models import Branch



class PremissionGroup(CustomModelForm):

    """
    PremissionGroup for represent group models in template
    """

    widgets = {
        "group_name": forms.TextInput(
            attrs={"class": "form-control", "id": "group_name"}
        ),
    }

    class Meta:
        model = PermissionGroup
        fields = ["group_name"]


class UsersGroupForm(CustomModelForm):
    """
    UsersGroupForm for represent Users Group  models in template
    """

    # company = forms.ModelChoiceField(required=False, queryset=Company.objects.all(),label=_("company") )

    def __init__(self, *args, **kwargs):
        super(UsersGroupForm, self).__init__(*args, **kwargs)
        # self.fields["company"].widget.attrs.update(
        #     {"class": " form-control", "required": False}
        # )
        self.fields["name_ar"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

        self.fields["name_en"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

    class Meta:
        model = UsersGroup
        fields = ["name_ar", "name_en"]


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
    
    user_permission_group = forms.ModelMultipleChoiceField(
        required=True,label=_('User Permission Group'), queryset=PermissionGroup.objects.all()
    )
    # user_branch = forms.ModelMultipleChoiceField(
    #     required=True,
    #     label=_('User Branch'),
    #     queryset=Branch.objects.all()
    # )
    type_device = forms.ModelMultipleChoiceField(
        required=False,
        label=_('Type Device'),
        queryset=TypeDevice.objects.all()
    )
    def __init__(self, *args, **kwargs):
        super(UsersDetilesForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if name != 'active':
                self.fields[name].widget.attrs.update(
                    {
                        "class": "form-control",
                    }
                )

        self.fields['type_device'].widget.attrs.update(
                {
                    "class": "hidden",
                } )
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
            "active",
            "usrsgroup",
            # "user_branch",
            "type_device",
            "user_permission_group",
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


class UserDetailForm(CustomModelForm):
    """
    UsersForm for represent Users Group and Branch  models in template
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column("username", css_class="form-group col-md-4 mb-0"),
                Column("usrsgroup", css_class="form-group col-md-8 border-top "),
                css_class="form-row",
            ),
            Row(
                Column("user_branch", css_class="form-control form-group  col-md-8"),
                Column("user_permission_group", css_class="form-control form-group  col-md-4 "),
                css_class="form-row",
            ),
        )
    user_branch = forms.ModelMultipleChoiceField(queryset=UsersDetilesUserBranch.objects.all(),required=False,)
    user_permission_group = forms.ModelMultipleChoiceField(queryset=UsersDetilesUserPermissionGroup.objects.all(),required=False,)

    # user_branch = forms.ModelChoiceField(
    #     queryset=Accounts.objects.filter(accounts_type=1),
    #     required=False,
    #     widget=forms.Select(attrs={"class": "form-control"}),
    # )
    class Meta:

        model = UsersDetiles
        fields = [
            "username",
            "usrsgroup",
            "user_permission_group",
            "user_branch",
        ]

    # def clean_username(self):
    #     username = self.cleaned_data["username"]
    #     if User.objects.exclude(pk=self.instance.pk).filter(username=username).exists():
    #         raise forms.ValidationError(_('Username is already in use.')+' ('+ username+')' )
    #     elif len(username) < 1:
    #         raise forms.ValidationError(
    #             _(" Username is to Small . Must be more than 0 digit please ")
    #         )

    #     return username


class TypeDeviceForm(CustomModelForm):
    """
    TypeDviceForm for represent Type Device   models in template
    """

    def __init__(self, *args, **kwargs):
        super(TypeDeviceForm, self).__init__(*args, **kwargs)
        self.fields["branch"].widget.attrs.update(
            {"class": " form-control", "required": False}
            
        )
        self.fields["name_device"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

        self.fields["mac_address"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

        self.fields["ip_address"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

        self.fields["serel_cpu"].widget.attrs.update(
            {"class": " form-control", "required": False}
        )

    class Meta:
        model = TypeDevice
        fields = ["name_device", "mac_address", "ip_address", "serel_cpu", "branch"]





class UserDetailForm(CustomModelForm):
    """
    UsersForm for represent Users Group and Branch  models in template
    """

    type_device = forms.ModelMultipleChoiceField(
        required=False, queryset=TypeDevice.objects.all(),label=_("type_device")
    )
    user_branch = forms.ModelMultipleChoiceField(queryset=UsersDetilesUserBranch.objects.all(),required=False,)
    user_permission_group = forms.ModelMultipleChoiceField(queryset=UsersDetilesUserPermissionGroup.objects.all(),required=False,)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if kwargs.get("instance"):
            self.fields["type_device"].queryset = TypeDevice.objects.filter(
                branch__in=kwargs["instance"].user_branch()
            )
        else:
            self.fields["type_device"].queryset = TypeDevice.objects.none()

        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Row(
                Column("username", css_class="form-group col-md-4 mb-0"),
                Column("usrsgroup", css_class="form-group col-md-4 border-top "),
                Column("active", css_class="form-group col-md-4 border-top "),
                css_class="form-row",
            ),
            Row(
                Column("user_permission_group", css_class="form-control form-group  col-md-4 dual "),
                Column("user_branch", css_class="form-control form-group  col-md-4 dual"),
                Column("type_device", css_class="form-control form-group  col-md-3 dual"),
                css_class="form-row",
            ),
        )

    class Meta:

        model = UsersDetiles
        fields = [
            "username",
            "active",
            "usrsgroup",
            "user_permission_group",
            "user_branch",
            "type_device",
        ]

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
        try:
            username = self.cleaned_data.get("username")
            password = self.cleaned_data.get("password")
            # branch = self.cleaned_data.get("branch")
          

            user = authenticate(username=username, password=password)
            # print(user.user_branch().filter(id=branch.pk))
            # print(db_name)
          
            # inst=list()
            # inst=UsersDetiles.objects.using("training").values_list("user_branch").filter(id=user.id)
           
            # print(inst[0])
            # instance=UsersDetiles.objects.using("2025").filter(id=user.id).update(active=True,user_branch=inst[0])
            # instance=UsersDetiles.objects.using("2025").filter(id=user.id).update(active=True)

            # users = User.objects.filter(email__in=emails)
            # instance = Setupuser.objects.create(organization=org)
         
            # for branch_user in afeef:
            #     asgd.user_branch.add(branch_user)

            # instance.user_branch.add(1)
    # sample_object.users.add(1,2)
            if not user:
                raise forms.ValidationError(
                    _("Sorry, User name or Password  was incorrect. Please try again.")
                )
            if not user.active:

                raise forms.ValidationError(
                    _("Sorry,This user was not active contact admin to solve this problem ")
                )
            # if branch:
            #     if not UsersDetilesUserBranch.objects.filter(branch_id=branch.pk,usersdetiles_id=user.id):
            #         raise forms.ValidationError(
            #             _("Sorry,This user can't login in this branch")
            #         )
        except:
            raise forms.ValidationError(_("Sorry,This user can't login in this branch"))
        return self.cleaned_data




class CompanyLoginForm(forms.Form):
    username = forms.CharField(max_length=100,required=False,widget=forms.TextInput(attrs={"placeholder": _("user name")}))
    password = forms.CharField(required=False,widget=forms.PasswordInput(attrs={"placeholder": _("password")}))
    confirm_password = forms.CharField(required=False,widget=forms.PasswordInput(attrs={"placeholder": _("confirm password")}))
    arabic_name = forms.CharField(required=False,widget=forms.TextInput(attrs={"placeholder":_("arabic name")}))
    foregin_name = forms.CharField(required=False,widget=forms.TextInput(attrs={"placeholder": _("foregin name")}))
    abbrivation_name = forms.CharField(required=False,widget=forms.TextInput(attrs={"placeholder": _("abbrivation name")}))
    foregin_abbrivation_name = forms.CharField(required=False,widget=forms.TextInput())
    branch_name = forms.CharField(required=False,widget=forms.TextInput(attrs={"placeholder": _("branch name")}))
    branch_area = forms.CharField(required=False,widget=forms.TextInput(attrs={"placeholder": _("branch area")}))
    def __init__(self, *args, **kwargs):
        super(CompanyLoginForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            # self.fields[name].label=_("")
            if name !="password" or name !="confirm_password":
                self.fields[name].widget.attrs.update(
                    {"class": "form-field  form-control text"}
                )
        self.fields["password"].widget.attrs.update(
            {"class": "form-field form-control password" ,"id":"password"}
        )
        self.fields["confirm_password"].widget.attrs.update(
            {"class": "form-field form-control password","id":"confirm_password"}
        )
       
class ActivateKeyForm(CustomModelForm):
    """
    UsersForm for represent Users models in template
    """
    activate_key1 = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": _("خاص بالإدارة")}),required=True,label=_("خاص بالإدارة")
    )
    activate_key2 = forms.CharField(
        widget=forms.TextInput(attrs={"placeholder": _("ادخل السريال")}),required=True,label=_("خاص بالعميل")
    )
    class Meta:
        model = ActivityKey
        fields = "__all__"

class ActivationForm(CustomModelForm):
    """
    UsersForm for represent Users models in template
    """

    def __init__(self, *args, **kwargs):

        super(ActivationForm, self).__init__(*args, **kwargs)
        self.fields["name_client_ar"].widget.attrs.update(
            {"label":_("اسم العميل"),'class': 'form-control',
            'placeholder':"اسم العميل"}
            )
        self.fields['phon_client'].widget.attrs.update(
            {'class': 'form-control',
            'placeholder':"رقم جوال العميل"}
            )
        self.fields['address_client'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"عنوان العميل"}
            )
        self.fields['date_client'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"تاريخ التسجيل"}
            )
        self.fields['agreed_amount'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"المبلغ المتفق عليه بالدولار"}
            )
        self.fields['amount_paid_dollar'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "المبلغ المدفوع بالدولار"}
            )
        self.fields['remaining_dollar_amount'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "المبلغ المتبقي بالدولار"}
            )
        self.fields['activate_key1'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "الرمز الخاص بالإدارة"}
            )
        self.fields['activate_key2'].widget.attrs.update(
            {'class': 'form-control', 
            "placeholder":"الرمز الخاص بالعميل"}
            )

        self.fields['activate_key2'].required = False

    class Meta:
        model = info_client
        fields = "__all__"



class unit_actionForm(CustomModelForm):
    """
    UnitForm for represent  Unit  models in template
    """
    def __init__(self, *args, **kwargs):

        super(unit_actionForm, self).__init__(*args, **kwargs)
        self.fields["name_client_ar"].widget.attrs.update(
            {"label":_("اسم العميل"),'class': 'form-control',
            'placeholder':"اسم العميل"}
            )
        self.fields['phon_client'].widget.attrs.update(
            {'class': 'form-control',
            'placeholder':"رقم جوال العميل"}
            )
        self.fields['address_client'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"عنوان العميل"}
            )
        self.fields['date_client'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"تاريخ التسجيل"}
            )
        self.fields['agreed_amount'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder":"المبلغ المتفق عليه بالدولار"}
            )
        self.fields['amount_paid_dollar'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "المبلغ المدفوع بالدولار"}
            )
        self.fields['remaining_dollar_amount'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "المبلغ المتبقي بالدولار"}
            )
        self.fields['activate_key1'].widget.attrs.update(
            {'class': 'form-control',
            "placeholder": "الرمز الخاص بالإدارة"}
            )
        self.fields['activate_key2'].widget.attrs.update(
            {'class': 'form-control', 
            "placeholder":"الرمز الخاص بالعميل"}
            )

        self.fields['activate_key2'].required = False

 

    class Meta:
        model = info_client
        fields = "__all__"

