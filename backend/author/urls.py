from django.conf.urls import include
from django.urls import path

from . import views as authorView
from like import views as likeView

urlpatterns = [
    path('', authorView.AuthorList.as_view()),
    path('<int:author_id>/', authorView.AuthorDetails.as_view()),
    path('<int:author_id>/liked', likeView.LikedDetails.as_view()),

]