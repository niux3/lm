from django.urls import path
from candidacy.apps import CandidacyConfig
from candidacy.views import Home

app_name = CandidacyConfig.name

urlpatterns = [
    path('', Home.as_view(), name="home"),
]