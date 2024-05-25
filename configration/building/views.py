from configration.building.forms import BuildingForm
from configration.models import Building
from django.utils.translation import ugettext_lazy as _
from our_core.baseview import BaseView


class BuildingView(BaseView):
    
    model_name=Building
    form_name=BuildingForm
    modal_size='md'
    type_page=1
    title_form=_("building")
    title_list=_("building")
    columns = [field.name for field in Building._meta.get_fields() if field.name not in ["id","created_at", "modified_at", "created_by", "modified_by"]]
    search_fields = columns
    permission_code = 'BuildingView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],