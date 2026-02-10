import requests
import json
import os

# --- CONFIGURATION ---
# Prefer environment variables for secrets; fall back to placeholders.
API_USER = os.getenv('SIGHTENGINE_API_USER', 'YOUR_SIGHTENGINE_USER_ID')
API_SECRET = os.getenv('SIGHTENGINE_API_SECRET', 'YOUR_SIGHTENGINE_API_SECRET')

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
        'api_secret': API_SECRET,
    }

    # 3. Prepare the file
    files = {'media': open(image_path, 'rb')}

    try:
        # 4. Send Request
        print(f"Sending {image_path} to Sightengine...")
        response = requests.post(url, files=files, data=params)
        output = json.loads(response.text)
        
        # Check if API request was successful
        if output.get('status') != 'success':
            print("Sightengine API Error:", output)
            # Treat failures as unsafe so they don't appear as safe by mistake
            return False, 0.0, "API Error"

        # 5. Analyze Results (The Logic)
        is_safe = True
        unsafe_reasons = []
        max_unsafe_score = 0.0

        # --- Check Nudity ---
        # Sightengine's nudity model exposes several probabilities such as:
        #   nudity.raw (explicit), nudity.partial (lingerie, swimsuits), nudity.safe.
        nudity = output.get('nudity', {}) or {}
        raw_score = nudity.get('raw', 0.0)
        partial_score = nudity.get('partial', 0.0)
        safe_score = nudity.get('safe', 1.0)

        # Mark as unsafe when explicit or strong partial nudity is present,
        # or when the "safe" score is very low.
        if raw_score > 0.20:
            is_safe = False
            unsafe_reasons.append(f"Nudity (explicit {int(raw_score * 100)}%)")
            max_unsafe_score = max(max_unsafe_score, raw_score)
        elif partial_score > 0.35:
            is_safe = False
            unsafe_reasons.append(f"Nudity (partial {int(partial_score * 100)}%)")
            max_unsafe_score = max(max_unsafe_score, partial_score)
        elif safe_score < 0.40:
            is_safe = False
            score = 1.0 - safe_score
            unsafe_reasons.append(f"Nudity ({int(score * 100)}%)")
            max_unsafe_score = max(max_unsafe_score, score)

        # --- Check Weapons ---
        if output.get('weapon', 0.0) > 0.50:
            is_safe = False
            unsafe_reasons.append("Weapon")
            max_unsafe_score = max(max_unsafe_score, output['weapon'])

        # --- Check Drugs ---
        if output.get('drugs', 0.0) > 0.50:
            is_safe = False
            unsafe_reasons.append("Drugs")
            max_unsafe_score = max(max_unsafe_score, output['drugs'])

        # --- Check Gore ---
        if output.get('gore', {}).get('prob', 0.0) > 0.40:
            is_safe = False
            unsafe_reasons.append("Gore")
            max_unsafe_score = max(max_unsafe_score, output['gore']['prob'])

        # --- Check Offensive ---
        if output.get('offensive', {}).get('prob', 0.0) > 0.50:
            is_safe = False
            unsafe_reasons.append("Offensive")
            max_unsafe_score = max(max_unsafe_score, output['offensive']['prob'])

        # Format tags string
        tags_string = ", ".join(unsafe_reasons) if unsafe_reasons else "Clean"
        
        print(f"Analysis Result: Safe={is_safe}, Tags={tags_string}")

        return is_safe, max_unsafe_score, tags_string

    except Exception as e:
        print(f"Error calling Sightengine: {e}")
        # On unexpected errors, mark as unsafe rather than safe.
        return False, 0.0, "System Error"