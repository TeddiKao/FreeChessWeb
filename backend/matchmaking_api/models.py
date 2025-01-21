from django.db import models

# Create your models here.
class Queue(models.Model):
	players = models.JSONField(default=list)
