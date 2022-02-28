from django.conf.urls import include
from django.urls import path

from . import views
from like import views as views1

urlpatterns = [
    path('', views.CommentList.as_view()),
    path('<uuid:comment_id>/', views.CommentDetails.as_view()),
    path('<uuid:comment_id>/likes', views1.LikeList.as_view()),
    path('<uuid:comment_id>/likes/<int:like_id>', views1.LikedDetails.as_view()),
]