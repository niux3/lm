from django.db import models
from candidacy.models import TechnologyCategory


class Technology(models.Model):
    name = models.CharField(max_length=32)
    value = models.CharField(max_length=32)
    category = models.ForeignKey(
        TechnologyCategory,
        on_delete=models.CASCADE,
        related_name='technologies'
    )

    def __str__(self):
        return '%s : %s - %s' % (self.category.name, self.name, self.value)
