from pprint import pprint
from django.views.generic import CreateView
from django.http.response import JsonResponse
from candidacy.models import TechnologyCategory
from candidacy.forms import CandidacyForm


class HomeCreateView(CreateView):
    template_name = 'candidacy/home.html'
    form_class = CandidacyForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['technology_categories'] = TechnologyCategory.objects.prefetch_related(
            'technologies'
        ).all()
        return context

    def form_valid(self, form):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            self.object = form.save()
        return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'errors': form.errors.get_json_data(),
            }, status=400)
        return super().form_invalid(form)
