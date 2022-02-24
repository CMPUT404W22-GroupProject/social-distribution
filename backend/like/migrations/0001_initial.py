# Generated by Django 4.0.2 on 2022-02-23 02:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('author', '0012_remove_author_profileimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.TextField(default='https://www.w3.org/ns/activitystreams')),
                ('summary', models.TextField(blank=True)),
                ('type', models.TextField(default='Like')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='author.author')),
            ],
        ),
    ]