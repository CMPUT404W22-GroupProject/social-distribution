from django.conf.urls import include
from django.urls import path

from . import views

urlpatterns = [
    path('', views.AuthorList.as_view()),
    path('<int:author_id>/', views.AuthorDetails.as_view()),
    path('<int:author_id>/posts/', include('post.urls'))
]