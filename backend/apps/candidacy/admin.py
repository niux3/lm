from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from candidacy.models import Candidacy, Civility, Contract, Position, Status, Technology, TechnologyCategory


@admin.register(Civility)
class CivilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(TechnologyCategory)
class TechnologyCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'value', 'category')
    list_filter = ('category',)
    search_fields = ('name', 'value')


@admin.register(Candidacy)
class CandidacyAdmin(admin.ModelAdmin):
    # Liste des colonnes affichées
    list_display = (
        'id',
        'destinataire',
        'poste_complet',
        'date_courte',
        'technos_count',
        'has_message',
        'copy_message_button',
    )

    # Filtres dans la barre latérale
    list_filter = (
        'status',
        'position',
        'contract',
        ('created_at', admin.DateFieldListFilter),
        'technologies',
    )

    # Champs de recherche
    search_fields = (
        'firstname',
        'lastname',
        'who',
        'title',
        'description',
        'expertise',
        'message_genere',
    )

    # Champs en lecture seule
    readonly_fields = (
        'created_at',
        'message_genere',
        'message_preview',
    )

    # Organisation des fieldsets
    fieldsets = (
        ('📇 Contact', {
            'fields': (
                ('firstname', 'lastname'),
                'civilities',
            )
        }),
        ('💼 Poste', {
            'fields': (
                'title',
                'who',
                ('status', 'position', 'contract'),
                'tjm',
            )
        }),
        ('🔗 Source', {
            'fields': (
                'url_source',
                'description',
            )
        }),
        ('🛠️ Compétences', {
            'fields': (
                'technologies',
                'expertise',
            )
        }),
        ('📝 Message généré', {
            'fields': (
                'message_genere',
                'message_preview',
            ),
            'classes': ('wide',)
        }),
        ('📅 Métadonnées', {
            'fields': (
                'created_at',
            ),
            'classes': ('collapse',)
        }),
    )

    # Filtres horizontaux pour les ManyToMany
    filter_horizontal = ('technologies', 'civilities')

    # Nombre d'éléments par page
    list_per_page = 25

    # Actions personnalisées
    actions = ['copy_selected_messages']

    # ========== Méthodes personnalisées pour list_display ==========

    @admin.display(description='Destinataire')
    def destinataire(self, obj):
        if obj.firstname or obj.lastname:
            return f"{obj.firstname} {obj.lastname}".strip()
        return obj.who or '—'

    @admin.display(description='Poste')
    def poste_complet(self, obj):
        parts = []
        if obj.status:
            parts.append(str(obj.status))
        if obj.position:
            parts.append(str(obj.position))
        return ' - '.join(parts) if parts else '—'

    @admin.display(description='Date')
    def date_courte(self, obj):
        return obj.created_at.strftime('%d/%m/%Y')
    date_courte.admin_order_field = 'created_at'

    @admin.display(description='Technos')
    def technos_count(self, obj):
        count = obj.technologies.count()
        return f'{count} techno{"s" if count > 1 else ""}'

    @admin.display(description='Message', boolean=True)
    def has_message(self, obj):
        return bool(obj.message_genere)

    @admin.display(description='📋')
    def copy_message_button(self, obj):
        if not obj.message_genere:
            return '—'
        return format_html(
            '<button type="button" '
            'onclick="navigator.clipboard.writeText(`{}`);alert(\'Copié !\')" '
            'style="padding:4px 8px;cursor:pointer;">📋 Copier</button>',
            obj.message_genere.replace('`', '\\`').replace('${', '\\${')
        )
    copy_message_button.short_description = 'Copier'

    # ========== Champs en lecture seule ==========

    @admin.display(description='Aperçu')
    def message_preview(self, obj):
        if not obj.message_genere:
            return '—'
        preview = obj.message_genere[:500]
        if len(obj.message_genere) > 500:
            preview += '…'
        return format_html(
            '<pre style="margin:0;padding:10px;background:#f5f5f5;'
            'border-radius:4px;max-height:300px;overflow:auto;'
            'white-space:pre-wrap;font-family:monospace;">{}</pre>',
            preview
        )

    # ========== Actions ==========

    @admin.action(description='📋 Copier les messages des candidatures sélectionnées')
    def copy_selected_messages(self, request, queryset):
        messages = []
        for candidacy in queryset:
            if candidacy.message_genere:
                messages.append(
                    f"=== {candidacy} ===\n{candidacy.message_genere}\n")

        if messages:
            self.message_user(
                request,
                f'{len(messages)} message(s) prêt(s) à être collé(s).',
                level='SUCCESS'
            )
            # Note : le presse-papier ne peut pas être rempli côté serveur
        else:
            self.message_user(
                request,
                'Aucun message généré dans la sélection.',
                level='WARNING'
            )
