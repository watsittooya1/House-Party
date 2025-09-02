"""
URL configuration for music_controller project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .gsc_verif import gsc_verif_index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('spotify/', include('spotify.urls')),
    path('google8725c32bef7fb570.html', gsc_verif_index),
    # note: because we use wildcard urls in frontend, this entry MUST be last
    path('', include('frontend.urls')),
]
