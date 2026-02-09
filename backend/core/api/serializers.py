from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UploadedImage

# 1. User Serializer (For Registration)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # We must hash the password properly
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

# 2. Image Serializer (For Upload and Display)
class ImageSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UploadedImage
        fields = ('id', 'username', 'image', 'uploaded_at', 'is_safe', 'confidence_score', 'ai_tags')
        read_only_fields = ('is_safe', 'confidence_score', 'ai_tags', 'uploaded_at')