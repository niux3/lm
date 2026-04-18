from django.db import models


class TechnologyCategory(models.Model):
    name = models.CharField(max_length=16)

    def __str__(self):
        return '%s : %s' % (self.pk, self.name)
