from django.shortcuts import render, redirect

# Views for the whole page

def home_view(request, *args, **kwargs):
	if request.POST.get("topic"):
		request.session["topic"] = request.POST.get("topic")
		request.session["number_papers"] = int(request.POST.get("number_papers"))
		return redirect("bert/")

	context = {}
	return render(request, "index.html", context)