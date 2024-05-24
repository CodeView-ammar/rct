
from dal import autocomplete
from django.urls import reverse_lazy
from django import forms

def create_auto_complete(self1):
    class Autocomplete(autocomplete.Select2QuerySetView):
        model = None
        field = None

        def dispatch(self, request, *args, **kwargs):
            return self1.aut_dispatch(self, request, *args, **kwargs)

        def get_queryset(self):
            return self1.auto_get_queryset(self)

    return Autocomplete


class AutoCompleteMixin:
    auto_complete_fields = []

    def aut_dispatch(self, self1, request, *args, **kwargs):
        self1.field = request.GET.get('field')
        return super(self1.__class__, self1).dispatch(request, *args, **kwargs)

    def auto_complete_init(self):
        self.get_models_names()
        self.create_auto_complete_widgets()
        self._auto_complete_class = create_auto_complete(self)

    def auto_get_queryset(self, self1):
        # if not self1.request.user.is_authenticated:
        #     return self1.model.objects.none()
        qs = self._auto_complete_fields[self1.field].objects.all()
        # continent = self1.forwarded.get('continent', None)
        # if continent:
        #     qs = qs.filter(continent=continent)
        if self1.q:
            temp = self1.field.split('__')
            qs = qs.filter(**{temp[-1]+'__istartswith':self1.q})
        return qs

    def get_models_names(self):
        self._auto_complete_fields = dict()
        for field in self.auto_complete_fields:
            temp = field.split('__')
            # try:
            self._auto_complete_fields[field] = self.model_name._meta.get_field(temp[0]).related_model
            # except AttributeError:
            #     raise Exception('the autocomplete fields must be in the model')
    def create_auto_complete_widgets(self):
        for field in self.auto_complete_fields:
            temp = field.split('__')
            self.form_name.fields[temp[0]] = forms.ModelChoiceField(
                queryset=self.model_name.objects.none(),
                widget=autocomplete.ModelSelect2(
                    url=reverse_lazy(self.__class__.__name__.lower()) + '?autoComplete=true&field='+field)
            )