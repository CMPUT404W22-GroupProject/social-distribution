from django.conf.urls import include
from django.urls import path

from inbox import views as inboxView
from inbox.views import FollowRequestDetails


urlpatterns = [
    path('', inboxView.InboxList.as_view()),
    path('follow-request/<int:follow_request_id>', FollowRequestDetails.as_view())
]