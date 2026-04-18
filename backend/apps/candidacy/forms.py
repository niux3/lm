from django import forms
from candidacy.models import Candidacy


class CandidacyForm(forms.ModelForm):
    class Meta:
        model = Candidacy
        fields = '__all__'
        widgets = {
            'civilities': forms.CheckboxSelectMultiple(),
            'technologies': forms.CheckboxSelectMultiple(),
        }
