import requests
import json
import os

# --- CONFIGURATION ---
# REPLACE THESE WITH YOUR ACTUAL KEYS FROM SIGHTENGINE DASHBOARD
API_USER = '1762404235'
API_SECRET = 'ZoTfdFAy7rJSLSukCqXfohrmejWpjsig'

def check_image_safety(image_path):
    """
    Sends image to Sightengine API.
    Checks for: Nudity, Weapons, Alcohol, Drugs, Gore.
    Returns: (is_safe: bool, confidence_score: float, tags: str)
    """
    
    # 1. API Endpoint
    url = 'https://api.sightengine.com/1.0/check.json'
    
    # 2. Define what models we want to use
    # 'nudity' checks for adult content
    # 'wad' checks for Weapons, Alcohol, Drugs
    # 'offensive' checks for offensive symbols/gestures
    # 'gore' checks for blood/medical gore
    params = {
        'models': 'nudity,wad,offensive,gore',
        'api_user': API_USER,
        'api_secret': API_SECRET
    }

    # 3. Prepare the file
    files = {'media': open(image_path, 'rb')}

    try:
        # 4. Send Request
        print(f"Sending {image_path} to Sightengine...")
        response = requests.post(url, files=files, data=params)
        output = json.loads(response.text)
        
        # Check if API request was successful
        if output['status'] != 'success':
            print("Sightengine API Error:", output)
            return True, 0.0, "API Error"

        # 5. Analyze Results (The Logic)
        is_safe = True
        unsafe_reasons = []
        max_unsafe_score = 0.0

        # --- Check Nudity ---
        # output['nudity']['safe'] is a number 0 to 1. 
        # If safe < 0.15, it is very likely nude.
        if output['nudity']['safe'] < 0.50:
            is_safe = False
            score = 1.0 - output['nudity']['safe'] # Convert safe score to unsafe score
            unsafe_reasons.append(f"Nudity ({int(score*100)}%)")
            max_unsafe_score = max(max_unsafe_score, score)

        # --- Check Weapons ---
        if output['weapon'] > 0.50:
            is_safe = False
            unsafe_reasons.append("Weapon")
            max_unsafe_score = max(max_unsafe_score, output['weapon'])

        # --- Check Drugs ---
        if output['drugs'] > 0.50:
            is_safe = False
            unsafe_reasons.append("Drugs")
            max_unsafe_score = max(max_unsafe_score, output['drugs'])

        # --- Check Gore ---
        if output['gore']['prob'] > 0.50:
            is_safe = False
            unsafe_reasons.append("Gore")
            max_unsafe_score = max(max_unsafe_score, output['gore']['prob'])

        # --- Check Offensive ---
        if output['offensive']['prob'] > 0.50:
            is_safe = False
            unsafe_reasons.append("Offensive")
            max_unsafe_score = max(max_unsafe_score, output['offensive']['prob'])

        # Format tags string
        tags_string = ", ".join(unsafe_reasons) if unsafe_reasons else "Clean"
        
        print(f"Analysis Result: Safe={is_safe}, Tags={tags_string}")

        return is_safe, max_unsafe_score, tags_string

    except Exception as e:
        print(f"Error calling Sightengine: {e}")
        # Default to safe if error, to prevent breaking the app
        return True, 0.0, "System Error"