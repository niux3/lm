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

            print("\n" + "=" * 60)
            print("📨 REQUÊTE AJAX")
            print("=" * 60)

            # POST data
            print("\n📋 POST Data:")
            pprint(dict(self.request.POST.items()))

            # Form cleaned data
            print("\n✅ Cleaned Data:")
            pprint(form.cleaned_data)

            # Technologies sélectionnées (ManyToMany)
            if 'technologies' in form.cleaned_data:
                techs = form.cleaned_data['technologies']
                print(f"\n🛠️ Technologies ({techs.count()}):")
                for tech in techs:
                    print(f"  - {tech.value} ({tech.category.name})")

            # Civilités sélectionnées
            if 'civilities' in form.cleaned_data:
                civs = form.cleaned_data['civilities']
                print(f"\n👤 Civilités ({civs.count()}):")
                for civ in civs:
                    print(f"  - {civ.name}")

            print("\n" + "=" * 60 + "\n")
            return JsonResponse({
                'success': True,
                'message': self.object.message_genere,
                'candidacy_id': self.object.pk,
            })
        return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'errors': form.errors.get_json_data(),
            }, status=400)
        return super().form_invalid(form)
