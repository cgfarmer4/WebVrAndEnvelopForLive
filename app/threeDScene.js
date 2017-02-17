'use_strict';

import * as THREE from 'three';
import * as EnvelopModel from './envelopModel';
import * as Controls from './controls';
import * as Record from './record';

class threeDScene {
    constructor() {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // Stage for rendering.
        this.renderer.setClearColor(new THREE.Color('skyblue'));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container = document.body.appendChild(this.renderer.domElement);

        // Click events
        document.getElementById('startVR').addEventListener('click', () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'vr') return;
            this.controlSwitcher = new Controls('vr', this.scene, this.camera, this.renderer);
            window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this));
        });

        document.getElementById('startTrackball').addEventListener('click', () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'trackball') return;
            this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        });

        document.getElementById('startButton').addEventListener('click', (event) => {
            this.controlSwitcher = new Controls('orbit', this.scene, this.camera, this.renderer, this.container);
            this.record = new Record(this.renderer, this.camera, this.scene);
            this.capturing = true;
        });

        document.getElementById('saveButton').addEventListener('click', (event) => {
            this.capturing = false;
            this.record.stop();
        });

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));
        this.setupSpeakerModel();
        
        // Trackball defaut
        this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        this.animate();
    }
    setupSpeakerModel() {
        let loader = new THREE.ObjectLoader();
        loader.parse(EnvelopModel, (blenderModel) => {
            this.scene.add(blenderModel);
        });
    }
    animate() {
        let delta = this.clock.getDelta();
        this.controlSwitcher.controls.update(delta);
        this.renderer.render(this.scene, this.camera);

        // If we don't change the source here, the HMD will not move the camera.
        if (this.controlSwitcher.controls.type === 'vr') {
            this.vrDisplay.requestAnimationFrame(this.animate.bind(this));
            this.effect.render(this.scene, this.camera);
        }

        if(this.capturing) {
            this.record.cubeMap.update(this.camera, this.scene);
        }

        requestAnimationFrame(this.animate.bind(this));
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        if (this.controlSwitcher.controls.type === 'vr') {
            this.effect.setSize(window.innerWidth, window.innerHeight); 
        }
    }
}

module.exports = threeDScene;
