from django.urls import path

from .views import GetIsCheckmatedView, GetIsStalematedView

urlpatterns = [
    path("get-is-checkmated/", GetIsCheckmatedView.as_view(), name="get_is_checkmated"),
    path("get-is-stalemated/", GetIsStalematedView.as_view(), name="get_is_stalemated")
]