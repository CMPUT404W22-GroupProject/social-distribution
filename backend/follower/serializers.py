import re
from author.models import Author
from follower.models import Follower
from rest_framework.serializers import ModelSerializer, SerializerMethodField, PrimaryKeyRelatedField, CurrentUserDefault
from django.http import HttpRequest
import os
import json

from author.serializers import AuthorsSerializer

class FollowerSerializer(ModelSerializer):
    items = AuthorsSerializer(many=True)
    # items = PrimaryKeyRelatedField(read_only=True, default=CurrentUserDefault())
    # items = PrimaryKeyRelatedField(queryset=Author.objects.all())

    class Meta:
        model = Follower
        fields = ("type", "items")
    
    # def get_items(self):


    # def create(self, validated_data):
    #     # follower_data = validated_data.pop("items")
    #     follower = validated_data['items']
    #     print(validated_data)
    #     new_follower = Follower.objects.create()
    #     new_follower.items.set(follower)
    #     # # print("here")
    #     # # items = validated_data.pop('items')
    #     # new_follower = Follower.objects.create(**validated_data)
    #     # # new_follower.items.set(items)
    #     return new_follower

    # def update(self, instance, validated_data):
    #     print("ok")
    #     foreign_author_id = self.context.get('foreign_author_id')
    #     author = Author.objects.get(pk=foreign_author_id)
    #     instance.items.set(author)
    #     print("instance",instance)
    #     return instance


