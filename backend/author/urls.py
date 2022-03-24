from django.conf.urls import include
from django.urls import path

from . import views as authorView
from like import views as likeView


urlpatterns = [
    path('', authorView.AuthorList.as_view()),
    path('<uuid:author_id>/', authorView.AuthorDetails.as_view()),
    path('<uuid:author_id>/inbox/', include('inbox.urls')),
    path('<uuid:author_id>/liked/', include('like.urls')),
    path('<uuid:author_id>/posts/', include('post.urls')),
    path('<uuid:author_id>/followers/', include('follower.urls'))
]