import requests
import json


def create_kubernetes_pod(payload):
    # Define pod specifications
    pod_spec = {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
            "name": payload["name"],
            "labels": extract_labels(payload),
        },
        "spec": {
            "containers": [
                {
                    "name": payload["name"] + "-container",
                    "image": payload["container_image"],
                    "ports": [
                        {
                            "containerPort": int(payload.get("container_port", 80)),
                            "protocol": "TCP",
                        }
                    ],
                }
            ]
        },
    }

    if payload.get("run_command") != "":
        pod_spec["spec"]["containers"][0]["command"] = payload.get("run_command")
    if payload.get("run_command_args") != "":
        pod_spec["spec"]["containers"][0]["args"] = payload.get("run_command_args")
    if payload.get("cpu_requirement") != "" or payload.get("ram_requirement") != "":
        pod_spec["spec"]["containers"][0]["resources"] = {}
        if payload.get("cpu_requirement") != "":
            pod_spec["spec"]["containers"][0]["resources"]["limits"] = {}
            pod_spec["spec"]["containers"][0]["resources"]["limits"][
                "cpu"
            ] = payload.get("cpu_requirement")
        if payload.get("ram_requirement") != "":
            pod_spec["spec"]["containers"][0]["resources"]["limits"] = {}
            pod_spec["spec"]["containers"][0]["resources"]["limits"]["memory"] = (
                payload.get("ram_requirement") + "Mi"
            )
    if payload.get("env_variables") is not None:
        pod_spec["spec"]["containers"][0]["env"] = extract_env_variables(payload)
    # print (pod_spec) json
    print(json.dumps(pod_spec))

    # Create the pod using Kubernetes API
    create_kubernetes_resource("/api/v1/namespaces/default/pods", pod_spec)


def create_kubernetes_deployment(payload):
    # Define deployment specifications
    deployment_spec = {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": payload["name"],
            "labels": extract_labels(payload),
        },
        "spec": {
            "replicas": int(payload["no_of_pods"]),
            "selector": {
                "matchLabels": {
                    "app": payload["name"],
                }
            },
            "template": {
                "metadata": {
                    "labels": extract_labels(payload),
                },
                "spec": {
                    "containers": [
                        {
                            "name": payload["name"] + "-container",
                            "image": payload["container_image"],
                            "ports": [
                                {
                                    "containerPort": int(
                                        payload.get("container_port", 80)
                                    ),
                                    "protocol": "TCP",
                                }
                            ],
                        }
                    ]
                },
            },
        },
    }

    # add app label to dict deployment_spec["spec"]["template"]["metadata"]["labels"]
    deployment_spec["spec"]["template"]["metadata"]["labels"]["app"] = payload["name"]

    if payload.get("cpu_requirement") != "" or payload.get("ram_requirement") != "":
        deployment_spec["spec"]["template"]["spec"]["containers"][0]["resources"] = {}
        if payload.get("cpu_requirement") != "":
            deployment_spec["spec"]["template"]["spec"]["containers"][0]["resources"][
                "limits"
            ] = {}
            deployment_spec["spec"]["template"]["spec"]["containers"][0]["resources"][
                "limits"
            ]["cpu"] = payload.get("cpu_requirement")
        if payload.get("ram_requirement") != "":
            deployment_spec["spec"]["template"]["spec"]["containers"][0]["resources"][
                "limits"
            ] = {}
            deployment_spec["spec"]["template"]["spec"]["containers"][0]["resources"][
                "limits"
            ]["memory"] = (payload.get("ram_requirement") + "Mi")
    if payload.get("env_variables") is not None:
        deployment_spec["spec"]["template"]["spec"]["containers"][0][
            "env"
        ] = extract_env_variables(payload)
    if payload.get("run_command") != "":
        deployment_spec["spec"]["template"]["spec"]["containers"][0][
            "command"
        ] = payload.get("run_command")
    if payload.get("run_command_args") != "":
        deployment_spec["spec"]["template"]["spec"]["containers"][0][
            "args"
        ] = payload.get("run_command_args")
    print("spec", json.dumps(deployment_spec))

    # Create the deployment using Kubernetes API
    create_kubernetes_resource(
        "/apis/apps/v1/namespaces/default/deployments", deployment_spec
    )


def create_kubernetes_resource(api_path, resource_spec):
    # Kubernetes API server URL
    api_server_url = "http://localhost:8001"

    # Create the resource using HTTP POST request
    response = requests.post(
        api_server_url + api_path,
        headers={"Content-Type": "application/json"},
        data=json.dumps(resource_spec),
    )

    # Check if the request was successful (HTTP status code 201)
    if response.status_code != 201:
        raise Exception(
            f"Failed to create Kubernetes resource. Status code: {response.status_code}, Error: {response.text}"
        )
    else:
        # Update the resource_id field of the resource instance
        return response.json()["metadata"]["name"]


def extract_labels(payload):
    return {label["key"]: label["value"] for label in payload.get("labels", [])}


def extract_env_variables(payload):
    return [
        {"name": env_var["key"], "value": env_var["value"]}
        for env_var in payload.get("env_variables", [])
    ]
