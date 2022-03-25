# Generated by Django 4.0.2 on 2022-03-25 09:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(default='post', editable=False, max_length=4)),
                ('title', models.CharField(max_length=255)),
                ('source', models.URLField(blank=True)),
                ('origin', models.URLField(blank=True)),
                ('description', models.TextField()),
                ('contentType', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('categories', models.TextField()),
                ('published', models.DateTimeField(default=django.utils.timezone.now)),
                ('visibility', models.CharField(max_length=255)),
                ('unlisted', models.BooleanField()),
                ('image', models.TextField(blank=True)),
                ('id', models.URLField(blank=True, null=True)),
                ('comments', models.URLField(blank=True, null=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_author', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
