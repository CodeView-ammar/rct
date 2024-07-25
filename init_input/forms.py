
from django import forms
from .models import InstructorEvaluation, SupervisoryVisits
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout
from crispy_forms.layout import Submit
from crispy_forms.layout import Row
from crispy_forms.layout import Column
class InstructorEvaluationForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(InstructorEvaluationForm, self).__init__(*args, **kwargs)
        for name in self.fields.keys():
            if str(self.fields[name].__class__.__name__)=='DecimalField':
                self.fields[name].widget.attrs.update(
                    {
                        "class": "border bg-white font-medium rounded-md shadow-sm text-gray-500 text-sm focus:ring focus:ring-primary-300 focus:border-primary-600 focus:outline-none group-[.errors]:border-red-600 group-[.errors]:focus:ring-red-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400 dark:focus:border-primary-600 dark:focus:ring-primary-700 dark:focus:ring-opacity-50 dark:group-[.errors]:border-red-500 dark:group-[.errors]:focus:ring-red-600/40 px-3 py-2 w-full max-w-2xl",
                        "max_value":InstructorEvaluation._meta.get_field(name).default,
                        "min_value":0,
                        "value":InstructorEvaluation._meta.get_field(name).default,
            
                    }
                )
    
    class Meta:
        model = InstructorEvaluation
        fields = ["supervisoryvisits","planning_1","planning_2","competencies_1","competencies_2","competencies_3","competencies_4","competencies_5","competencies_6","competencies_7","competencies_8","competencies_9","competencies_10","competencies_11","competencies_12","competencies_13","competencies_14","competencies_15","competencies_16","competencies_17","competencies_18","competencies_19","competencies_20","competencies_21","competencies_22","competencies_23","competencies_24","competencies_25","competencies_26","competencies_27","development_1","development_2","development_3","development_4","development_5","development_6","productivity_1","productivity_2","productivity_3","productivity_4","productivity_5","productivity_6","productivity_7","productivity_8","productivity_9","productivity_10","productivity_11","productivity_12","productivity_13","productivity_14","productivity_15","productivity_16","productivity_17","productivity_18","productivity_19","productivity_20","activities_1","activities_2","activities_3","personal_1","personal_2","personal_3","personal_4","personal_5","personal_6","personal_7","personal_8","personal_9","personal_10","personal_11","personal_12","personal_13","personal_14","personal_15","personal_16","personal_17","personal_18","personal_19","personal_20","personal_21","personal_22","personal_23"
]