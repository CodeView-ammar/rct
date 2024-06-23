from configration.type_file.forms import TypeFileForm
from configration.models import TypeFile
from django.utils.translation import gettext_lazy as _
from our_core.baseview import BaseView


class TypeFileView(BaseView):
    
    model_name=TypeFile
    form_name=TypeFileForm
    modal_size='md'
    type_page=1
    title_form=_("type file")
    title_list=_("type file")
    columns = [field.name for field in TypeFile._meta.get_fields() if field.name not in ["id","created_at", "modified_at", "created_by", "modified_by"]]
    search_fields = columns
    permission_code = 'TypeFileView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],