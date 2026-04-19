from django import forms
from candidacy.models import Candidacy, Civility, Status, Position


class CandidacyForm(forms.ModelForm):
    class Meta:
        model = Candidacy
        fields = '__all__'
        widgets = {
            'civilities': forms.CheckboxSelectMultiple(),
            'technologies': forms.CheckboxSelectMultiple(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not self.initial.get('status'):
            try:
                self.initial['status'] = Status.objects.get(
                    name='lead développeur').pk
            except Status.DoesNotExist:
                ...

        if not self.initial.get('position'):
            try:
                self.initial['position'] = Position.objects.get(
                    name='fullstack').pk
            except Position.DoesNotExist:
                ...

        if not self.initial.get('civilities'):
            try:
                self.initial['civilities'] = list(
                    Civility.objects.filter(
                        name__in=['Madame', 'Monsieur']).values_list('pk', flat=True)
                )
            except Civility.DoesNotExist:
                ...
