from django.urls import path
from .views import *

app_name = 'price_app'

urlpatterns = [
    path('price-prediction/',price,name='priceApp'),
]
