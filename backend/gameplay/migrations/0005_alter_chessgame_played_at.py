# Generated by Django 5.2 on 2025-05-17 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gameplay', '0004_chessgame_played_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chessgame',
            name='played_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
