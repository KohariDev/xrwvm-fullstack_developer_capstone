# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views  # Import views

app_name = 'djangoapp'
urlpatterns = [
    # path for registration
    path(route='login', view=views.login_user, name='login'),

    # path for get cars
    path(route='get_cars', view=views.get_cars, name='get_cars'),

    # path for dealer reviews view

    # path for add a review view

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
