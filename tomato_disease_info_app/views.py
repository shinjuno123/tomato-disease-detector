from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.shortcuts import redirect,render
# Create your views here.

def disease_info(request):
    return render(request, 'disease_info.html')

def info_page(request):
    return render(request, 'info.html')

def info_page2(request):
    return render(request, 'info2.html')


def info_page3(request):
    return render(request, 'info3.html')
    

def info_page4(request):
    return render(request, 'info4.html')

def info_page5(request):
    return render(request, 'info5.html')

def info_page6(request):
    return render(request, 'info6.html')

def info_page7(request):
    return render(request, 'info7.html')

def info_page8(request):
    return render(request, 'info8.html')
    
    