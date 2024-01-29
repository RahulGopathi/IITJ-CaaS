from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.serializer import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    ProjectSerializer,
    ResourcesSerializer,
    LinkedResourcesSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, viewsets
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from main.models import Project, Resources, LinkedResources
from django.http import JsonResponse
import json
from django.db import transaction
from api.utils import create_kubernetes_deployment, create_kubernetes_pod
from random_username.generate import generate_username
import requests


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(["GET"])
def getRoutes(request):
    routes = ["/api/login/", "/api/register/", "/api/login/refresh/", "/api/projects/"]
    return Response(routes)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "put", "delete"]

    def get_queryset(self):
        # return all the projects that the user owns or is shared with
        user = self.request.user
        return Project.objects.filter(owner=user) | Project.objects.filter(
            sharing_with=user
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(["POST"])
def list_pods(request):
    try:
        # Kubernetes API server URL
        api_server_url = "http://localhost:8001"

        # Define API path for listing pods
        api_path = "/api/v1/namespaces/default/pods"

        # Define label selector
        payload = json.loads(request.body)
        label_selector = payload.get("label_selector")

        # Create the URL for the Kubernetes API request
        api_url = f"{api_server_url}{api_path}?labelSelector={label_selector}"

        # Send GET request to the Kubernetes API
        response = requests.get(api_url)

        # Check if the request was successful (HTTP status code 200)
        if response.status_code == 200:
            # Parse the response JSON
            pods = response.json()["items"]

            # Extract relevant information from the pods
            pod_list = []
            for pod in pods:
                if "status" in pod and "containerStatuses" in pod["status"]:
                    # Standalone Pod
                    status = pod["status"]["phase"]
                    restarts = pod["status"]["containerStatuses"][0]["restartCount"]
                elif "status" in pod:
                    # Pod managed by Deployment
                    status = pod["status"]["phase"]
                    restarts = 0  # Deployment pods don't have individual restart counts
                else:
                    # Handle other cases or raise an exception if needed
                    status = "Unknown"
                    restarts = 0

                pod_info = {
                    "name": pod["metadata"]["name"],
                    "container_name": pod["spec"]["containers"][0]["name"],
                    "namespace": pod["metadata"]["namespace"],
                    "image": pod["spec"]["containers"][0]["image"],
                    "labels": pod["metadata"]["labels"],
                    "status": status,
                    "restarts": restarts,
                    "created_at": pod["metadata"]["creationTimestamp"],
                }
                pod_list.append(pod_info)

            return JsonResponse({"pods": pod_list}, status=200)
        else:
            # Return error message if the request was not successful
            return JsonResponse({"error": response.text}, status=response.status_code)

    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def create_resources(request):
    try:
        payload = json.loads(request.body)

        # Extract necessary fields from the payload
        owner = request.user
        project_id = payload.get("project_id")
        no_of_pods = int(payload.get("no_of_pods", 1))

        # Create a Resource instance
        with transaction.atomic():
            project = Project.objects.get(id=project_id)
            resource = Resources.objects.create(
                owner=owner,
                project=project,
                name=payload.get("name", "no_name"),
                description=payload.get("description", ""),
                resource_type="pod" if no_of_pods == 1 else "deployment",
                resource_id="",
                labels=json.dumps(payload.get("labels", [])),
            )

            # Create Kubernetes deployment or pod based on 'no_of_pods'
            try:
                resource_id = ""
                if no_of_pods > 1:
                    resource_id = create_kubernetes_deployment(payload)
                else:
                    resource_id = create_kubernetes_pod(payload)

                if resource_id:
                    resource.resource_id = resource_id
                    resource.save()
                return JsonResponse(
                    {"message": "Resource created successfully"}, status=201
                )
            except Exception as e:
                print(e)
                return JsonResponse(
                    {"error": "Failed to create Kubernetes resource"}, status=400
                )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST"])
def get_pod_logs(request):
    payload = json.loads(request.body)
    namespace = payload.get("namespace", "default")
    pod_name = payload.get("pod_name", "")
    container_name = payload.get("container_name", "")

    try:
        # Replace 'http://localhost:8001' with the actual Kubernetes API server URL
        api_server_url = "http://localhost:8001"
        api_path = f"/api/v1/namespaces/{namespace}/pods/{pod_name}/log"
        params = {"container": container_name}

        response = requests.get(
            api_server_url + api_path,
            params=params,
        )

        response.raise_for_status()  # Raise an exception for HTTP errors

        logs = response.text
        return JsonResponse({"logs": logs})
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
def create_pod_exec(request):
    try:
        payload = json.loads(request.body)
        namespace = payload.get("namespace", "default")
        pod_name = payload.get("pod_name", "")
        container_name = payload.get("container_name", "")

        # Kubernetes API server URL
        api_server_url = "http://localhost:8001"

        # Kubernetes API path for executing commands in a pod
        api_path = f"/api/v1/namespaces/{namespace}/pods/{pod_name}/exec?container={container_name}&stdin=true&stdout=true&stderr=true&tty=true&command=/bin/sh"

        # Start the execution of the command in the pod
        response = requests.post(
            api_server_url + api_path,
            headers={"Upgrade": "websocket", "Connection": "Upgrade"},
        )

        if response.status_code == 201:
            exec_url = response.json()["url"]
            return JsonResponse({"exec_url": exec_url})
        else:
            return JsonResponse(
                {
                    "error": f"Failed to start command execution. Status code: {response.status_code}"
                }
            )

    except Exception as e:
        return JsonResponse({"error": str(e)})


@api_view(["POST"])
def deploy_static_site(request):
    try:
        # Get data from the request
        data = json.loads(request.body)
        owner = data.get("owner")
        deployment_name = data.get("deployment_name")
        random_domain = generate_username(1)[0]
        repo_url = data.get("repo_url")
        branch_name = data.get("branch_name")
        custom_domain = data.get("custom_domain")
        final_cutom_domain = ""

        if custom_domain == "":
            final_cutom_domain = (
                deployment_name + random_domain + ".iitjcaas.devluplabs.tech"
            )
        else:
            final_cutom_domain = custom_domain

        # Kubernetes API server URL
        api_server_url = (
            "http://localhost:8001"  # Replace with your actual K8s API server URL
        )

        # Deployment
        deployment_spec = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {
                "name": "static-site-deployment-" + deployment_name,
            },
            "spec": {
                "replicas": 1,
                "selector": {
                    "matchLabels": {
                        "app": "static-site",
                        "owner": owner,
                        "deployment_name": deployment_name,
                    },
                },
                "template": {
                    "metadata": {
                        "labels": {
                            "app": "static-site",
                            "owner": owner,
                            "deployment_name": deployment_name,
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "name": "static-site-container",
                                "image": "nginx:latest",
                                "command": ["/bin/sh"],
                                "ports": [{"containerPort": 80}],
                                "args": [
                                    "-c",
                                    "apt-get update && apt-get install -y git && mkdir myrepo && git clone --branch "
                                    + branch_name
                                    + " "
                                    + repo_url
                                    + " myrepo && mv myrepo/* . && rm -r myrepo && nginx -g 'daemon off;'",
                                ],
                            }
                        ],
                    },
                },
            },
        }

        # Create Deployment
        deployment_url = f"{api_server_url}/apis/apps/v1/namespaces/default/deployments"
        response = requests.post(
            deployment_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(deployment_spec),
        )
        if response.status_code != 201:
            return Response({"error": response.text}, status=response.status_code)

        # Service
        service_spec = {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {"name": "static-site-service-" + deployment_name},
            "spec": {
                "selector": {
                    "app": "static-site",
                    "owner": owner,
                    "deployment_name": deployment_name,
                },
                "ports": [{"protocol": "TCP", "port": 7777, "targetPort": 80}],
            },
        }

        # Create Service
        service_url = f"{api_server_url}/api/v1/namespaces/default/services"
        response = requests.post(
            service_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(service_spec),
        )
        if response.status_code != 201:
            return Response({"error": response.text}, status=response.status_code)

        # Ingress
        ingress_spec = {
            "apiVersion": "networking.k8s.io/v1",
            "kind": "Ingress",
            "metadata": {
                "name": "static-site-ingress-" + deployment_name,
                "annotations": {
                    "kubernetes.io/ingress.class": "nginx",
                    "nginx.ingress.kubernetes.io/ssl-redirect": "false",
                },
            },
            "spec": {
                "rules": [
                    {
                        "host": final_cutom_domain,
                        "http": {
                            "paths": [
                                {
                                    "path": "/",
                                    "pathType": "Prefix",
                                    "backend": {
                                        "service": {
                                            "name": "static-site-service-"
                                            + deployment_name,
                                            "port": {"number": 7777},
                                        }
                                    },
                                }
                            ]
                        },
                    }
                ],
            },
        }

        # Create Ingress
        ingress_url = (
            f"{api_server_url}/apis/networking.k8s.io/v1/namespaces/default/ingresses"
        )
        response = requests.post(
            ingress_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(ingress_spec),
        )
        if response.status_code != 201:
            return Response({"error": response.text}, status=response.status_code)

        return Response(
            {"message": "Deployment, Service, and Ingress created successfully"},
            status=201,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=500)
