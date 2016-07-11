from django.conf.urls import patterns, url
from music import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    # url(r'^$', views.Provider.as_view()),
    url(r'^signup/?$', views.Signup.as_view()),
    url(r'^login/$', views.UserLogin.as_view()),
    url(r'^search/$', views.Search.as_view()),
    url(r'^similar/$', views.Similar.as_view()),
    url(r'^analytics/$', views.Analytics.as_view()),
    url(r'^admin_login/$', views.AdminLogin.as_view()),

    
]