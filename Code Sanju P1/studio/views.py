from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.template.loader import render_to_string
from django.utils import timezone
from django.views.decorators.http import require_GET

from .forms import ContactForm
from .models import BlogPost, Page


GALLERY_ITEMS = [
    ("img/wedding-1.jpg", "Wedding stories", "wedding"),
    ("img/prewedding-1.jpg", "Pre-wedding moments", "prewedding"),
    ("img/baby-maternity.jpg", "Baby and maternity", "baby"),
    ("img/portrait-1.jpg", "Portraits", "portrait"),
    ("img/reception-1.jpg", "Reception details", "wedding"),
    ("img/product-1.jpg", "Product photography", "product"),
]

WHATSAPP_NUMBER = "919911256384"


def site_context(**extra):
    return {"whatsapp_number": WHATSAPP_NUMBER, **extra}


def home(request):
    return render(request, "studio/home.html", site_context(featured_images=GALLERY_ITEMS[:4]))


def about(request):
    return render(request, "studio/about.html", site_context())


def services(request):
    services = [
        ("Wedding photography", "img/wedding-1.jpg", "Natural, cinematic coverage for the moments you will keep returning to."),
        ("Pre-wedding shoots", "img/prewedding-1.jpg", "A relaxed outdoor session built around your chemistry and favourite places."),
        ("Portraits and passports", "img/portrait-1.jpg", "Polished portraits and quick, professional passport photos in the studio."),
        ("Baby and maternity", "img/baby-maternity.jpg", "Gentle, expressive portraits for new chapters and growing families."),
        ("Product photography", "img/product-1.jpg", "Clean, considered images that help your products earn attention online."),
        ("Events and receptions", "img/reception-1.jpg", "Energetic event coverage that catches the atmosphere as it unfolds."),
    ]
    return render(request, "studio/services.html", site_context(services=services))


def gallery(request):
    return render(request, "studio/gallery.html", site_context(gallery_items=GALLERY_ITEMS))


def contact(request):
    form = ContactForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        messages.success(request, "Thanks. We will call you shortly to confirm your session.")
        return redirect("studio:contact")
    return render(request, "studio/contact.html", site_context(form=form))


def blog_list(request):
    posts = BlogPost.objects.filter(is_published=True, published_at__lte=timezone.now()).select_related("author").prefetch_related("categories")
    return render(request, "studio/blog_list.html", site_context(posts=posts))


def blog_detail(request, slug):
    post = get_object_or_404(
        BlogPost.objects.filter(is_published=True, published_at__lte=timezone.now())
        .select_related("author")
        .prefetch_related("categories", "tags", "related_posts"),
        slug=slug,
    )
    return render(request, "studio/blog_detail.html", site_context(post=post))


def page_detail(request, slug):
    page = get_object_or_404(Page, slug=slug, is_published=True)
    return render(request, "studio/page_detail.html", site_context(page=page))


@require_GET
def robots_txt(request):
    content = "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://www.sanjudigitalstudio.com/sitemap.xml\n"
    return HttpResponse(content, content_type="text/plain")


@require_GET
def sitemap_xml(request):
    pages = Page.objects.filter(is_published=True)
    posts = BlogPost.objects.filter(is_published=True, published_at__lte=timezone.now())
    xml = render_to_string("studio/sitemap.xml", {"pages": pages, "posts": posts, "request": request})
    return HttpResponse(xml, content_type="application/xml")
