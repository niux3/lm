from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from candidacy.models import (
    Civility,
    Contract,
    Position,
    Status,
    TechnologyCategory,
    Technology
)


class Command(BaseCommand):
    help = "insert data in db"

    def handle(self, *args, **options):
        technos_sector = {
            "langages": [
                {'name': "python", 'value': "Python"},
                {'name': "sql", 'value': "SQL"},
                {'name': "html", 'value': "HTML"},
                {'name': "css", 'value': "CSS"},
                {'name': "javascript", 'value': "Javascript"},
                {'name': "typescript", 'value': "Typescript"},
            ],
            "analyse": [
                {'name': "numpy", 'value': "Numpy"},
                {'name': "pandas", 'value': "Pandas"},
                {'name': "matplotlib", 'value': "Matplotlib"},
            ],
            "database": [
                {'name': "postgresql", 'value': "PostgreSQL"},
                {'name': "mysql", 'value': "MySQL"},
                {'name': "mongodb", 'value': "MongoDB"},
                {'name': "sqlite", 'value': "SQLite"},
                {'name': "redis", 'value': "Redis"},
            ],
            "backend": [
                {'name': "linux", 'value': "GNU/Linux"},
                {'name': "docker", 'value': "Docker"},
                {'name': "celery", 'value': "Celery"},
                {'name': "expressjs", 'value': "ExpressJS"},
                {'name': "django", 'value': "Django"},
                {'name': "drf", 'value': "Django Rest Framework"},
                {'name': "flask", 'value': "Flask"},
                {'name': "flask_rest_full", 'value': "Flask REST"},
                {'name': "fastapi", 'value': "Fastapi"},
            ],
            "frontend": [
                {'name': "a11y", 'value': "Accessibilité"},
                {'name': "seo", 'value': "SEO"},
                {'name': "nodejs", 'value': "NodeJS"},
                {'name': "svelte", 'value': "Svelte"},
                {'name': "sveltekit", 'value': "Sveltekit"},
                {'name': "vuejs", 'value': "VueJS"},
                {'name': "nuxtjs", 'value': "NuxtJS"},
                {'name': "reactjs", 'value': "ReactJS"},
                {'name': "nextjs", 'value': "NextJS"},
                {'name': "astro", 'value': "Astro"},
            ],
        }
        civilities = ['Mademoiselle', 'Madame', 'Monsieur']
        status = ['développeur', 'lead développeur']
        positions = ['frontend', 'backend', 'fullstack']
        contracts = ['CDI', 'freelance']

        self._create_superuser()

        self._insert_base(civilities, Civility)
        self._insert_base(status, Status)
        self._insert_base(positions, Position)
        self._insert_base(contracts, Contract)
        for sector, rows in technos_sector.items():
            category, _ = TechnologyCategory.objects.get_or_create(name=sector)
            for row in rows:
                obj, created = Technology.objects.get_or_create(
                    name=row['name'],
                    defaults={  # utilisé UNIQUEMENT pour la création
                        'value': row['value'],
                        'category': category
                    }
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"  ➕ Created Technology: {row['value']}")
                    )
                else:
                    if obj.value != row['value'] or obj.category != category:
                        obj.value = row['value']
                        obj.category = category
                        obj.save()
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"  🔄 Updated Technology: {row['value']}"
                            )
                        )
        self.stdout.write(self.style.SUCCESS('✅ Data inserted successfully!'))

    def _create_superuser(self):
        username = 'renaud'
        email = 'dom@dom.com'
        password = 'admin'

        User = get_user_model()

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'  👤 Created superuser: {username}')
            )

    def _insert_base(self, data, model):
        for item in data:
            obj, created = model.objects.get_or_create(name=item)
            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"  ➕ Created {model.__name__}: {item}"
                    )
                )
