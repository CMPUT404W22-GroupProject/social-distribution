from django.conf.urls import include
from django.urls import path

from . import views


urlpatterns = [
    path('', views.AuthorList.as_view(), name = 'register'),
]