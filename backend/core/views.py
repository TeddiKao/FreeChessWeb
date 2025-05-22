from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def health_check_view(request):
    return HttpResponse("OK")