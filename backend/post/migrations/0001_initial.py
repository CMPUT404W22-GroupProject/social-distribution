# Generated by Django 4.0.2 on 2022-02-26 20:21

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('author', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.TextField(default='post')),
                ('title', models.CharField(max_length=255)),
                ('source', models.URLField(blank=True)),
                ('origin', models.URLField(blank=True)),
                ('description', models.TextField()),
                ('contentType', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('categories', models.TextField()),
                ('count', models.PositiveBigIntegerField()),
                ('published', models.DateTimeField()),
                ('visibility', models.CharField(max_length=255)),
                ('unlisted', models.BooleanField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_author', to='author.author')),
            ],
        ),
    ]
