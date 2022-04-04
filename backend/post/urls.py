from django.conf.urls import include
from django.urls import path

from . import views as views0
from like import views as views1

urlpatterns = [
    path('', views0.PostList.as_view()),
    path('<uuid:post_id>/', views0.PostDetails.as_view()),
    path('<uuid:post_id>/image', views0.ImagePostDetails.as_view()),
    path('<uuid:post_id>/likes', views1.LikeList.as_view()),
    path('<uuid:post_id>/comments/', include('comment.urls')),
    path('<uuid:post_id>/likes/<int:like_id>', views1.LikeDetails.as_view()),
]