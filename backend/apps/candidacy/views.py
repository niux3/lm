from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic import CreateView
from django.http.response import JsonResponse
from candidacy.models import TechnologyCategory
from candidacy.forms import CandidacyForm


@method_decorator(csrf_exempt, name='dispatch')
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
            return JsonResponse({
                'success': True,
                'message': self.object.message_genere,
                'candidacy_id': self.object.pk
            })
        return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'errors': {field: field_errors[0] for field, field_errors in form.errors.items()},
            }, status=400)
        return super().form_invalid(form)
