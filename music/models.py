from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserHistory(models.Model):
	user = models.ForeignKey(User, related_name='history')
	artist = models.CharField(max_length=80)

	def __unicode__(self):
		return unicode(self.artist)