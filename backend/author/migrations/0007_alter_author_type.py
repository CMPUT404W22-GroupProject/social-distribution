# Generated by Django 4.0.2 on 2022-02-19 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('author', '0006_alter_author_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='type',
            field=models.CharField(default='author', max_length=6),
        ),
    ]