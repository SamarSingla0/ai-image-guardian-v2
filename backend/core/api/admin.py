from django.contrib import admin
from .models import UploadedImage


@admin.register(UploadedImage)
class UploadedImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'uploaded_at', 'is_safe', 'confidence_score')
    list_filter = ('is_safe', 'uploaded_at', 'user')
    search_fields = ('user__username', 'ai_tags')
