from django.db import models

# Create your models here.
class Queue(models.Model):
	players = models.JSONField(default=list)
	time_created = models.DateTimeField(auto_now_add=True)
