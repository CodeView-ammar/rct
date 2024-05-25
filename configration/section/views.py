from configration.section.forms import SectionForm
from configration.models import Section
from django.utils.translation import ugettext_lazy as _
from our_core.baseview import BaseView


class SectionView(BaseView):
    
    model_name=Section
    form_name=SectionForm
    modal_size='md'
    type_page=1
    title_form=_("section")
    title_list=_("section")
    columns = [field.name for field in Section._meta.get_fields() if field.name not in ["id","created_at", "modified_at", "created_by", "modified_by"]]
    search_fields = columns
    permission_code = 'SectionView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],