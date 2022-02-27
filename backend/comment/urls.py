from django.conf.urls import include
from django.urls import path

from . import views

urlpatterns = [
    path('', views.CommentList.as_view()),
    path('<uuid:comment_id>/', views.CommentDetails.as_view())
]