from configration.subject.forms import SubjectForm
from configration.models import Subject
from django.utils.translation import gettext_lazy as _
from our_core.baseview import BaseView


class SubjectView(BaseView):
    
    model_name=Subject
    form_name=SubjectForm
    modal_size='md'
    type_page=1
    title_form=_("Subject")
    title_list=_("Subject")
    columns = ["number","section","name_subject"]
    search_fields = columns
    permission_code = 'SubjectView'  # Optional, permission code for adding
    breadcrumbs=[
                    {'label': _('Home'), 'url': '/',"is_active":False},
                    {'label': title_form, 'url': '#',"is_active":True}
                 ],