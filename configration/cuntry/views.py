from configration.cuntry.forms import CuntryForm
from configration.models import Cuntry
from django.utils.translation import gettext_lazy as _
from our_core.baseview import BaseView


class CuntryView(BaseView):
    
    model_name=Cuntry
    form_name=CuntryForm
    modal_size='md'
    type_page=1
    title_form=_("Cuntry")
    title_list=_("Cuntry")
    columns = ["number","name_cuntry"]
    search_fields = columns
    permission_code = 'CuntryView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],