from django.views.generic import CreateView
from candidacy.models import TechnologyCategory
from candidacy.forms import CandidacyForm


class Home(CreateView):
    template_name = 'candidacy/home.html'
    form_class = CandidacyForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['technology_categories'] = TechnologyCategory.objects.prefetch_related(
            'technologies'
        ).all()
        return context
