from django.contrib import admin
from todo.models import Week,Task,Department
from guardian.admin import GuardedModelAdmin
from unfold.admin import ModelAdmin
# from unfold.forms import ModelAdmin
from django.db.models import Count
from django.http import Http404, HttpResponseRedirect
from django.template.response import SimpleTemplateResponse, TemplateResponse
from django.utils.translation import gettext_lazy as _
from django.utils.translation import gettext as ungettext
from django.urls import path
from django.forms import ModelForm, CheckboxSelectMultiple
from our_core.our_form import CustomModelForm
from django.forms import ModelForm, ModelMultipleChoiceField
from django.http import HttpResponse
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
app_name = _("todo")

@admin.register(Week)
class customAdmin(ModelAdmin):
    pass

class IncorrectLookupParameters(Exception):
    pass

class TaskForm(CustomModelForm):
    department = ModelMultipleChoiceField(
        queryset=Department.objects.all(),
        widget=CheckboxSelectMultiple,
        required=False
    )
    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if str(self.fields[name].__class__.__name__)=='BooleanField':
                self.fields[name].widget.attrs.update({"class": "appearance-none bg-gray-300 cursor-pointer h-5 relative rounded-full transition-all w-8 after:absolute after:bg-white after:content-[''] after:bg-red-300 after:h-3 after:rounded-full after:shadow-sm after:left-1 after:top-1 after:w-3 checked:bg-primary-600 checked:after:left-4 dark:bg-gray-600"})
            else:
                self.fields[name].widget.attrs.update({"class": "border bg-white font-medium rounded-md shadow-sm text-gray-500 text-sm focus:ring focus:ring-primary-300 focus:border-primary-600 focus:outline-none group-[.errors]:border-red-600 group-[.errors]:focus:ring-red-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-700 dark:focus:ring-opacity-50 dark:group-[.errors]:border-red-500 dark:group-[.errors]:focus:ring-red-600/40 px-3 py-2 w-full max-w-2xl"})

    class Meta:
        model = Task
        fields = '__all__'
     

@admin.register(Task)
class TaskAdmin(ModelAdmin):
    change_list_template="todo/change_list.html"
    change_form_template="todo/change_form.html"
    list_display = ('name_task', 'done')
    # list_editable = ["done",]
    
    def get_form(self, request, obj=None, **kwargs):
        form = TaskForm
        return form

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('save-task-list/', self.save_task_list, name='save_task_list'),
        ]
        return custom_urls + urls

    def save_task_list(self, request):
        if request.method == 'POST':
            for key, value in request.POST.items():
                if key.startswith('task_') and key.endswith('_done'):
                    task_id = int(key.split('_')[1])
                    task = Task.objects.get(id=task_id)
                    task.done = (value == 'on')
                    task.save()
            return HttpResponse('OK')
        return HttpResponseNotAllowed(['POST'])

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        if form.cleaned_data['all_department']:
            obj.department.clear()
        else:
            for department in form.cleaned_data['department']:
                obj.department.add(department)

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        queryset = self.model._default_manager.get_queryset()
        # # TODO: this should be handled by some parameter to the ChangeList.
        
        # # Annotate the queryset with task counts and group by name and date
        annotated_queryset = queryset.values("id","name_task","head_department","done","note","file",'Week__date', 'Week__name').annotate(
            task_count=Count('id')
        )

        # # Convert the annotated queryset to a list of dictionaries
        # # This will be used for grouping and displaying
        data = list(annotated_queryset)
        # self.root_queryset=
        # # Group the data by week date and task name
        grouped_data = {}
        for entry in data:
            week_date = entry['Week__date']
            Week__name = entry['Week__name']
            task_count = entry['task_count']

            if week_date not in grouped_data:
                grouped_data[week_date] = {}

            if Week__name not in grouped_data[week_date]:
                grouped_data[week_date][Week__name] = {'task_count': 0, 'tasks': []}

            grouped_data[week_date][Week__name]['task_count'] += task_count
            grouped_data[week_date][Week__name]['tasks'].append(entry)

        # # Prepare a new list for display
        display_list = []
        for week_date, week_data in grouped_data.items():
            for Week__name, task_info in week_data.items():
                week_str ={
                    "week__date": week_date.strftime('%Y-%m-%d'),
                    'tasks':task_info['tasks'],
                    "week_name":Week__name 
                    }
                display_list.append(week_str)
        extra_context={
            "extra_context":display_list,
        }
        return super().changelist_view(request, extra_context=extra_context)
    
    
    
# Register your models here.

# admin.site.register(Week,customAdmin)
# admin.site.register(Task,TaskAdmin)