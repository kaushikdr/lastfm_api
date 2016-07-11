from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from music.fmauth import (FmView, FmAuthView, get_session_id,
                          fm_login_required, admin_only)
from django.contrib.auth.models import User
from music.music_serializer import UserSerializer, UserHistorySerializer
from django.conf import settings
from music.tasks import save_search_history
from music.models import UserHistory
from collections import Counter, OrderedDict
import requests

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse

import pdb

# Create your views here.
class IndexView(TemplateView):
    # pdb.set_trace()
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)

class Signup(FmView):

    def auth_login(self, data):
        # print data
        user = authenticate(**data)
        if user is not None:
            login(self.request, user)
            return True
            # Redirect to a success page.

        else:
            return False

    def post(self, request, format=None):
        # pdb.set_trace()
        if request.user.is_authenticated():
            if not hasattr(request.user, 'User'):
                logout(request)
                pass
            else:
                return self.send_response(1, {
                    'username': request.user.username,
                    'session_id': get_session_id(request)
                })
        data = request.data.copy()
        srlzr = UserSerializer(data=data)
        if not srlzr.is_valid():
            print srlzr.errors
            return self.send_response(0, srlzr.errors)
        user = User()
        user.username = data['username']
        user.set_password(data['password'])
        user.save()
        if self.auth_login({'username': data['username'], 'password': data['password']}):
            return self.send_response(1, {'session_id': get_session_id(request), 'username':data['username']})
        # return self.send_response(0, "User not logged in.")


class UserLogin(FmView):

    def auth_login(self, data):
        user = authenticate(**data)
        print user
        if user is not None:
            login(self.request, user)
            return True
        else:
            return False

    def post(self, request, format=None):
        # pdb.set_trace()
        if request.user.is_authenticated():
            if not hasattr(request.user, 'User'):
                logout(request)
                pass
            else:
                return self.send_response(1, {
                    'username': request.user.username,
                    'session_id': get_session_id(request)
                })

        data = request.data.copy()
        if self.auth_login({'username': data['username'], 'password': data['password']}):
            return self.send_response(1, {'session_id': get_session_id(request), 'username':data['username']})
        # return self.send_response(0, "User does not exist.")

class AdminLogin(FmView):

    def auth_login(self, data):
        user = authenticate(**data)
        print user
        if user is not None and user.is_superuser:
            login(self.request, user)
            return True
        else:
            return False

    def post(self, request, format=None):
        # pdb.set_trace()
        if request.user.is_authenticated():
            if not hasattr(request.user, 'User'):
                logout(request)
                pass
            else:
                return self.send_response(1, {
                    'username': request.user.username,
                    'session_id': get_session_id(request)
                })

        data = request.data.copy()
        if self.auth_login({'username': data['username'], 'password': data['password']}):
            return self.send_response(1, {'session_id': get_session_id(request), 'username':data['username']})


class Search(FmAuthView):
    def get(self, request, format=None):
        # pdb.set_trace()
        history = UserHistory.objects.filter(user=request.user).order_by('-id')
        srlzr = UserHistorySerializer(history, many=True)
        return self.send_response(1, srlzr.data)

    def post(self, request, format=None):
        # pdb.set_trace()
        data = request.data.copy()
        headers = {'User-Agent':'musicfm/1.0'}
        info_url = settings.LASTFM_BASE_URL + '?method=artist.getinfo&artist=' + \
            data['artist']+'&api_key='+settings.LASTFM_API_KEY+'&format=json'
        tracks_url = settings.LASTFM_BASE_URL + '?method=artist.gettoptracks&artist=' + \
            data['artist']+'&api_key='+settings.LASTFM_API_KEY+'&format=json'
        albums_url = settings.LASTFM_BASE_URL + '?method=artist.gettopalbums&artist=' + \
            data['artist']+'&api_key='+settings.LASTFM_API_KEY+'&format=json'
        # url = settings.LASTFM_BASE_URL + '?method=track.getInfo&api_key='+settings.LASTFM_API_KEY+'&artist='+data['artist']+'&mbid='+data['track_mbid']+'&format=json'

        info_resp = requests.get(info_url, headers=headers)
        if not 'error' in info_resp.json():
            tracks_resp = requests.get(tracks_url, headers=headers)
            albums_resp = requests.get(albums_url, headers=headers)
            if settings.CELERY_USE:
                save_search_history.delay(request.user.id, data['artist'])
            else:
                save_search_history(request.user.id, data['artist'])
            return self.send_response(1, {'artist_info':info_resp.json(), 'tracks':tracks_resp.json(), 'albums':albums_resp.json()})

class Similar(FmAuthView):
    def get(self, request, format=None):
        data = request.GET.copy()
        headers = {'User-Agent':'musicfm/1.0'}
        url = settings.LASTFM_BASE_URL + '?method=artist.getsimilar&artist=' + \
            data['artist']+'&api_key='+settings.LASTFM_API_KEY+'&format=json'
        resp = requests.get(url, headers=headers)
        return self.send_response(1, resp.json())

class Analytics(FmView):
    @method_decorator(admin_only)
    def get(self, request, format=None):
        # pdb.set_trace()
        artists = UserHistory.objects.all().values_list('artist', flat=True)
        count_dict = Counter(artists)
        common = count_dict.most_common(10)
        return self.send_response(1, OrderedDict(common))

