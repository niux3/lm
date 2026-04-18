from django.db import models
from candidacy.models import Civility, Contract, Position, Status, Technology


class Candidacy(models.Model):
    # info contact
    civilities = models.ManyToManyField(Civility)
    firstname = models.CharField(max_length=64, blank=True)
    lastname = models.CharField(max_length=64, blank=True)

    # Infos poste
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        null=True
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.PROTECT,
        null=True
    )
    contract = models.ForeignKey(
        Contract,
        on_delete=models.PROTECT,
        null=True
    )
    tjm = models.PositiveIntegerField(default=0)
    who = models.CharField(max_length=128, blank=True)

    # Contenu
    expertise = models.TextField(blank=True)
    technologies = models.ManyToManyField(Technology)
    message_genere = models.TextField(blank=True)

    # Meta
    url_source = models.URLField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        who_display = self.who or 'Sans destinataire'
        return f"Candidature {self.pk} - {who_display} - {self.created_at:%d/%m/%Y}"
