from django.urls import path
from .views import RegisterView, ImageUploadView, UserGalleryView, UserStatsView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    
    # App Features
    path('upload/', ImageUploadView.as_view(), name='image_upload'),
    path('gallery/', UserGalleryView.as_view(), name='user_gallery'),
    path('stats/', UserStatsView.as_view(), name='user_stats'),
]