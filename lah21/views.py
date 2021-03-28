from django.shortcuts import render, redirect

# Views for the whole page

def home_view(request, *args, **kwargs):
	if request.POST.get("topic"):
		request.session["topic"] = request.POST.get("topic")
		return redirect("bert/")

	context = {}
	return render(request, "index.html", context)