# Cab Management System

An application with react and django for cab management system

## Steps to run locally

- Clone this repository and launch code:
    ```
    git clone https://github.com/RahulGopathi/Cab-Management-System.git
    cd Cab-Management-System
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
