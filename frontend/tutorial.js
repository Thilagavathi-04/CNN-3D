// Educational Tutorial JavaScript
class CNNTutorial {
    constructor() {
        console.log('CNNTutorial constructor called'); // Debug log
        this.visualizer = null;
        this.init();
    }

    init() {
        console.log('CNNTutorial init called'); // Debug log
        this.initializeVisualizer();
        this.setupCNNPipelineDemo();
        
        // Quick test to see if buttons exist
        console.log('Button test:');
        console.log('showInputStep exists:', !!document.getElementById('showInputStep'));
        console.log('showConvStep exists:', !!document.getElementById('showConvStep'));
        console.log('resetPipeline exists:', !!document.getElementById('resetPipeline'));
    }

    setupCNNPipelineDemo() {
        console.log('Setting up CNN pipeline demo'); // Debug log
        
        // Setup CNN pipeline step-by-step demonstration
        const buttons = [
            { id: 'showInputStep', step: 'input' },
            { id: 'showConvStep', step: 'convolution' },
            { id: 'showReluStep', step: 'relu' },
            { id: 'showPoolStep', step: 'pooling' },
            { id: 'showFeaturesStep', step: 'features' },
            { id: 'showPredictionStep', step: 'prediction' }
        ];

        buttons.forEach(({ id, step }) => {
            const button = document.getElementById(id);
            if (button) {
                console.log('Found button:', id); // Debug log
                button.addEventListener('click', () => {
                    console.log('Button clicked:', id, 'Step:', step); // Debug log
                    this.showCNNStep(step);
                });
            } else {
                console.log('Button not found:', id); // Debug log
            }
        });

        const resetButton = document.getElementById('resetPipeline');
        if (resetButton) {
            console.log('Found reset button'); // Debug log
            resetButton.addEventListener('click', () => {
                console.log('Reset button clicked'); // Debug log
                this.resetCNNPipeline();
            });
        } else {
            console.log('Reset button not found'); // Debug log
        }
    }

    showCNNStep(step) {
        console.log('showCNNStep called with:', step); // Debug log
        
        // Remove active class from all buttons
        document.querySelectorAll('.pipeline-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current button
        const activeBtn = document.getElementById(`show${step.charAt(0).toUpperCase() + step.slice(1)}Step`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('Activated button:', activeBtn.id); // Debug log
        } else {
            console.log('Button not found for step:', step); // Debug log
        }

        // Update explanation
        const explanationDiv = document.getElementById('pipelineExplanation');
        
        // Show 3D visualization for each step
        this.visualizeCNNStep(step);
        
        // Update explanation text
        this.updateStepExplanation(step, explanationDiv);
    }

    visualizeCNNStep(step) {
        console.log('Visualizing CNN step:', step); // Debug log
        
        // Ensure we have a visualizer and scene
        if (!this.visualizer) {
            console.log('Creating new visualizer'); // Debug log
            this.visualizer = new CNNVisualizer();
        }
        
        // Make sure the Three.js scene is initialized
        if (!this.visualizer.scene) {
            console.log('Initializing Three.js scene'); // Debug log
            this.visualizer.initThreeJS(document.getElementById('visualization'));
        }

        // Clear previous visualizations
        this.clearPreviousStep();

        switch(step) {
            case 'input':
                this.visualizeInputStep();
                break;
            case 'convolution':
                this.visualizeConvolutionStep();
                break;
            case 'relu':
                this.visualizeReluStep();
                break;
            case 'pooling':
                this.visualizePoolingStep();
                break;
            case 'features':
                this.visualizeFeaturesStep();
                break;
            case 'prediction':
                this.visualizePredictionStep();
                break;
            default:
                console.log('Unknown step:', step);
        }
    }

    visualizeInputStep() {
        console.log('Starting input step visualization'); // Debug log
        
        if (!this.visualizer || !this.visualizer.scene) {
            console.error('No scene available for visualization'); // Debug log
            return;
        }
        
        // Hide the placeholder if it exists
        const placeholder = document.querySelector('.viz-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // Show input image as a 3D grid of pixels
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        let cubeCount = 0;
        
        for (let x = -2; x <= 2; x += 0.5) {
            for (let y = -2; y <= 2; y += 0.5) {
                for (let z = -1; z <= 1; z += 0.5) {
                    const material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(
                            Math.random() * 0.5 + 0.5,
                            Math.random() * 0.5 + 0.5,
                            Math.random() * 0.5 + 0.5
                        ),
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(x, y, z);
                    cube.userData = { step: 'input' };
                    this.visualizer.scene.add(cube);
                    cubeCount++;
                }
            }
        }
        
        console.log(`Added ${cubeCount} cubes to scene`); // Debug log
        
        // Make sure the renderer renders the scene
        if (this.visualizer.renderer) {
            this.visualizer.renderer.render(this.visualizer.scene, this.visualizer.camera);
        }
    }

    visualizeConvolutionStep() {
        // Show convolution filters as moving colored planes
        const filterGeometry = new THREE.PlaneGeometry(1, 1);
        
        // Create multiple filters
        const filters = [
            { color: 0xff4444, position: [-3, 2, 0], name: 'Edge Filter' },
            { color: 0x44ff44, position: [0, 2, 0], name: 'Texture Filter' },
            { color: 0x4444ff, position: [3, 2, 0], name: 'Shape Filter' }
        ];

        filters.forEach((filter, i) => {
            const material = new THREE.MeshBasicMaterial({
                color: filter.color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const plane = new THREE.Mesh(filterGeometry, material);
            plane.position.set(...filter.position);
            plane.userData = { step: 'convolution', filterId: i };
            this.visualizer.scene.add(plane);

            // Animate filter movement
            this.animateFilter(plane, i);
        });
    }

    animateFilter(filter, index) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            filter.position.y = 2 + Math.sin(elapsed + index) * 0.5;
            filter.rotation.z = elapsed * 0.5;
            
            if (filter.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    visualizeReluStep() {
        // Show ReLU activation - only positive values survive
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        for (let i = 0; i < 100; i++) {
            const value = (Math.random() - 0.5) * 4; // Some negative, some positive
            
            if (value > 0) { // ReLU: keep only positive
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(value/2, value/2, 1),
                    transparent: true,
                    opacity: 0.8
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 2
                );
                sphere.userData = { step: 'relu', value: value };
                this.visualizer.scene.add(sphere);
                
                // Animate growing effect
                sphere.scale.set(0, 0, 0);
                const targetScale = value * 0.5;
                this.animateScale(sphere, targetScale);
            }
        }
    }

    animateScale(object, targetScale) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / 0.5, 1); // 0.5 second animation
            const currentScale = progress * targetScale;
            
            object.scale.set(currentScale, currentScale, currentScale);
            
            if (progress < 1 && object.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    visualizePoolingStep() {
        // Show pooling as reducing resolution but keeping important features
        const beforeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const afterGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        
        // Before pooling - many small cubes
        for (let x = -3; x <= -1; x += 0.3) {
            for (let y = -2; y <= 2; y += 0.3) {
                const material = new THREE.MeshBasicMaterial({
                    color: 0x666666,
                    transparent: true,
                    opacity: 0.5
                });
                
                const cube = new THREE.Mesh(beforeGeometry, material);
                cube.position.set(x, y, 0);
                cube.userData = { step: 'pooling' };
                this.visualizer.scene.add(cube);
            }
        }
        
        // After pooling - fewer large cubes (max pooling)
        for (let x = 1; x <= 3; x += 0.6) {
            for (let y = -2; y <= 2; y += 0.6) {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(
                        Math.random() * 0.5 + 0.5,
                        Math.random() * 0.5 + 0.5,
                        1
                    ),
                    transparent: true,
                    opacity: 0.8
                });
                
                const cube = new THREE.Mesh(afterGeometry, material);
                cube.position.set(x, y, 0);
                cube.userData = { step: 'pooling' };
                this.visualizer.scene.add(cube);
            }
        }
    }

    visualizeFeaturesStep() {
        // Show feature extraction as clustering patterns
        const geometry = new THREE.SphereGeometry(0.15, 12, 12);
        
        // Create feature clusters
        const featureTypes = [
            { center: [-2, 2, 0], color: 0xff6b6b, name: 'Edges' },
            { center: [2, 2, 0], color: 0x4ecdc4, name: 'Textures' },
            { center: [0, -2, 0], color: 0x45b7d1, name: 'Shapes' },
            { center: [0, 0, 1], color: 0xffd93d, name: 'Complex Features' }
        ];

        featureTypes.forEach(featureType => {
            for (let i = 0; i < 15; i++) {
                const material = new THREE.MeshBasicMaterial({
                    color: featureType.color,
                    transparent: true,
                    opacity: 0.7
                });
                
                const sphere = new THREE.Mesh(geometry, material);
                
                // Position around the cluster center
                const angle = (i / 15) * Math.PI * 2;
                const radius = Math.random() * 0.8 + 0.2;
                sphere.position.set(
                    featureType.center[0] + Math.cos(angle) * radius,
                    featureType.center[1] + Math.sin(angle) * radius,
                    featureType.center[2] + (Math.random() - 0.5) * 0.5
                );
                
                sphere.userData = { step: 'features', type: featureType.name };
                this.visualizer.scene.add(sphere);
                
                // Animate pulsing effect
                this.animatePulse(sphere);
            }
        });
    }

    animatePulse(object) {
        const startTime = Date.now();
        const baseScale = object.scale.x;
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const pulse = 1 + Math.sin(elapsed * 3) * 0.2;
            object.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse);
            
            if (object.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    visualizePredictionStep() {
        // Show final prediction as a central glowing point with confidence rays
        const centralGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const centralMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            transparent: true,
            opacity: 0.9
        });
        
        const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
        centralSphere.position.set(0, 0, 0);
        centralSphere.userData = { step: 'prediction' };
        this.visualizer.scene.add(centralSphere);
        
        // Add confidence rays
        const predictions = [
            { label: 'Dog: 94%', angle: 0, confidence: 0.94, color: 0x00ff00 },
            { label: 'Cat: 4%', angle: Math.PI/2, confidence: 0.04, color: 0xff4444 },
            { label: 'Bird: 2%', angle: Math.PI, confidence: 0.02, color: 0x4444ff }
        ];
        
        predictions.forEach(pred => {
            const rayGeometry = new THREE.CylinderGeometry(0.02, 0.02, pred.confidence * 3, 8);
            const rayMaterial = new THREE.MeshBasicMaterial({
                color: pred.color,
                transparent: true,
                opacity: 0.8
            });
            
            const ray = new THREE.Mesh(rayGeometry, rayMaterial);
            ray.position.set(
                Math.cos(pred.angle) * pred.confidence * 1.5,
                Math.sin(pred.angle) * pred.confidence * 1.5,
                0
            );
            ray.rotation.z = pred.angle + Math.PI/2;
            ray.userData = { step: 'prediction' };
            this.visualizer.scene.add(ray);
        });
        
        // Animate central sphere
        this.animateGlow(centralSphere);
    }

    animateGlow(object) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const glow = 0.7 + Math.sin(elapsed * 2) * 0.2;
            object.material.opacity = glow;
            
            if (object.parent) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    clearPreviousStep() {
        // Remove all previous step visualizations
        const objectsToRemove = [];
        this.visualizer.scene.traverse((child) => {
            if (child.userData && child.userData.step) {
                objectsToRemove.push(child);
            }
        });
        
        objectsToRemove.forEach(obj => {
            this.visualizer.scene.remove(obj);
        });
    }

    updateStepExplanation(step, explanationDiv) {
        const explanations = {
            input: "📷 <strong>Step 1: Input Image</strong><br>Your image is converted into a 3D grid of pixel values (RGB). Each cube represents a pixel with its color intensity.",
            
            convolution: "🔍 <strong>Step 2: Convolution</strong><br>CNN slides small filters across the image to detect patterns like edges, textures, and shapes. Watch the colored filters scan for different features!",
            
            relu: "⚡ <strong>Step 3: ReLU Activation</strong><br>ReLU removes negative values and keeps only positive activations. Only the bright spheres survive - these are the important features!",
            
            pooling: "📉 <strong>Step 4: Pooling</strong><br>Pooling reduces image size while keeping important features. Notice how many small cubes become fewer larger ones (max pooling).",
            
            features: "🎯 <strong>Step 5: Feature Extraction</strong><br>CNN combines simple patterns into complex features. Each cluster represents different feature types like edges, textures, and shapes!",
            
            prediction: "🏆 <strong>Step 6: Final Prediction</strong><br>CNN uses all extracted features to make predictions. The golden sphere shows the final decision with confidence rays showing other possibilities!"
        };
        
        if (explanationDiv && explanations[step]) {
            explanationDiv.innerHTML = explanations[step];
        }
    }

    resetCNNPipeline() {
        // Remove active class from all buttons
        document.querySelectorAll('.pipeline-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Clear all step visualizations
        this.clearPreviousStep();
        
        // Reset explanation
        const explanationDiv = document.getElementById('pipelineExplanation');
        if (explanationDiv) {
            explanationDiv.innerHTML = "<p>Upload an image and click the steps above to see how CNN processes it in 3D!</p>";
        }
        
        // Reset camera to default position
        if (this.visualizer && this.visualizer.controls) {
            this.visualizer.controls.reset();
        }
    }

    initializeVisualizer() {
        if (document.getElementById('visualization')) {
            this.visualizer = new CNNVisualizer();
            this.enhanceVisualizerWithEducation();
            this.addInteractiveFeatureDemos();
        }
    }

    addInteractiveFeatureDemos() {
        // Add feature demonstration controls to the demo tab
        const demoSection = document.querySelector('#demo .visualization-section');
        if (demoSection) {
            const demoControls = document.createElement('div');
            demoControls.className = 'feature-demo-controls';
            demoControls.innerHTML = `
                <h4>🎮 Interactive Feature Demos</h4>
                <div class="demo-buttons">
                    <button id="showColorDemo" class="feature-btn">🎨 Color Features</button>
                    <button id="showMovementDemo" class="feature-btn">📍 Point Movement</button>
                    <button id="showClusterDemo" class="feature-btn">🎯 Image Clustering</button>
                    <button id="resetDemo" class="feature-btn reset">🔄 Reset</button>
                </div>
                <div id="demoExplanation" class="demo-explanation-box">
                    <p>Click buttons above to see interactive demonstrations!</p>
                </div>
            `;
            demoSection.appendChild(demoControls);

            // Add event listeners for demo buttons
            this.setupFeatureDemoListeners();
        }
    }

    setupFeatureDemoListeners() {
        document.getElementById('showColorDemo')?.addEventListener('click', () => {
            this.demonstrateColorFeatures();
        });

        document.getElementById('showMovementDemo')?.addEventListener('click', () => {
            this.demonstratePointMovement();
        });

        document.getElementById('showClusterDemo')?.addEventListener('click', () => {
            this.demonstrateClustering();
        });

        document.getElementById('resetDemo')?.addEventListener('click', () => {
            this.resetDemonstration();
        });
    }

    demonstrateColorFeatures() {
        const explanation = document.getElementById('demoExplanation');
        explanation.innerHTML = `
            <h5>🎨 Color Feature Demonstration</h5>
            <p>Watch how different colored images appear in different regions of 3D space!</p>
        `;

        if (!this.visualizer.scene) {
            this.visualizer.initThreeJS(document.getElementById('visualization'));
        }

        // Clear existing points
        this.clearDemoPoints();

        // Create sample color points with animation
        const colorSamples = [
            { name: '🌹 Red Rose', color: 0xff4444, pos: [3, -1, -1], rgb: [0.8, 0.2, 0.2] },
            { name: '🌿 Green Leaf', color: 0x44ff44, pos: [-1, 3, -1], rgb: [0.2, 0.8, 0.2] },
            { name: '🌊 Blue Ocean', color: 0x4444ff, pos: [-1, -1, 3], rgb: [0.2, 0.2, 0.8] },
            { name: '🌞 Yellow Sun', color: 0xffff44, pos: [2, 2, -2], rgb: [0.9, 0.9, 0.1] },
            { name: '🍇 Purple Grape', color: 0xff44ff, pos: [2, -2, 2], rgb: [0.8, 0.2, 0.8] }
        ];

        this.animateColorPoints(colorSamples, explanation);
    }

    animateColorPoints(colorSamples, explanation) {
        let currentIndex = 0;
        const animateNext = () => {
            if (currentIndex >= colorSamples.length) {
                explanation.innerHTML += `
                    <div class="demo-complete">
                        <p><strong>✨ Notice:</strong> Each color appears in its corresponding region!</p>
                        <ul>
                            <li>Red images → Positive X-axis</li>
                            <li>Green images → Positive Y-axis</li>
                            <li>Blue images → Positive Z-axis</li>
                            <li>Mixed colors → Intermediate positions</li>
                        </ul>
                    </div>
                `;
                return;
            }

            const sample = colorSamples[currentIndex];
            
            // Update explanation
            explanation.innerHTML = `
                <h5>🎨 Color Feature Demonstration</h5>
                <p>Currently showing: <strong>${sample.name}</strong></p>
                <p>RGB: (${(sample.rgb[0]*100).toFixed(0)}%, ${(sample.rgb[1]*100).toFixed(0)}%, ${(sample.rgb[2]*100).toFixed(0)}%)</p>
                <p>Position: (${sample.pos[0]}, ${sample.pos[1]}, ${sample.pos[2]})</p>
            `;

            // Create animated point
            this.createAnimatedPoint(sample.pos, sample.color, sample.name);
            
            currentIndex++;
            setTimeout(animateNext, 2000);
        };

        animateNext();
    }

    demonstratePointMovement() {
        const explanation = document.getElementById('demoExplanation');
        explanation.innerHTML = `
            <h5>📍 Point Movement Demonstration</h5>
            <p>Watch how changing image features moves the point in 3D space!</p>
        `;

        if (!this.visualizer.scene) {
            this.visualizer.initThreeJS(document.getElementById('visualization'));
        }

        this.clearDemoPoints();

        // Create a point that moves through different positions
        const movements = [
            { pos: [0, 0, 0], desc: '🎭 Neutral image (balanced colors)', color: 0xaaaaaa },
            { pos: [3, 0, 0], desc: '🔴 Adding red content...', color: 0xff6666 },
            { pos: [3, 3, 0], desc: '🟢 Adding green content...', color: 0xffaa66 },
            { pos: [3, 3, 3], desc: '🔵 Adding blue content...', color: 0xffffff },
            { pos: [1, 4, 1], desc: '🌿 Green-dominant nature scene', color: 0x66ff66 },
            { pos: [4, 1, 1], desc: '🌹 Red-dominant flower', color: 0xff6666 }
        ];

        this.animatePointMovement(movements, explanation);
    }

    animatePointMovement(movements, explanation) {
        let currentIndex = 0;
        let movingPoint = null;

        const animateNext = () => {
            if (currentIndex >= movements.length) {
                explanation.innerHTML += `
                    <div class="demo-complete">
                        <p><strong>🎯 Key Insight:</strong> Image features directly control 3D position!</p>
                        <p>This is how CNNs organize similar images in feature space.</p>
                    </div>
                `;
                return;
            }

            const movement = movements[currentIndex];
            
            explanation.innerHTML = `
                <h5>📍 Point Movement Demonstration</h5>
                <p><strong>Step ${currentIndex + 1}:</strong> ${movement.desc}</p>
                <p>Moving to position: (${movement.pos[0]}, ${movement.pos[1]}, ${movement.pos[2]})</p>
            `;

            if (movingPoint) {
                this.visualizer.scene.remove(movingPoint);
            }

            movingPoint = this.createAnimatedPoint(movement.pos, movement.color, movement.desc, true);
            
            currentIndex++;
            setTimeout(animateNext, 2500);
        };

        animateNext();
    }

    demonstrateClustering() {
        const explanation = document.getElementById('demoExplanation');
        explanation.innerHTML = `
            <h5>🎯 Image Clustering Demonstration</h5>
            <p>See how similar images cluster together in 3D space!</p>
        `;

        if (!this.visualizer.scene) {
            this.visualizer.initThreeJS(document.getElementById('visualization'));
        }

        this.clearDemoPoints();

        // Create clusters of similar images
        const clusters = [
            {
                name: '🌹 Red Flowers',
                center: [3, 0, 0],
                color: 0xff4444,
                points: [
                    [3.2, 0.1, -0.1], [2.8, -0.2, 0.2], [3.1, 0.3, -0.1], [2.9, -0.1, 0.1]
                ]
            },
            {
                name: '🌿 Green Plants',
                center: [0, 3, 0],
                color: 0x44ff44,
                points: [
                    [-0.1, 3.2, 0.1], [0.2, 2.8, -0.2], [-0.1, 3.1, 0.3], [0.1, 2.9, -0.1]
                ]
            },
            {
                name: '🌊 Blue Water',
                center: [0, 0, 3],
                color: 0x4444ff,
                points: [
                    [0.1, -0.1, 3.2], [-0.2, 0.2, 2.8], [0.3, -0.1, 3.1], [-0.1, 0.1, 2.9]
                ]
            }
        ];

        this.animateClusters(clusters, explanation);
    }

    animateClusters(clusters, explanation) {
        let clusterIndex = 0;
        
        const showNextCluster = () => {
            if (clusterIndex >= clusters.length) {
                explanation.innerHTML += `
                    <div class="demo-complete">
                        <p><strong>🎓 Learning:</strong> Similar images form clusters!</p>
                        <p>CNNs use this clustering to:</p>
                        <ul>
                            <li>Group similar objects together</li>
                            <li>Distinguish between different categories</li>
                            <li>Learn patterns from examples</li>
                        </ul>
                    </div>
                `;
                return;
            }

            const cluster = clusters[clusterIndex];
            
            explanation.innerHTML = `
                <h5>🎯 Image Clustering Demonstration</h5>
                <p>Showing cluster: <strong>${cluster.name}</strong></p>
                <p>Notice how similar images group together!</p>
            `;

            // Create cluster points with staggered animation
            cluster.points.forEach((pos, i) => {
                setTimeout(() => {
                    this.createAnimatedPoint(pos, cluster.color, `${cluster.name} #${i+1}`);
                }, i * 300);
            });

            clusterIndex++;
            setTimeout(showNextCluster, 2000);
        };

        showNextCluster();
    }

    createAnimatedPoint(targetPos, color, label, smoothMove = false) {
        if (!this.visualizer.scene) return null;

        const geometry = new THREE.SphereGeometry(0.4, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.1),
            shininess: 100
        });

        const point = new THREE.Mesh(geometry, material);
        
        if (smoothMove && this.lastPoint) {
            // Start from last position and animate to new position
            point.position.copy(this.lastPoint.position);
        } else {
            // Start from origin
            point.position.set(0, 0, 0);
        }

        this.visualizer.scene.add(point);

        // Animate to target position
        const startPos = point.position.clone();
        const endPos = new THREE.Vector3(...targetPos);
        let progress = 0;

        const animate = () => {
            progress += 0.02;
            if (progress <= 1) {
                point.position.lerpVectors(startPos, endPos, this.easeInOutCubic(progress));
                requestAnimationFrame(animate);
            }
        };
        animate();

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.6, 12, 12);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        point.add(glow);

        // Store reference
        if (!this.demoPoints) this.demoPoints = [];
        this.demoPoints.push(point);
        this.lastPoint = point;

        return point;
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    clearDemoPoints() {
        if (this.demoPoints && this.visualizer.scene) {
            this.demoPoints.forEach(point => {
                this.visualizer.scene.remove(point);
            });
            this.demoPoints = [];
        }
    }

    resetDemonstration() {
        this.clearDemoPoints();
        const explanation = document.getElementById('demoExplanation');
        if (explanation) {
            explanation.innerHTML = '<p>Click buttons above to see interactive demonstrations!</p>';
        }
    }

    enhanceVisualizerWithEducation() {
        // Override the original displayResults to add educational insights
        const originalDisplayResults = this.visualizer.displayResults.bind(this.visualizer);
        
        this.visualizer.displayResults = (data) => {
            originalDisplayResults(data);
            this.showEducationalInsights(data);
        };

        // Add interactive demo controls
        this.setupInteractiveDemos();
    }

    setupInteractiveDemos() {
        // Color movement demo
        document.getElementById('showColorDemo')?.addEventListener('click', () => {
            this.showColorMovementDemo();
        });

        // Feature selection demo
        document.getElementById('showFeatureDemo')?.addEventListener('click', () => {
            this.showFeatureSelectionDemo();
        });

        // Multiple points demo
        document.getElementById('showMultiplePoints')?.addEventListener('click', () => {
            this.showMultiplePointsDemo();
        });

        // Reset demo
        document.getElementById('resetDemo')?.addEventListener('click', () => {
            this.resetDemo();
        });
    }

    showColorMovementDemo() {
        const explanationText = document.getElementById('demoExplanation');
        explanationText.innerHTML = '🎨 <strong>Color Movement Demo:</strong> Watch how different colors move to different positions in 3D space!';
        explanationText.classList.add('highlight');

        if (!this.visualizer || !this.visualizer.scene) {
            explanationText.innerHTML = '⚠️ Please upload an image first to see the 3D visualization!';
            return;
        }

        // Clear existing points
        this.clearDemoPoints();

        // Animate points showing color movement
        const colorExamples = [
            { color: 0xff0000, position: [5, 0, 0], name: 'Red Rose' },
            { color: 0x00ff00, position: [0, 5, 0], name: 'Green Leaves' },
            { color: 0x0000ff, position: [0, 0, 5], name: 'Blue Ocean' },
            { color: 0xffffff, position: [0, 0, 0], name: 'White Paper' }
        ];

        colorExamples.forEach((example, index) => {
            setTimeout(() => {
                this.animatePointToPosition(example.color, example.position, example.name);
            }, index * 1000);
        });
    }

    showFeatureSelectionDemo() {
        const explanationText = document.getElementById('demoExplanation');
        explanationText.innerHTML = '🔍 <strong>Feature Selection:</strong> Click on different points to see what features they represent!';
        explanationText.classList.add('highlight');

        if (!this.visualizer || !this.visualizer.scene) {
            explanationText.innerHTML = '⚠️ Please upload an image first to see the 3D visualization!';
            return;
        }

        this.clearDemoPoints();
        
        // Create clickable feature points
        const features = [
            { position: [3, 1, -2], color: 0xff6b6b, feature: 'High Red, Low Blue', description: 'Warm colors like sunsets, roses' },
            { position: [-1, 4, 2], color: 0x51cf66, feature: 'High Green, Balanced Others', description: 'Natural scenes, forests, grass' },
            { position: [1, -2, 4], color: 0x339af0, feature: 'High Blue, Low Green', description: 'Sky, water, blue objects' },
            { position: [2, 2, 2], color: 0xffd43b, feature: 'Balanced RGB', description: 'Complex scenes, mixed colors' }
        ];

        features.forEach((feature, index) => {
            setTimeout(() => {
                this.createClickableFeaturePoint(feature);
            }, index * 500);
        });
    }

    showMultiplePointsDemo() {
        const explanationText = document.getElementById('demoExplanation');
        explanationText.innerHTML = '📊 <strong>Image Comparison:</strong> See how different types of images cluster in 3D space!';
        explanationText.classList.add('highlight');

        if (!this.visualizer || !this.visualizer.scene) {
            explanationText.innerHTML = '⚠️ Please upload an image first to see the 3D visualization!';
            return;
        }

        this.clearDemoPoints();

        // Show multiple image types
        const imageTypes = [
            { position: [4, -1, -2], color: 0xff4757, label: '🌅 Sunset' },
            { position: [-2, 3, 1], color: 0x2ed573, label: '🌳 Forest' },
            { position: [1, -1, 4], color: 0x3742fa, label: '🌊 Ocean' },
            { position: [3, 3, -1], color: 0xffa502, label: '🍊 Orange' },
            { position: [-3, -2, 3], color: 0x9c88ff, label: '🌸 Flowers' },
            { position: [0, 0, 0], color: 0x747d8c, label: '🏢 Building' }
        ];

        imageTypes.forEach((type, index) => {
            setTimeout(() => {
                this.createLabeledPoint(type);
            }, index * 300);
        });

        // Add clustering explanation
        setTimeout(() => {
            explanationText.innerHTML += '<br><br>💡 <strong>Notice:</strong> Similar images cluster together! CNNs use this principle to classify images.';
        }, 2000);
    }

    resetDemo() {
        const explanationText = document.getElementById('demoExplanation');
        explanationText.innerHTML = 'Click buttons above to see how CNN features work in 3D space!';
        explanationText.classList.remove('highlight');
        
        this.clearDemoPoints();
        
        // Reset camera position
        if (this.visualizer && this.visualizer.camera && this.visualizer.controls) {
            this.visualizer.camera.position.set(15, 15, 15);
            this.visualizer.controls.target.set(0, 0, 0);
            this.visualizer.controls.update();
        }
    }

    clearDemoPoints() {
        if (!this.visualizer || !this.visualizer.scene) return;

        // Remove demo points (keep original feature point)
        const objectsToRemove = [];
        this.visualizer.scene.traverse((child) => {
            if (child.userData && child.userData.isDemoPoint) {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(obj => {
            this.visualizer.scene.remove(obj);
        });
    }

    animatePointToPosition(color, targetPosition, name) {
        if (!this.visualizer || !this.visualizer.scene) return;

        // Create animated point
        const geometry = new THREE.SphereGeometry(0.6, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.2),
            shininess: 100
        });

        const point = new THREE.Mesh(geometry, material);
        point.position.set(0, 0, 0);
        point.userData = { isDemoPoint: true, name: name };
        this.visualizer.scene.add(point);

        // Add label
        const labelDiv = document.createElement('div');
        labelDiv.style.position = 'absolute';
        labelDiv.style.color = 'white';
        labelDiv.style.fontSize = '12px';
        labelDiv.style.background = 'rgba(0,0,0,0.7)';
        labelDiv.style.padding = '4px 8px';
        labelDiv.style.borderRadius = '4px';
        labelDiv.style.pointerEvents = 'none';
        labelDiv.textContent = name;

        // Animate to target position
        const startPosition = { x: 0, y: 0, z: 0 };
        const endPosition = { x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] };
        
        let progress = 0;
        const animate = () => {
            progress += 0.02;
            if (progress <= 1) {
                point.position.x = startPosition.x + (endPosition.x - startPosition.x) * progress;
                point.position.y = startPosition.y + (endPosition.y - startPosition.y) * progress;
                point.position.z = startPosition.z + (endPosition.z - startPosition.z) * progress;
                
                // Add some bounce
                const bounce = Math.sin(progress * Math.PI) * 0.5;
                point.position.y += bounce;
                
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    createClickableFeaturePoint(feature) {
        if (!this.visualizer || !this.visualizer.scene) return;

        const geometry = new THREE.SphereGeometry(0.7, 20, 20);
        const material = new THREE.MeshPhongMaterial({
            color: feature.color,
            emissive: new THREE.Color(feature.color).multiplyScalar(0.1),
            shininess: 100
        });

        const point = new THREE.Mesh(geometry, material);
        point.position.set(...feature.position);
        point.userData = { 
            isDemoPoint: true, 
            isClickable: true,
            feature: feature.feature,
            description: feature.description
        };
        this.visualizer.scene.add(point);

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: feature.color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(point.position);
        glow.userData = { isDemoPoint: true };
        this.visualizer.scene.add(glow);

        // Add click interaction
        point.callback = () => {
            const explanationText = document.getElementById('demoExplanation');
            explanationText.innerHTML = `
                🎯 <strong>${feature.feature}</strong><br>
                ${feature.description}<br>
                <em>Position: (${feature.position[0]}, ${feature.position[1]}, ${feature.position[2]})</em>
            `;
        };
    }

    createLabeledPoint(type) {
        if (!this.visualizer || !this.visualizer.scene) return;

        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: type.color,
            emissive: new THREE.Color(type.color).multiplyScalar(0.2)
        });

        const point = new THREE.Mesh(geometry, material);
        point.position.set(...type.position);
        point.userData = { isDemoPoint: true, label: type.label };
        this.visualizer.scene.add(point);

        // Add connecting line to center
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...type.position),
            new THREE.Vector3(0, 0, 0)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: type.color, 
            opacity: 0.3, 
            transparent: true 
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = { isDemoPoint: true };
        this.visualizer.scene.add(line);
    }

    showEducationalInsights(data) {
        const insights = document.getElementById('learningInsights');
        if (!insights) return;

        const features = data.features;
        const [x, y, z] = data.coordinates;
        
        let dominantColor = 'balanced';
        let position = 'center';
        
        // Determine dominant color
        if (Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) {
            dominantColor = x > 0 ? 'red' : 'low-red';
            position = x > 0 ? 'positive X (red) direction' : 'negative X (less red) direction';
        } else if (Math.abs(y) > Math.abs(z)) {
            dominantColor = y > 0 ? 'green' : 'low-green';
            position = y > 0 ? 'positive Y (green) direction' : 'negative Y (less green) direction';
        } else if (Math.abs(z) > 2) {
            dominantColor = z > 0 ? 'blue' : 'low-blue';
            position = z > 0 ? 'positive Z (blue) direction' : 'negative Z (less blue) direction';
        }

        const educationalText = this.generateEducationalText(dominantColor, position, features);
        
        insights.innerHTML = `
            <div class="insight-item">
                <h5>🎯 Position Analysis</h5>
                <p>Your image appears in the <strong>${position}</strong> of our 3D color space.</p>
            </div>
            <div class="insight-item">
                <h5>🔬 What This Teaches Us</h5>
                <p>${educationalText}</p>
            </div>
            <div class="insight-item">
                <h5>🧠 CNN Connection</h5>
                <p>Real CNNs extract thousands of features like this, but instead of just colors, they detect edges, textures, shapes, and complex patterns. Each feature becomes a dimension in high-dimensional space!</p>
            </div>
            <div class="insight-item">
                <h5>📚 Try Next</h5>
                <p>Upload images with different dominant colors to see how they cluster in different regions of the 3D space. This mimics how CNNs group similar images together!</p>
            </div>
        `;
    }

    generateEducationalText(dominantColor, position, features) {
        const insights = {
            'red': 'Images with strong red components (like roses, strawberries, or sunsets) cluster in this region. CNNs use this to distinguish red objects from others.',
            'green': 'Green-dominant images (like forests, grass, or leaves) appear here. This helps CNNs identify nature scenes and vegetation.',
            'blue': 'Blue-heavy images (like sky, ocean, or blue objects) are positioned here. CNNs use this to recognize water, sky, and blue items.',
            'balanced': 'Your image has balanced colors, appearing near the center. This often indicates complex scenes with multiple colors or neutral tones.',
            'low-red': 'This image has minimal red content, appearing in the cyan/blue region of color space.',
            'low-green': 'Limited green content pushes this image toward the magenta region, away from natural/vegetation colors.',
            'low-blue': 'Low blue content places this image in the yellow region, typical of warm, sunny scenes.'
        };

        return insights[dominantColor] || insights['balanced'];
    }
}

// Enhanced CSS for interactive demos
const demoStyles = `
<style>
.demo-explanation {
    text-align: center;
    padding: 1rem;
}

.conv-demo, .pool-demo, .feature-hierarchy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.matrix {
    display: grid;
    grid-template-columns: repeat(3, 30px);
    gap: 2px;
    margin: 0.5rem 0;
}

.pool-matrix {
    display: grid;
    gap: 2px;
    margin: 0.5rem 0;
}

.pool-matrix:not(.small) {
    grid-template-columns: repeat(4, 25px);
}

.pool-matrix.small {
    grid-template-columns: repeat(2, 30px);
}

.cell, .pool-cell {
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    border-radius: 3px;
}

.pool-cell {
    width: 25px;
    height: 25px;
}

.cell.highlight, .pool-cell.highlight {
    background: rgba(255, 215, 0, 0.3);
    border-color: #ffd700;
}

.cell.filter-center {
    background: rgba(54, 162, 235, 0.5);
    color: white;
    font-weight: bold;
}

.pool-cell.result {
    background: rgba(75, 192, 192, 0.5);
    border-color: #4bc0c0;
    font-weight: bold;
}

.operator {
    font-size: 1.5rem;
    color: #ffd700;
    margin: 0 1rem;
}

.result-value {
    background: rgba(255, 99, 132, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    color: white;
    font-weight: bold;
}

.matrix-label {
    font-size: 0.9rem;
    color: #ffd700;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.hierarchy-level {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 10px;
    margin: 0.5rem 0;
    min-width: 200px;
}

.hierarchy-arrow {
    font-size: 1.5rem;
    color: #ffd700;
}

.feature-examples {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.feature-ex {
    background: rgba(102, 126, 234, 0.3);
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
}

.insight-item {
    background: rgba(255, 255, 255, 0.05);
    margin: 0.8rem 0;
    padding: 1rem;
    border-radius: 8px;
    border-left: 3px solid #ffd700;
}

.insight-item h5 {
    color: #ffd700;
    margin: 0 0 0.5rem 0;
}

.insight-item p {
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .conv-demo, .pool-demo {
        flex-direction: column;
    }
    
    .matrix {
        grid-template-columns: repeat(3, 25px);
    }
    
    .cell, .pool-cell {
        width: 25px;
        height: 25px;
        font-size: 0.7rem;
    }
    
    .feature-hierarchy {
        flex-direction: column;
    }
    
    .hierarchy-arrow {
        transform: rotate(90deg);
    }
}
</style>
`;

// Initialize tutorial when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CNN tutorial'); // Debug log
    
    // Add demo styles
    document.head.insertAdjacentHTML('beforeend', demoStyles);
    
    // Initialize tutorial with a small delay to ensure everything is ready
    setTimeout(() => {
        console.log('Creating CNNTutorial instance'); // Debug log
        const tutorial = new CNNTutorial();
        console.log('CNNTutorial created:', tutorial); // Debug log
    }, 100);
});
