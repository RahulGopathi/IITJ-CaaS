from django.urls import path, include
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet, basename="project")

urlpatterns = [
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.RegisterView.as_view(), name="auth_register"),
    path("", views.getRoutes),
    path("", include(router.urls)),
    path("create_resources/", views.create_resources),
    path("list_pods/", views.list_pods),
    path("fetch_logs/", views.get_pod_logs),
    path("pod_exec/", views.create_pod_exec),
    path("create_deployment/", views.deploy_static_site),
]
