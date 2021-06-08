from django.urls import path
from .views import *
from django.contrib.auth import views as auth_view
app_name = 'tomato_disease_info_app'

urlpatterns = [
    path('tomato_disease_info/', disease_info, name='tomato_disease_info'),
    path('tomato_disease_info/info_page/', info_page, name='info' ),
    path('tomato_disease_info/info_page/2', info_page2, name='info2' ),
    path('tomato_disease_info/info_page/3', info_page3, name='info3' ),
    path('tomato_disease_info/info_page/4', info_page4, name='info4' ),
    path('tomato_disease_info/info_page/5', info_page5, name='info5' ),
    path('tomato_disease_info/info_page/6', info_page6, name='info6' ),
    path('tomato_disease_info/info_page/7', info_page7, name='info7' ),
    path('tomato_disease_info/info_page/8', info_page8, name='info8' ),

    
]
