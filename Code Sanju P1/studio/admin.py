from django.contrib import admin

from .models import BlogCategory, BlogPost, BlogTag, Page


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "content", "seo_title")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        ("Page content", {"fields": ("title", "slug", "excerpt", "content", "hero_image", "is_published")} ),
        ("SEO", {"fields": ("seo_title", "meta_description", "focus_keyword", "canonical_url", "og_title", "og_description", "og_image")} ),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "is_published", "published_at", "updated_at")
    list_filter = ("is_published", "categories", "tags")
    search_fields = ("title", "slug", "excerpt", "content", "seo_title", "focus_keyword")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("categories", "tags", "related_posts")
    fieldsets = (
        ("Post content", {"fields": ("title", "slug", "excerpt", "content", "featured_image", "image_alt")} ),
        ("Publishing", {"fields": ("author", "is_published", "published_at")} ),
        ("Taxonomy and related content", {"fields": ("categories", "tags", "related_posts")} ),
        ("SEO", {"fields": ("seo_title", "meta_description", "focus_keyword", "canonical_url", "og_title", "og_description", "og_image")} ),
    )


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
