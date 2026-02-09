from django.db import models
from django.contrib.auth.models import User

class UploadedImage(models.Model):
    # Link image to the user who uploaded it
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # The actual image file
    image = models.ImageField(upload_to='uploads/')
    
    # Metadata
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # AI Analysis Results
    is_safe = models.BooleanField(default=True) # True = Green, False = Red
    confidence_score = models.FloatField(default=0.0) # How sure is the AI?
    ai_tags = models.TextField(blank=True, null=True) # Tags like "gore", "explicit"

    def __str__(self):
        return f"Image {self.id} by {self.user.username} - Safe: {self.is_safe}"