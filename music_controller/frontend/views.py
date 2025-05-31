import datetime
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

def asdf(request, *args, **kwargs):
    # now = datetime.datetime.now()
    # html = '<html lang="en"><body>It is now %s.</body></html>' % now
    # return HttpResponse(html)
    return render(request, 'frontend/asdf.html')