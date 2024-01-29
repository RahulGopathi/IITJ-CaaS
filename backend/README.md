# *backend*

## Requirements :
- Python 3.7
- Django 3.1.4
- Other dependencies in `Pipfile`

## Steps to setup locally :
- If you are in the main directory then navigate to the backend directory
```
cd backend
```
- Install `pipenv` for dependency management
```
pip install pipenv
```
- Use pipenv to install other dependencies from `Pipfile`
```
pipenv install --dev
```
- Activate the new virtual environment
```
pipenv shell
```
- Make database migrations
```
python manage.py makemigrations
python manage.py migrate
```
- Create a superuser
```
python manage.py createsuperuser
```
- Run development server on localhost
```
python manage.py runserver :8000
```

## Steps to setup celery :
- Install redis server
```
sudo apt-get install redis-server
```
- Start redis server
```
sudo service redis-server start
```
- Start celery worker
```
celery -A iitjcaas worker -l info
```
- Start celery beat
```
celery -A iitjcaas beat -l info
```
Now the tasks will be running in the background