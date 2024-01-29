# tasks.py

from celery import shared_task
from .models import Cab
from django.db import transaction
import logging
import polyline
import time
from main.utils import get_google_maps_route

logger = logging.getLogger(__name__)


@shared_task
def update_cab_positions():
    # Fetch all cabs from the database
    cabs = Cab.objects.all()
    logger.info("Updating cab positions...")

    # Update the positions of each cab based on a constant speed
    with transaction.atomic():
        for cab in cabs:
            # Simulate movement by updating latitude and longitude
            cab.location_latitude += 0.1
            cab.location_longitude += 0.1
            cab.save()

    logger.info("Updated cab positions...")


@shared_task
def move_cabs_along_route():
    route_polyline = get_google_maps_route(
        "AIzaSyCdAOn8KI6yDXfUFN39qD1B1sglBKrqCO8",
        "17.4965, 78.3730",
        "17.4367, 78.4007",
    )

    if route_polyline:
        decoded_route = polyline.decode(route_polyline)

        logger.info("Moving cabs along route...")

        with transaction.atomic():
            for index, (latitude, longitude) in enumerate(decoded_route):
                # Update cab positions based on the decoded route
                cab = Cab.objects.get(pk=1)
                print(cab)
                cab.location_latitude = latitude
                cab.location_longitude = longitude
                cab.save()

                time.sleep(1)
