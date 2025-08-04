// CNN Feature Visualizer - Frontend Application
class CNNVisualizer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.featurePoint = null;
        this.isBackendConnected = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkBackendConnection();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        const imageInput = document.getElementById('imageInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const uploadArea = document.getElementById('uploadArea');

        imageInput.addEventListener('change', (e) => this.handleFileSelect(e));
        uploadBtn.addEventListener('click', () => this.handleUpload());
        
        // Upload area click
        uploadArea.addEventListener('click', () => imageInput.click());
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'), false);
        });

        uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            document.getElementById('imageInput').files = files;
            this.handleFileSelect({ target: { files: files } });
        }
    }

    async checkBackendConnection() {
        const status = document.getElementById('status');
        
        try {
            const response = await fetch('http://127.0.0.1:5000/health');
            if (response.ok) {
                this.isBackendConnected = true;
                this.setStatus('Backend connected! Ready to analyze images.', 'success');
            } else {
                throw new Error('Backend not responding');
            }
        } catch (error) {
            this.isBackendConnected = false;
            this.setStatus('⚠️ Backend not running. Please start the server first.', 'error');
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        const uploadBtn = document.getElementById('uploadBtn');
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
            if (!validTypes.includes(file.type)) {
                this.setStatus('❌ Please select a valid image file (JPG, PNG, GIF, BMP)', 'error');
                return;
            }

            // Show image preview
            this.showImagePreview(file);
            
            // Enable upload button
            uploadBtn.disabled = false;
            this.setStatus(`📷 Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            
            // Update upload text
            const uploadText = document.querySelector('.upload-text p');
            uploadText.textContent = `Selected: ${file.name}`;
        }
    }

    showImagePreview(file) {
        const imagePreview = document.getElementById('imagePreview');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        
        reader.readAsDataURL(file);
    }

    async handleUpload() {
        if (!this.isBackendConnected) {
            this.setStatus('❌ Backend not connected. Please start the server.', 'error');
            return;
        }

        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        
        if (!file) {
            this.setStatus('❌ Please select an image first.', 'error');
            return;
        }

        const uploadBtn = document.getElementById('uploadBtn');
        uploadBtn.disabled = true;
        this.setStatus('🔄 Analyzing image features...', 'loading');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload-image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.setStatus('✅ Image analyzed successfully!', 'success');
                this.displayResults(data);
                this.visualizeFeatures(data.coordinates);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.setStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            uploadBtn.disabled = false;
        }
    }

    displayResults(data) {
        const featureInfo = document.getElementById('featureInfo');
        const features = data.features;
        
        if (!features || features.error) {
            featureInfo.innerHTML = '<p class="placeholder">Could not extract detailed features</p>';
            return;
        }

        const [x, y, z] = data.coordinates;
        
        featureInfo.innerHTML = `
            <div class="feature-item">
                <span class="feature-label">🎯 3D Position</span>
                <span class="feature-value">(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">🔴 Red Channel</span>
                <span class="feature-value">${(features.mean_colors.r * 100).toFixed(1)}%</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">🟢 Green Channel</span>
                <span class="feature-value">${(features.mean_colors.g * 100).toFixed(1)}%</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">🔵 Blue Channel</span>
                <span class="feature-value">${(features.mean_colors.b * 100).toFixed(1)}%</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">☀️ Brightness</span>
                <span class="feature-value">${(features.brightness * 100).toFixed(1)}%</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">🌈 Contrast</span>
                <span class="feature-value">${(features.contrast * 100).toFixed(1)}%</span>
            </div>
            
            <div class="feature-item">
                <span class="feature-label">🎨 Dominant Color</span>
                <span class="feature-value">${features.dominant_color}</span>
            </div>
        `;
    }

    visualizeFeatures(coordinates) {
        const container = document.getElementById('visualization');
        
        // Clear any existing visualization
        container.innerHTML = '';
        
        // Initialize Three.js scene
        this.initThreeJS(container);
        
        // Add the feature point
        this.addFeaturePoint(coordinates);
        
        // Start animation loop
        this.animate();
    }

    initThreeJS(container) {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        // Camera
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(15, 15, 15);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Grid and axes
        this.createEnvironment();

        // Add click interaction for educational demos
        this.setupClickInteraction();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupClickInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);

            for (let intersect of intersects) {
                if (intersect.object.userData && intersect.object.userData.isClickable && intersect.object.callback) {
                    intersect.object.callback();
                    break;
                }
            }
        };

        this.renderer.domElement.addEventListener('click', onMouseClick);
    }

    createEnvironment() {
        // Grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // Axes
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);

        // Coordinate labels
        this.addCoordinateLabels();
    }

    addCoordinateLabels() {
        const loader = new THREE.FontLoader();
        
        // For simplicity, we'll use basic geometry for labels
        // In a full implementation, you'd load a font and create text geometry
        
        // X-axis label (Red)
        const xGeometry = new THREE.SphereGeometry(0.3);
        const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const xLabel = new THREE.Mesh(xGeometry, xMaterial);
        xLabel.position.set(10, 0, 0);
        this.scene.add(xLabel);

        // Y-axis label (Green)
        const yGeometry = new THREE.SphereGeometry(0.3);
        const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const yLabel = new THREE.Mesh(yGeometry, yMaterial);
        yLabel.position.set(0, 10, 0);
        this.scene.add(yLabel);

        // Z-axis label (Blue)
        const zGeometry = new THREE.SphereGeometry(0.3);
        const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const zLabel = new THREE.Mesh(zGeometry, zMaterial);
        zLabel.position.set(0, 0, 10);
        this.scene.add(zLabel);
    }

    addFeaturePoint(coordinates) {
        // Remove existing point
        if (this.featurePoint) {
            this.scene.remove(this.featurePoint);
        }

        const [x, y, z] = coordinates;

        // Create main feature point
        const geometry = new THREE.SphereGeometry(0.8, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            emissive: 0x002244,
            shininess: 100
        });

        this.featurePoint = new THREE.Mesh(geometry, material);
        this.featurePoint.position.set(x, y, z);
        this.featurePoint.castShadow = true;
        this.scene.add(this.featurePoint);

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(this.featurePoint.position);
        this.scene.add(glow);

        // Add connecting lines to axes
        this.addConnectionLines(coordinates);

        // Focus camera on the point
        this.controls.target.set(x, y, z);
        this.controls.update();
    }

    addConnectionLines(coordinates) {
        const [x, y, z] = coordinates;
        
        // Line to X-axis
        const xLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(x, 0, 0)
        ]);
        const xLineMaterial = new THREE.LineBasicMaterial({ color: 0xff4444, opacity: 0.6, transparent: true });
        const xLine = new THREE.Line(xLineGeometry, xLineMaterial);
        this.scene.add(xLine);

        // Line to Y-axis
        const yLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(0, y, 0)
        ]);
        const yLineMaterial = new THREE.LineBasicMaterial({ color: 0x44ff44, opacity: 0.6, transparent: true });
        const yLine = new THREE.Line(yLineGeometry, yLineMaterial);
        this.scene.add(yLine);

        // Line to Z-axis
        const zLineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(0, 0, z)
        ]);
        const zLineMaterial = new THREE.LineBasicMaterial({ color: 0x4444ff, opacity: 0.6, transparent: true });
        const zLine = new THREE.Line(zLineGeometry, zLineMaterial);
        this.scene.add(zLine);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Rotate feature point
        if (this.featurePoint) {
            this.featurePoint.rotation.y += 0.01;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const container = document.getElementById('visualization');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setStatus(message, type = '') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = 'status';
        
        if (type) {
            status.classList.add(type);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CNNVisualizer();
});
