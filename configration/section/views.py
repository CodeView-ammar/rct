from configration.section.forms import SectionForm
from configration.models import Section
from django.utils.translation import gettext_lazy as _
from our_core.baseview import BaseView


class SectionView(BaseView):
    
    model_name=Section
    form_name=SectionForm
    modal_size='md'
    type_page=1
    title_form=_("section")
    title_list=_("section")
    columns = ["number","department","name_section"]
    search_fields = columns
    permission_code = 'SectionView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],