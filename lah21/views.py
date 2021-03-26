from django.shortcuts import render

# Views for the whole page

def home_view(request, *args, **kwargs):
	context = {}

	return render(request, "home.html", context)