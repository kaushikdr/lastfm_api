from rest_framework import serializers
from music.models import UserHistory
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'password')

class UserHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = UserHistory
		field = '__all__'