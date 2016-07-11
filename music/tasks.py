from celery import task
from django.conf import settings
from music.models import UserHistory
from django.contrib.auth.models import User
import pdb


@task
def save_search_history(user_id,artist):
    # #pdb.set_trace()
    user = User.objects.get(id=user_id)
    history = UserHistory.objects.get_or_create(user=user, artist=artist)