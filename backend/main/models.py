from django.db import models
from random_username.generate import generate_username


class Project(models.Model):
    owner = models.ForeignKey(
        "auth.User", related_name="owner", on_delete=models.CASCADE
    )
    sharing_with = models.ManyToManyField(
        "auth.User", related_name="sharing_with", blank=True
    )
    name = models.CharField(max_length=100)
    project_nickname = models.CharField(max_length=100, unique=True, blank=True)
    description = models.TextField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # auto generate project_nickname on save
    def save(self, *args, **kwargs):
        if not self.project_nickname:
            self.project_nickname = generate_username(1)[0]
        super(Project, self).save(*args, **kwargs)


class Resources(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, related_name="resources", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=200, blank=True)
    resource_type = models.CharField(max_length=100, blank=True)
    resource_id = models.CharField(max_length=100, blank=True)
    labels = models.TextField(max_length=400, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class LinkedResources(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    project = models.ForeignKey(
        Project, related_name="linked_projects", on_delete=models.CASCADE
    )
    resource = models.ForeignKey(
        Resources, related_name="linked_resources", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=200, blank=True)
    linked_resource_type = models.CharField(max_length=100, blank=True)
    linked_resource_id = models.CharField(max_length=100, blank=True)
    labels = models.TextField(max_length=400, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
