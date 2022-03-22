from django.conf.urls import include
from django.urls import path

from like import views as likeView


urlpatterns = [
    path('', likeView.LikedDetails.as_view()),
]