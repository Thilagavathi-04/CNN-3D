from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# Create uploads directory
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_image_features(image_path):
    """
    Extract meaningful features from an image and convert to 3D coordinates
    """
    try:
        # Open and process image
        image = Image.open(image_path).convert('RGB')
        image = image.resize((224, 224))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Extract color statistics
        mean_r = np.mean(img_array[:,:,0]) / 255.0
        mean_g = np.mean(img_array[:,:,1]) / 255.0  
        mean_b = np.mean(img_array[:,:,2]) / 255.0
        
        # Extract texture features (standard deviation)
        std_r = np.std(img_array[:,:,0]) / 255.0
        std_g = np.std(img_array[:,:,1]) / 255.0
        std_b = np.std(img_array[:,:,2]) / 255.0
        
        # Calculate brightness and contrast
        brightness = (mean_r + mean_g + mean_b) / 3
        contrast = (std_r + std_g + std_b) / 3
        
        # Calculate color dominance
        dominant_color = np.argmax([mean_r, mean_g, mean_b])
        
        # Create 3D coordinates based on features
        x = (mean_r - 0.5) * 8  # Red dominance
        y = (mean_g - 0.5) * 8  # Green dominance  
        z = (mean_b - 0.5) * 8  # Blue dominance
        
        # Add some variation based on texture
        x += (std_r - 0.5) * 2
        y += (std_g - 0.5) * 2
        z += (std_b - 0.5) * 2
        
        return {
            'coordinates': [float(x), float(y), float(z)],
            'features': {
                'mean_colors': {'r': float(mean_r), 'g': float(mean_g), 'b': float(mean_b)},
                'texture': {'r': float(std_r), 'g': float(std_g), 'b': float(std_b)},
                'brightness': float(brightness),
                'contrast': float(contrast),
                'dominant_color': ['Red', 'Green', 'Blue'][dominant_color]
            },
            'educational_info': {
                'explanation': f"This image has {float(mean_r)*100:.1f}% red, {float(mean_g)*100:.1f}% green, and {float(mean_b)*100:.1f}% blue content.",
                'position_meaning': f"Position ({float(x):.1f}, {float(y):.1f}, {float(z):.1f}) represents color intensity in 3D space.",
                'cnn_connection': "Real CNNs extract thousands of features like edges, textures, and shapes - not just colors!"
            },
            'color_theme': {
                'primary': '#9DB5B2',      # Seafoam - main UI elements
                'secondary': '#B9D0C4',    # Mint - secondary buttons  
                'accent1': '#D4E5D8',      # Pale mint - highlights
                'accent2': '#F4C2C2',      # Blush - warm accents
                'accent3': '#E8C5A0',      # Nude - neutral tones
                'accent4': '#F7F3E9',      # Cream - backgrounds
                'background': 'linear-gradient(135deg, #F7F3E9 0%, #D4E5D8 50%, #B9D0C4 100%)',
                'text': '#2d3436',         # Dark charcoal for readability
                'text_light': '#636e72'    # Lighter text for secondary content
            }
        }
        
    except Exception as e:
        print(f"Error in feature extraction: {e}")
        # Return random coordinates if error occurs
        return {
            'coordinates': [np.random.uniform(-5, 5), np.random.uniform(-5, 5), np.random.uniform(-5, 5)],
            'features': {'error': 'Could not extract features'},
            'color_theme': {
                'primary': '#9DB5B2',      # Seafoam - main UI elements
                'secondary': '#B9D0C4',    # Mint - secondary buttons  
                'accent1': '#D4E5D8',      # Pale mint - highlights
                'accent2': '#F4C2C2',      # Blush - warm accents
                'accent3': '#E8C5A0',      # Nude - neutral tones
                'accent4': '#F7F3E9',      # Cream - backgrounds
                'background': 'linear-gradient(135deg, #F7F3E9 0%, #D4E5D8 50%, #B9D0C4 100%)',
                'text': '#2d3436',         # Dark charcoal for readability
                'text_light': '#636e72'    # Lighter text for secondary content
            }
        }

@app.route('/')
def home():
    return "CNN Feature Visualizer Backend - Server is running!"

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "message": "Backend is working!"})

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        print("=== Upload request received ===")
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
        file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_extension not in allowed_extensions:
            return jsonify({"error": "Invalid file type. Please upload an image."}), 400
            
        # Save the file
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        print(f"File saved: {filepath}")
        
        # Extract features
        result = extract_image_features(filepath)
        print(f"Features extracted: {result['coordinates']}")
        
        # Clean up - delete the uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        return jsonify({
            "success": True,
            "original_data": [result['coordinates']],  # Format expected by frontend
            "coordinates": result['coordinates'],
            "features": result['features'],
            "educational_info": result.get('educational_info', {}),
            "color_theme": result.get('color_theme', {}),
            "message": f"Successfully processed {file.filename}",
            "filename": file.filename
        })
        
    except Exception as e:
        print(f"Error processing upload: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("🧠 CNN Feature Visualizer Backend")
    print("=" * 40)
    print("Starting server...")
    print("Available at: http://127.0.0.1:5000")
    print("Health check: http://127.0.0.1:5000/health")
    print("=" * 40)
    app.run(host='127.0.0.1', port=5000, debug=True)
