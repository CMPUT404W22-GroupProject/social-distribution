from django.conf.urls import include
from django.urls import path

from . import views as followerView

urlpatterns = [
    path('', followerView.FollowerList.as_view()),
    path('<uuid:foreign_author_id>/', followerView.FollowerDetails.as_view()),
]