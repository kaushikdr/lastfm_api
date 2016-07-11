import types

# from django.contrib.auth.decorators import login_required

from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.decorators import api_view
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
import pdb




def admin_only(func):
    def wrap(request, *args, **kwargs):
        if not request.user.is_superuser:
            return HttpResponseRedirect("/admin/login/?next={}".format(request.path_info))
            # return Response({'status': "error", "data": "You are not an admin user"})
        return func(request, *args, **kwargs)
    return wrap


def fm_login_required(func):

    @ensure_csrf_cookie
    @api_view(['GET', 'POST', 'DELETE', 'PUT', 'HEAD'])
    def wrap(request, *args, **kwargs):
        # pdb.set_trace()
        if not request.user.is_authenticated():
            return Response({'status': "error", "data": "unauthenticated"})
        if request.user.is_superuser:
            return Response({'status': "error", "data": "You are logged in as admin user."})
        return func(request, *args, **kwargs)
    return wrap

def get_session_id(request):
    if not request.session.session_key:
        request.session.cycle_key()
    return request.session.session_key


class UserAuthBackend(object):

    def authenticate(self, username=None, password=None):
        """ Authenticate a user based on email address as the user name. """
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        """ Get a User object from the user_id. """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None



class FmView(APIView):

    def send_response(self, status, data=None):
        if status == 1:
            return Response({'status': 'success', 'data': data})
        if status == 0:
            return Response({'status': 'error', 'detail': data or "Sorry, Please try later."})

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(FmView, self).dispatch(*args, **kwargs)


class FmAuthView(LoginRequiredMixin, FmView):
    pass


def fm_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.

    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    if response and response.status_code in [400, 401, 403, 404, 500, 405]:
        response.data['status'] = "error"
    return response