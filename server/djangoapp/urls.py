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
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships, name='get_dealers_by_state'),

    # Path for fetching dealer details by ID
    path('dealer/<int:dealer_id>', view=views.get_dealer_details, name='dealer_details'),

    # Path for fetching reviews of a dealer with sentiment analysis
    path('reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews, name='dealer_reviews'),

    # Path for adding a review
    path('add_review', view=views.add_review, name='add_review'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
