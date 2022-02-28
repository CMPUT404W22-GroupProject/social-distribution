from django.conf.urls import include
from django.urls import path

from . import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<uuid:post_id>/', views.PostDetails.as_view()),
    path('<uuid:post_id>/comments/', include('comment.urls'))
]