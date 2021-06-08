from django.shortcuts import render
from django.shortcuts import redirect,render

# Create your views here.
def tomato_site_info(request):
    
    return render(request,"site_info.html")

