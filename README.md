# CNN Feature Visualizer

An interactive 3D visualization tool that demonstrates how Convolutional Neural Networks (CNNs) process images through step-by-step pipeline visualization.

## � **What This Does**

Upload any image and watch how a CNN processes it through 6 interactive steps:

1. **📷 Input Image** - See your image as 3D pixel data
2. **🔍 Convolution** - Watch filters detect edges and patterns
3. **⚡ ReLU** - See how activation functions work
4. **📉 Pooling** - Understand size reduction and feature selection
5. **🎯 Features** - Watch feature clustering and extraction
6. **🏆 Prediction** - See the final decision-making process

## 🌟 Features

### **🧠 Interactive CNN Pipeline**

- **Step-by-Step Visualization**: Click through each CNN processing stage
- **3D Animations**: Beautiful animated demonstrations of each step
- **Real-time Feature Extraction**: Analyzes your uploaded images
- **Educational Explanations**: Learn what happens at each step

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Start the Backend Server**

   ```cmd
   cd backend
   start_server.bat
   ```

   This will automatically:

   - Create a Python virtual environment
   - Install required dependencies (Flask, CORS, PIL, numpy)
   - Start the Flask server on http://127.0.0.1:5000

2. **Open the Visualizer**

   - Navigate to the `frontend` folder
   - Open `learn.html` in your browser
   - Or serve with a local server for best results

3. **Start Visualizing**
   - Upload any image (JPG, PNG, GIF, BMP)
   - Click through the CNN pipeline steps
   - Watch the 3D animations and learn how CNNs work!

## 📁 Project Structure

```
cnn-visualizer/
├── backend/
│   ├── app.py              # Flask server with image processing & CNN simulation
│   ├── requirements.txt    # Python dependencies
│   ├── start_server.bat    # Windows startup script
│   ├── run.bat            # Alternative startup script
│   └── uploads/           # Temporary image storage
├── frontend/
│   ├── learn.html         # Main CNN visualizer interface
│   ├── tutorial.js        # 3D CNN pipeline animations
│   ├── tutorial.css       # Modern pastel styling
│   ├── style.css          # Base CSS styling
│   └── app.js             # Core JavaScript functionality
└── .venv/                 # Python virtual environment
```

## 🔧 Technical Details

### Backend (Python Flask)

- **Framework**: Flask with CORS support for cross-origin requests
- **Image Processing**: PIL (Pillow) for comprehensive image analysis
- **Features Extracted**:
  - RGB color channel analysis and histograms
  - Brightness, contrast, and saturation levels
  - Dominant color detection with clustering
  - Basic texture analysis and edge detection
  - 3D coordinate mapping for visualization

### Frontend (JavaScript + Three.js)

- **3D Graphics**: Three.js with WebGL for smooth 3D rendering
- **UI Framework**: Vanilla JavaScript with modern CSS
- **CNN Pipeline**: Step-by-step 3D animations of CNN processing
- **Design**: Pastel color scheme with glassmorphism effects
- **Layout**: Two-column responsive design for optimal learning

### CNN Pipeline Visualization

The 6-step CNN process is visualized as follows:

1. **Input**: 3D pixel grid representation of uploaded image
2. **Convolution**: Animated filter sliding over image with feature detection
3. **ReLU**: Activation function visualization with positive value highlighting
4. **Pooling**: Size reduction animation showing max/average pooling
5. **Features**: Clustering animation showing extracted features
6. **Prediction**: Final classification with confidence visualization

### Feature Mapping

Images are mapped to 3D space as:

- **X-axis**: Red channel intensity (0-10)
- **Y-axis**: Green channel intensity (0-10)
- **Z-axis**: Blue channel intensity (0-10)

## 🎮 Usage Guide

### Getting Started

1. **Upload an Image**

   - Supported formats: JPG, PNG, GIF, BMP
   - Maximum size: 10MB
   - Drag & drop or click to browse

2. **Explore CNN Pipeline**

   - Click the numbered step buttons (1-6) to navigate
   - Watch 3D animations of each CNN processing stage
   - Read explanations for each step

3. **View Analysis Results**
   - See extracted features in the right panel
   - Observe 3D visualization of your image's characteristics
   - Use mouse to rotate, zoom, and explore the 3D scene

### CNN Pipeline Steps

- **Step 1 - Input**: See your image as 3D pixel data
- **Step 2 - Convolution**: Watch filters detect patterns
- **Step 3 - ReLU**: Observe activation functions at work
- **Step 4 - Pooling**: Understand feature selection
- **Step 5 - Features**: See how features are extracted
- **Step 6 - Prediction**: Watch the decision process

## 🛠️ Customization

### Adding New CNN Steps

To add more CNN pipeline steps in `frontend/tutorial.js`:

```javascript
function showCNNStep(step) {
  // Add your new step visualization here
  // Steps 1-6 are currently implemented
}
```

### Modifying Visualizations

Customize the 3D animations:

- **Colors**: Edit step-specific colors in `tutorial.js`
- **Animations**: Modify transition durations and effects
- **UI**: Update styling in `tutorial.css` for pastel theme

### Backend Features

Add new image analysis features in `backend/app.py`:

```python
def extract_image_features(image_path):
    # Add your feature extraction code here
    return features
```

## 📋 Requirements

### Python Dependencies

- `flask>=2.3.0` - Web server framework
- `flask-cors>=4.0.0` - Cross-origin resource sharing
- `Pillow>=10.0.0` - Image processing library
- `numpy>=1.24.0` - Numerical computing

### Browser Requirements

- WebGL support (all modern browsers)
- ES6+ JavaScript support
- File API support for drag & drop uploads

### System Requirements

- Python 3.8 or higher
- 2GB RAM minimum (for image processing)
- Modern graphics card recommended for smooth 3D rendering

## 🎯 Future Enhancements

### Planned Features

- **More CNN Architectures**: Add ResNet, VGG, Inception visualizations
- **Real Neural Networks**: Integration with TensorFlow/PyTorch models
- **Advanced Filters**: Sobel, Canny edge detection visualizations
- **Batch Processing**: Upload and compare multiple images
- **Export Options**: Save visualizations as images or videos
- **Mobile Support**: Touch-friendly interface for tablets/phones

### Educational Improvements

- **More Pipeline Steps**: Add Dropout, Batch Normalization, Attention
- **Interactive Tutorials**: Guided step-by-step learning paths
- **Code Examples**: Show actual CNN code alongside visualizations
- **Datasets**: Pre-loaded example images for different categories
