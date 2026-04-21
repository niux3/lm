from django import forms
from candidacy.models import (
    Candidacy,
    Civility,
    Status,
    Position,
    Contract,
    Technology
)


class CandidacyForm(forms.ModelForm):
    class Meta:
        model = Candidacy
        fields = '__all__'

    civilities = forms.ModelMultipleChoiceField(
        queryset=Civility.objects.all(),
        widget=forms.CheckboxSelectMultiple(),
        required=True,
        initial=lambda: Civility.objects.filter(
            name__in=['Madame', 'Monsieur']
        ).values_list('pk', flat=True)
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._get_default_value('status', 'lead développeur', Status)
        self._get_default_value('contract', 'CDI', Contract)
        self._get_default_value('position', 'fullstack', Position)

        if not self.initial.get('expertise'):
            self.initial['expertise'] = "les applications web et embarquées"

        # valeur défaut manuel. Dans le template, les champs sont écrits manuellement
        if not self.initial.get('technologies'):
            try:
                self.initial['technologies'] = list(
                    Technology.objects.filter(
                        value__in=['Accessibilité', 'SEO', 'GNU/Linux']).values_list('pk', flat=True)
                )
            except Technology.DoesNotExist:
                ...

    def _get_default_value(self, name, condition, model):
        if not self.initial.get(name):
            try:
                self.initial[name] = model.objects.get(
                    name=condition).pk
            except model.DoesNotExist:
                ...