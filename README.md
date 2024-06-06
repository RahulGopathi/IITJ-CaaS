# Container as a Service (CaaS) User Interface

This project provides a user-friendly interface for Container as a Service (CaaS), leveraging Kubernetes (K8s) APIs to perform CRUD operations on resources. The aim of the project is to make bare metal resources accessible to everyone in the form of containers.

## Project Goals:

- **Accessibility:** Offer bare metal resources as containers using Kubernetes under the hood.
- **User-Friendly Deployment:** Allow users without container knowledge to deploy their static sites directly from GitHub/GitLab.
- **Advanced Container Management:** Enable users with container knowledge to manage and experiment with containers.

Whether you are a beginner looking to deploy a static site or an experienced developer wanting to play with containers, this project simplifies the process and empowers you to harness the power of Kubernetes.

## Steps to run locally

- Clone this repository and launch code:
    ```
    git clone https://github.com/RahulGopathi/IITJ-CaaS.git
    cd IITJ-CaaS
    code .
    ```

### With Docker

Ensure that you have installed [Docker](https://docs.docker.com/install/) (with [Docker Compose](https://docs.docker.com/compose/install/)).

Run the development server:
    ```
    make dev-start
    ```

After executing `make dev-start`, you will be running:
* The application on http://localhost:3000 
* The API Server on http://localhost:8000

Make database migrations: 
```
make exec
python manage.py makemigrations
python manage.py migrate
```

Create a superuser: 
```
make exec
python manage.py createsuperuser
```

View logs of docker containers: 
```
make dev-logs
```

To stop the development server: 
```
make dev-stop
```

### Without Docker

- Copy `.env.example` to `.env`
```
cp .env.example .env
```

- To start your frontend and backend development server individually:

    Follow the [Backend Readme](https://github.com/RahulGopathi/Cab-Management-System/tree/main/backend) to setup your backend server

    Follow the [Frontend Readme](https://github.com/RahulGopathi/Cab-Management-System/tree/main/frontend) to setup the frontend server
