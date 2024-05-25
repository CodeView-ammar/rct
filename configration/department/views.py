from configration.department.forms import DepartmentForm
from configration.models import Department
from django.utils.translation import ugettext_lazy as _
from our_core.baseview import BaseView


class DepartmentView(BaseView):
    
    model_name=Department
    form_name=DepartmentForm
    modal_size='md'
    type_page=1
    title_form=_("department")
    title_list=_("department")
    columns = [field.name for field in Department._meta.get_fields() if field.name not in ["id","created_at", "modified_at", "created_by", "modified_by"]]
    search_fields = columns
    permission_code = 'DepartmentView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],