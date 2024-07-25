from django.contrib import admin
from .models import Trainer,Tracking,DetailsTracking,File
# Register your models here.
from import_export.admin import ImportExportModelAdmin
from unfold.admin import ModelAdmin,ModelAdminMixin
from django import forms
from django.shortcuts import redirect,render
from django.http import JsonResponse
from django.urls import reverse
from django.urls import path,include
from django.utils.html import escape, format_html

class DetailsTrackingForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(DetailsTrackingForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if str(self.fields[name].__class__.__name__)=='BooleanField':
                self.fields[name].widget.attrs.update({"class": "appearance-none bg-gray-300 cursor-pointer h-5 relative rounded-full transition-all w-8 after:absolute after:bg-white after:content-[''] after:bg-red-300 after:h-3 after:rounded-full after:shadow-sm after:left-1 after:top-1 after:w-3 checked:bg-primary-600 checked:after:left-4 "})
            else:
                self.fields[name].widget.attrs.update({"class": "border bg-white font-medium rounded-md shadow-sm text-gray-500 text-sm focus:ring focus:ring-primary-300 focus:border-primary-600 focus:outline-none group-[.errors]:border-red-600 group-[.errors]:focus:ring-red-200  dark:border-gray-700 dark:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-700 dark:focus:ring-opacity-50 dark:group-[.errors]:border-red-500 dark:group-[.errors]:focus:ring-red-600/40 px-3 py-2 w-full max-w-2xl"})
    
    class Meta:
        model = DetailsTracking
        fields = ["count_student","max_mark","min_mark","absent","less_than","mark"]


def my_custom_modal(request):
    if request.method == 'POST':
        tracking_id = request.GET.get('id')
        tracking_instance = Tracking.objects.get(pk=tracking_id)
        details_tracking_instance = DetailsTracking.objects.filter(tracking=tracking_instance).first()
        
        if details_tracking_instance:
            details_tracking_instance.delete()
        
        form = DetailsTrackingForm(request.POST)  # Create a new form instance
        
        if form.is_valid():
            custom_form = form.save(commit=False)
            custom_form.tracking = tracking_instance
            custom_form.save()
            return JsonResponse({"status":1})  # Redirect back to admin list
    
    else:
        tracking_object = Tracking.objects.get(pk=request.GET.get('id'))
        initial_data = DetailsTracking.objects.filter(tracking=tracking_object)
        
        if initial_data:
            form = DetailsTrackingForm(instance=initial_data.first())  # Use the first instance for initial data
        else:
            form = DetailsTrackingForm()
    
    context = {'form': form}
    return render(request, 'tracking_details.html', context)



class DetailsTrackingInline(admin.TabularInline):
    model = DetailsTracking
    extra = 1  # Optional: Pre-populate with one empty subtable row
    fields = ["count_student","max_mark","min_mark","absent","less_than","mark"]


class TrackingAdminClass(ModelAdmin,ImportExportModelAdmin):
    list_display = [
        "get_year",
        "get_subject_testing",
        "projram",
        "get_subject__stage",  # Access stage field of related subject model (fixed)
        "get_division__program",
        "get_subject__name",
        "get_trainer__fullname",
        "calculated",
        "status",
        "get_modified_at",'add_subtable_entry'
    ]
    list_editable = ["status","calculated",]
    search_fields=["year",
            "projram",
            "calculated",
            "status",
            "modified_at"]
    def get_urls(self):
        urls = super().get_urls()
        print(":aaa")
        custom_urls = [
              path('my_custom_modal/<int:pk>/', self.admin_site.admin_view(my_custom_modal), name='my_custom_modal'),

        ]
        return   custom_urls+urls 

    def add_subtable_entry(self, obj):
        url = obj.pk
        # url = reverse('my_custom_view', kwargs={'main_table_pk': obj.pk})
        # <button type="button" class="btn btn-block btn-gray-800 mb-3" data-bs-toggle="modal" data-bs-target="#modal-default">Default</button>
        # return format_html('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalLRForm">Launch demo modal</button>')
        return format_html('<button data-id="{}"   class="button" id="custommo" data-target="#modalLRForm" data-toggle="modal"  ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z"/></svg></button>', obj.pk)
   
    def get_modified_at(self, obj):
        return obj.modified_at.strftime("%Y-%m-%d %H:%M") 
    def get_year(self, obj):
        return ""+obj.year+obj.semester 
    def get_subject_testing(self, obj):
        return obj.subject.testing

    def get_subject__stage(self, obj):
        return obj.subject.stage
    def get_division__program(self, obj):
        return obj.division.program
    def get_subject__name(self, obj):
        return obj.subject.name_subject
    def get_trainer__fullname(self, obj):
        return obj.trainer.fullname

    add_subtable_entry.short_description = "عرض التفاصيل"
    get_subject_testing.short_description = "Subject Testing"
    get_subject__stage.short_description = "Subject stage"
    get_division__program.short_description = "division program"
    get_subject__name.short_description = "subject name"
    get_trainer__fullname.short_description = "trainer fullname"


admin.site.register(Tracking, TrackingAdminClass)

from .models import SupervisoryVisits,InstructorEvaluation
from .adminSupervisoryVisits import SupervisoryAdmin,InstructorEvaluationAdmin


from django.utils.translation import gettext_lazy as _

class TrainerAdminClass(ModelAdmin):

    list_display = ["fullname","birthday", "phone","section"]
    list_filter = ["fullname","birthday", "phone","section"]
    search_fields = ["fullname","birthday", "phone"]

class DetailsTrackingAdminClass(ModelAdmin):
    list_display =["count_student","max_mark","min_mark","absent","less_than","mark"]
    list_filter =["count_student","max_mark","min_mark","absent","less_than","mark"]





app_name = _("init_input")
admin.site.register(Trainer,TrainerAdminClass)
admin.site.register(SupervisoryVisits,SupervisoryAdmin)
admin.site.register(InstructorEvaluation,InstructorEvaluationAdmin)
admin.site.register(File,ModelAdmin)


