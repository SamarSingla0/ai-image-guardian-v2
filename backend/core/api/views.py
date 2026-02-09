from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import UploadedImage
from .serializers import UserSerializer, ImageSerializer
from .sightengine_utils import check_image_safety  # <--- IMPORT THE NEW UTILS

# 1. User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# 2. Image Upload Logic
class ImageUploadView(generics.CreateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # A. Save the image to the database/disk first
        instance = serializer.save(user=self.request.user)
        
        # B. Get the absolute path to the file on your computer
        image_path = instance.image.path
        
        # C. Call Sightengine AI
        is_safe, score, tags = check_image_safety(image_path)
        
        # D. Update the database with AI verdict
        instance.is_safe = is_safe
        instance.confidence_score = score
        instance.ai_tags = tags
        instance.save()

# 3. Gallery (List Images)
class UserGalleryView(generics.ListAPIView):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UploadedImage.objects.filter(user=self.request.user).order_by('-uploaded_at')

# 4. Dashboard Stats
from rest_framework.views import APIView
class UserStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_images = UploadedImage.objects.filter(user=request.user)
        return Response({
            "total_uploads": user_images.count(),
            "safe_images": user_images.filter(is_safe=True).count(),
            "flagged_images": user_images.filter(is_safe=False).count()
        })