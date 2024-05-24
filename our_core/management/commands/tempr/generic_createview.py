from {app_directory}.{app_name}.forms import {app_model}Form
from {app_directory}.models import {app_model}
from django.utils.translation import ugettext_lazy as _
from our_core.baseview import BaseView


class {app_model}View(BaseView):
    
    model_name={app_model}
    form_name={app_model}Form
    modal_size='md'
    type_page=1
    title_form=_("{title_form}")
    title_list=_("{title_form}")
    columns = [field.name for field in {app_model}._meta.get_fields() if field.name not in ["id","created_at", "modified_at", "created_by", "modified_by"]]
    search_fields = columns
    permission_code = '{app_model}View'  # Optional, permission code for adding
    breadcrumbs=[
                    -|'label': _('Home'), 'url': '/',"is_active":False|-,
                    -|'label': title_form, 'url': '#',"is_active":True|-
                 ],