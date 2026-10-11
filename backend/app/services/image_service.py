import os

ALLOWED_PRODUCT_IMAGES = [
    "prod_1.png", "prod_2.png", "prod_3.png", "prod_4.png", "prod_5.png", "prod_6.png",
    "prod_7.png", "prod_8.png", "prod_9.png", "prod_10.png", "prod_11.png", "prod_12.png",
    "prod_13.png", "prod_14.png", "prod.png"
]

ALLOWED_MEDIA_IMAGES = [
    "summer_vacation_001.jpg", "office_party_2023.jpg", "product_launch.jpg",
    "hiking_adventure.jpg", "design_mockup_v2.jpg", "city_skyline.jpg",
    "abstract_background.jpg", "coffee_break.jpg"
]

IMG_CACHE: dict[str, tuple[bytes, str]] = {}


def generate_placeholder_svg(title: str) -> bytes:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="100%" height="100%" fill="#f1f5f9"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#64748b">{title}</text>
</svg>"""
    return svg.encode("utf-8")


def _init_img_cache():
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    img_dir = os.path.join(backend_dir, "img")
    for name in ALLOWED_PRODUCT_IMAGES + ALLOWED_MEDIA_IMAGES:
        path = os.path.join(img_dir, name)
        if os.path.isfile(path):
            try:
                with open(path, "rb") as f:
                    content = f.read()
                    mime = "image/png" if name.endswith(".png") else "image/jpeg"
                    IMG_CACHE[name] = (content, mime)
            except Exception:
                pass


_init_img_cache()


def get_product_image(filename: str) -> tuple[bytes, str] | None:
    clean_name = filename.removeprefix("images/").lstrip("/")
    if clean_name in ALLOWED_PRODUCT_IMAGES:
        if clean_name in IMG_CACHE:
            return IMG_CACHE[clean_name]
        return generate_placeholder_svg(clean_name), "image/svg+xml"
    return None


def get_media_image(filename: str) -> tuple[bytes, str] | None:
    clean_name = filename.lstrip("/")
    if clean_name in ALLOWED_MEDIA_IMAGES:
        if clean_name in IMG_CACHE:
            return IMG_CACHE[clean_name]
        return generate_placeholder_svg(clean_name), "image/svg+xml"
    return None
