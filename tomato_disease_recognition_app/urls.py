from django.urls import path
from .views import *
from django.contrib.auth import views as auth_view
app_name = 'tomato_disease_recognition_app'

urlpatterns = [
    path('tomato_disease_recognition/',tomato_disease_recogntion_page,name='tomato_disease_recognition'),

]
