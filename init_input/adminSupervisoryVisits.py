

from django.contrib import admin
# Register your models here.
from import_export.admin import ImportExportModelAdmin
from unfold.admin import ModelAdmin,ModelAdminMixin
from django import forms
from django.shortcuts import redirect,render
from django.http import JsonResponse
from django.urls import reverse
from django.urls import path,include
from django.utils.html import escape, format_html

from django.template.loader import render_to_string
from .forms import InstructorEvaluationForm
from .models import InstructorEvaluation,SupervisoryVisits
# @admin.register(InstructorEvaluation)
# class InstructorEvaluationAdmin(ModelAdmin):
#     form = InstructorEvaluationForm
#     change_form_template = 'custom_change_form.html'
#     add_form_template = 'custom_add_form.html'

from django.forms import ModelForm, ModelMultipleChoiceField


    # InstructorEvaluation_field = ModelMultipleChoiceField(queryset=InstructorEvaluation.objects.all())

class InstructorEvaluationAdmin(ModelAdmin):
    form =InstructorEvaluationForm
    
class SupervisoryAdmin(ModelAdmin):
    change_form_template = 'custom_change_form.html'
    list_display=[
        "get_year",
        "section",
        "evaluation_for",
        "trainer_id",
        "get_trainer_fullname",
        "get_section__department__head_department__name",
        "get_Watched",
        "get_Prepared",
        "add_btn_edit",
        "add_btn_download_file",
        ]
    def get_year(self, obj):
        if obj.year:
            return ""+obj.year+obj.semester 
        else:
            return ""+obj.semester 

    def get_trainer_fullname(self, obj):
        return obj.trainer.fullname
    def get_section__department__head_department__name(self, obj):
        return obj.section.department.head_department.name
    def get_Watched(self, obj):
        if obj.Watched:
            return "تم الإطلاع"
        else:
            return "لم يتم الإطلاع"
    def get_Prepared(self, obj):
        if obj.Prepared:
            return "تم الإعتماد"
        else:
            return "لم يتم الإعتماد"
    
    def add_btn_edit(self, obj):
        url = obj.pk
        return format_html('<a href="{}/change/"   class="button"   ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M160-120v-170l527-526q12-12 27-18t30-6q16 0 30.5 6t25.5 18l56 56q12 11 18 25.5t6 30.5q0 15-6 30t-18 27L330-120H160Zm80-80h56l393-392-28-29-29-28-392 393v56Zm560-503-57-57 57 57Zm-139 82-29-28 57 57-28-29ZM560-120q74 0 137-37t63-103q0-36-19-62t-51-45l-59 59q23 10 36 22t13 26q0 23-36.5 41.5T560-200q-17 0-28.5 11.5T520-160q0 17 11.5 28.5T560-120ZM183-426l60-60q-20-8-31.5-16.5T200-520q0-12 18-24t76-37q88-38 117-69t29-70q0-55-44-87.5T280-840q-45 0-80.5 16T145-785q-11 13-9 29t15 26q13 11 29 9t27-13q14-14 31-20t42-6q41 0 60.5 12t19.5 28q0 14-17.5 25.5T262-654q-80 35-111 63.5T120-520q0 32 17 54.5t46 39.5Z"/></svg></a>', obj.pk)
    def add_btn_download_file(self, obj):
        url = obj.pk
        return format_html(f'<a href="{reverse("html_to_excel",args=[obj.pk])}" ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48"><rect width="16" height="9" x="28" y="15" fill="#21a366"></rect><path fill="#185c37" d="M44,24H12v16c0,1.105,0.895,2,2,2h28c1.105,0,2-0.895,2-2V24z"></path><rect width="16" height="9" x="28" y="24" fill="#107c42"></rect><rect width="16" height="9" x="12" y="15" fill="#3fa071"></rect><path fill="#33c481" d="M42,6H28v9h16V8C44,6.895,43.105,6,42,6z"></path><path fill="#21a366" d="M14,6h14v9H12V8C12,6.895,12.895,6,14,6z"></path><path d="M22.319,13H12v24h10.319C24.352,37,26,35.352,26,33.319V16.681C26,14.648,24.352,13,22.319,13z" opacity=".05"></path><path d="M22.213,36H12V13.333h10.213c1.724,0,3.121,1.397,3.121,3.121v16.425	C25.333,34.603,23.936,36,22.213,36z" opacity=".07"></path><path d="M22.106,35H12V13.667h10.106c1.414,0,2.56,1.146,2.56,2.56V32.44C24.667,33.854,23.52,35,22.106,35z" opacity=".09"></path><linearGradient id="flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1" x1="4.725" x2="23.055" y1="14.725" y2="33.055" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="1" stop-color="#0b6731"></stop></linearGradient><path fill="url(#flEJnwg7q~uKUdkX0KCyBa_UECmBSgBOvPT_gr1)" d="M22,34H6c-1.105,0-2-0.895-2-2V16c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v16	C24,33.105,23.105,34,22,34z"></path><path fill="#fff" d="M9.807,19h2.386l1.936,3.754L16.175,19h2.229l-3.071,5l3.141,5h-2.351l-2.11-3.93L11.912,29H9.526	l3.193-5.018L9.807,19z"></path></svg></a>', obj.pk)


    def save_model(self, request, obj, form, change):
        objaa = form.save()
        InstructorEvaluation.objects.create_or_update(
            supervisoryvisits=objaa,
            planning_1=request.POST.get("planning_1"),
            planning_2=request.POST.get("planning_2"),
            competencies_1=request.POST.get("competencies_1"),
            competencies_2=request.POST.get("competencies_2"),
            competencies_3=request.POST.get("competencies_3"),
            competencies_4=request.POST.get("competencies_4"),
            competencies_5=request.POST.get("competencies_5"),
            competencies_6=request.POST.get("competencies_6"),
            competencies_7=request.POST.get("competencies_7"),
            competencies_8=request.POST.get("competencies_8"),
            competencies_9=request.POST.get("competencies_9"),
            competencies_10=request.POST.get("competencies_10"),
            competencies_11=request.POST.get("competencies_11"),
            competencies_12=request.POST.get("competencies_12"),
            competencies_13=request.POST.get("competencies_13"),
            competencies_14=request.POST.get("competencies_14"),
            competencies_20=request.POST.get("competencies_20"),
            competencies_21=request.POST.get("competencies_21"),
            competencies_22=request.POST.get("competencies_22"),
            competencies_23=request.POST.get("competencies_23"),
            competencies_24=request.POST.get("competencies_24"),
            development_1=request.POST.get("development_1"),
            development_2=request.POST.get("development_2"),
            development_3=request.POST.get("development_3"),
            development_4=request.POST.get("development_4"),
            development_5=request.POST.get("development_5"),
            development_6=request.POST.get("development_6"),
            productivity_1=request.POST.get("productivity_1"),
            productivity_2=request.POST.get("productivity_2"),
            productivity_3=request.POST.get("productivity_3"),
            productivity_4=request.POST.get("productivity_4"),
            productivity_5=request.POST.get("productivity_5"),
            productivity_6=request.POST.get("productivity_6"),
            productivity_7=request.POST.get("productivity_7"),
            productivity_8=request.POST.get("productivity_8"),
            productivity_9=request.POST.get("productivity_9"),
            productivity_10=request.POST.get("productivity_10"),
            productivity_11=request.POST.get("productivity_11"),
            productivity_12=request.POST.get("productivity_12"),
            productivity_13=request.POST.get("productivity_13"),
            productivity_14=request.POST.get("productivity_14"),
            productivity_15=request.POST.get("productivity_15"),
            productivity_16=request.POST.get("productivity_16"),
            productivity_17=request.POST.get("productivity_17"),
            productivity_18=request.POST.get("productivity_18"),
            productivity_19=request.POST.get("productivity_19"),
            productivity_20=request.POST.get("productivity_20"),
            activities_1=request.POST.get("activities_1"),
            activities_2=request.POST.get("activities_2"),
            activities_3=request.POST.get("activities_3"),
            personal_1=request.POST.get("personal_1"),
            personal_2=request.POST.get("personal_2"),
            personal_3=request.POST.get("personal_3"),
            personal_4=request.POST.get("personal_4"),
            personal_5=request.POST.get("personal_5"),
            personal_6=request.POST.get("personal_6"),
            personal_7=request.POST.get("personal_7"),
            personal_8=request.POST.get("personal_8"),
            personal_9=request.POST.get("personal_9"),
            personal_10=request.POST.get("personal_10"),
            personal_11=request.POST.get("personal_11"),
            personal_12=request.POST.get("personal_12"),
            personal_13=request.POST.get("personal_13"),
            personal_14=request.POST.get("personal_14"),
            personal_15=request.POST.get("personal_15"),
            personal_16=request.POST.get("personal_16"),
            personal_17=request.POST.get("personal_17"),
            personal_18=request.POST.get("personal_18"),
            personal_19=request.POST.get("personal_19"),
            personal_20=request.POST.get("personal_20"),
            personal_21=request.POST.get("personal_21"),
            personal_22=request.POST.get("personal_22"),
            personal_23=request.POST.get("personal_23")
        )
        return obj


    get_year.short_description = "الفصل التدريبي"
    get_trainer_fullname.short_description = "إسم المدرب"
    get_section__department__head_department__name.short_description = "مالك الزيارات الإشرافية"
    get_Prepared.short_description = "الإجراء المنفذ من رئيس القسم"
    get_Watched.short_description = "الإجراء المنفذ من المدرب"
    add_btn_edit.short_description ="تفاصيل وتحرير"
    add_btn_download_file.short_description ="تنزيل الملف"
    