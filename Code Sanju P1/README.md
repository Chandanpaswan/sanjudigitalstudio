# Sanju Digital Studio

Django version of the Sanju Digital Studio photography website.

## Run locally

```powershell
python -m pip install -r requirements.txt
python manage.py runserver
```

Open `http://127.0.0.1:8000/`.

The Django version uses `templates/`, `studio/`, `config/`, and `static/`. The retired standalone HTML pages and duplicate static SEO files were removed after migration.

## Admin and production settings

Create an admin account with `python manage.py createsuperuser`, then visit `/admin/` to manage pages, blog posts, categories, tags, featured images, related posts, publishing, and SEO fields.

For deployment, set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, and `DJANGO_ALLOWED_HOSTS` before running `python manage.py collectstatic`.

## Vercel deployment

The project is configured for Vercel with `api/index.py` and `vercel.json`. The production site is available at `https://sanjudigitalstudio.com/`.

The current SQLite database is suitable for local development only; Vercel's serverless filesystem is not persistent. Use a hosted PostgreSQL database before relying on production admin or content changes.
