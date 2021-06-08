from django.urls import path
from .views import *
from django.contrib.auth import views as auth_view

app_name='tomato_site_info'
urlpatterns=[
    path('tomato_site_info/', tomato_site_info, name='tomato_site_info'),
]
