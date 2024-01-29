from main.models import Project, Resources, LinkedResources
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _


class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "created_at", "updated_at")
    search_fields = ("name", "owner", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


class ResourcesAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "project", "created_at", "updated_at")
    search_fields = ("name", "owner", "project", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


class LinkedResourcesAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "project", "resource", "created_at", "updated_at")
    search_fields = ("name", "owner", "project", "resource", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()


admin.site.register(Project, ProjectAdmin)
admin.site.register(Resources, ResourcesAdmin)
admin.site.register(LinkedResources, LinkedResourcesAdmin)
