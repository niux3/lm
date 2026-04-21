from django.urls import path
from candidacy.apps import CandidacyConfig
from candidacy.views import HomeCreateView

app_name = CandidacyConfig.name

urlpatterns = [
    path('', HomeCreateView.as_view(), name="home"),
]
