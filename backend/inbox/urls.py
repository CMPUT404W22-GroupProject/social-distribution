from django.conf.urls import include
from django.urls import path

from inbox import views as inboxView


urlpatterns = [
    path('', inboxView.InboxList.as_view()),
]