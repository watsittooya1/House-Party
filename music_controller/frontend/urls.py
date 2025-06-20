from django.urls import path, re_path
from .views import index

app_name = 'frontend'

urlpatterns = [
    # react router handles all applicable urls
    # thanks https://www.reddit.com/r/django/comments/si5rfd/comment/hv9xu64/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    re_path(r"^(?:.*)?$", index)
]
