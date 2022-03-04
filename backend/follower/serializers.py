import re
from author.models import Author
from follower.models import Follower
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.http import HttpRequest
import os
import json

from author.serializers import AuthorsSerializer

class FollowerSerializer(ModelSerializer):
    items = AuthorsSerializer(many=True)

    class Meta:
        model = Follower
        fields = ("type", "items")

    def create(self, validated_data):
        new_follower = Follower.objects.create(**validated_data)
        return new_follower

    def update(self, instance, validated_data):
        foreign_author_id = self.context.get('foreign_author_id')
        author = Author.objects.get(pk=foreign_author_id)
        instance.items.add(author)
        instance.save()
        return instance


