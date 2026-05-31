/**
 * NativeCameraService - Native camera access for mobile apps
 * Uses Capacitor Camera plugin with fallback to web API
 */

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

/**
 * Check if running on native platform
 */
function isNativePlatform() {
    return Capacitor.isNativePlatform();
}

/**
 * Get available camera sources
 */
function getAvailableSources() {
    if (isNativePlatform()) {
        return ['camera', 'photos', 'prompt'];
    }
    // Web only supports camera and file upload
    return ['camera', 'upload'];
}

/**
 * Check camera permissions
 */
async function checkPermissions() {
    if (!isNativePlatform()) {
        // Web permissions are handled by browser
        return { camera: 'granted', photos: 'granted' };
    }

    try {
        const permissions = await Camera.checkPermissions();
        return permissions;
    } catch (error) {
        console.error('[NativeCamera] Permission check error:', error);
        return { camera: 'denied', photos: 'denied' };
    }
}

/**
 * Request camera permissions
 */
async function requestPermissions() {
    if (!isNativePlatform()) {
        return { camera: 'granted', photos: 'granted' };
    }

    try {
        const permissions = await Camera.requestPermissions();
        return permissions;
    } catch (error) {
        console.error('[NativeCamera] Permission request error:', error);
        throw new Error('Camera permission denied');
    }
}

/**
 * Take a photo using native camera
 * @param {Object} options - Camera options
 * @returns {Promise<Object>} - Photo result with base64 or file path
 */
async function takePhoto(options = {}) {
    const {
        quality = 90,
        allowEditing = false,
        resultType = CameraResultType.Base64,
        source = CameraSource.Camera,
        width = 1280,
        height = 720,
        preserveAspectRatio = true,
        correctOrientation = true,
        promptLabelHeader = 'Photo',
        promptLabelPhoto = 'From Photos',
        promptLabelCamera = 'Take Photo',
    } = options;

    if (!isNativePlatform()) {
        // Fall back to web camera/upload
        return takePhotoWeb(options);
    }

    try {
        const image = await Camera.getPhoto({
            quality,
            allowEditing,
            resultType,
            source,
            width,
            height,
            preserveAspectRatio,
            correctOrientation,
            promptLabelHeader,
            promptLabelPhoto,
            promptLabelPicture: promptLabelCamera,
        });

        return {
            success: true,
            base64: image.base64String,
            dataUrl: `data:image/${image.format};base64,${image.base64String}`,
            path: image.path,
            webPath: image.webPath,
            format: image.format,
            saved: image.saved,
            source: 'native',
        };

    } catch (error) {
        console.error('[NativeCamera] Photo error:', error);

        // User cancelled
        if (error.message?.includes('cancel') || error.message?.includes('User cancelled')) {
            return {
                success: false,
                cancelled: true,
                error: 'User cancelled',
            };
        }

        throw error;
    }
}

/**
 * Take photo using web APIs (fallback)
 */
async function takePhotoWeb(options = {}) {
    return new Promise((resolve, reject) => {
        // Check for web camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            reject(new Error('Camera not supported on this browser'));
            return;
        }

        // Create video element for camera stream
        const video = document.createElement('video');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');

        const constraints = {
            video: {
                facingMode: 'environment', // Prefer back camera
                width: { ideal: options.width || 1280 },
                height: { ideal: options.height || 720 },
            },
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                video.play();

                // Wait for video to be ready
                video.onloadedmetadata = () => {
                    // Create canvas to capture frame
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);

                    // Stop stream
                    stream.getTracks().forEach(track => track.stop());

                    // Get base64
                    const dataUrl = canvas.toDataURL('image/jpeg', (options.quality || 90) / 100);
                    const base64 = dataUrl.split(',')[1];

                    resolve({
                        success: true,
                        base64,
                        dataUrl,
                        format: 'jpeg',
                        source: 'web',
                    });
                };
            })
            .catch((error) => {
                console.error('[NativeCamera] Web camera error:', error);
                reject(error);
            });
    });
}

/**
 * Pick photo from gallery
 */
async function pickFromGallery(options = {}) {
    const {
        quality = 90,
        allowEditing = false,
        resultType = CameraResultType.Base64,
        width = 1280,
        height = 720,
    } = options;

    if (!isNativePlatform()) {
        return pickFromGalleryWeb(options);
    }

    try {
        const image = await Camera.getPhoto({
            quality,
            allowEditing,
            resultType,
            source: CameraSource.Photos,
            width,
            height,
        });

        return {
            success: true,
            base64: image.base64String,
            dataUrl: `data:image/${image.format};base64,${image.base64String}`,
            path: image.path,
            webPath: image.webPath,
            format: image.format,
            source: 'native',
        };

    } catch (error) {
        if (error.message?.includes('cancel')) {
            return { success: false, cancelled: true };
        }
        throw error;
    }
}

/**
 * Pick photo using file input (web fallback)
 */
function pickFromGalleryWeb(options = {}) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) {
                resolve({ success: false, cancelled: true });
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                const base64 = dataUrl.split(',')[1];

                resolve({
                    success: true,
                    base64,
                    dataUrl,
                    format: file.type.split('/')[1] || 'jpeg',
                    fileName: file.name,
                    source: 'web',
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        };

        input.click();
    });
}

/**
 * Prompt user to choose camera or gallery
 */
async function promptForPhoto(options = {}) {
    if (!isNativePlatform()) {
        // On web, let user choose
        return new Promise((resolve) => {
            const choice = window.confirm('Take a photo with your camera? (OK = Camera, Cancel = Choose from files)');
            if (choice) {
                takePhoto(options).then(resolve);
            } else {
                pickFromGallery(options).then(resolve);
            }
        });
    }

    // Native - use system prompt
    return takePhoto({
        ...options,
        source: CameraSource.Prompt,
    });
}

const NativeCameraService = {
    isNativePlatform,
    getAvailableSources,
    checkPermissions,
    requestPermissions,
    takePhoto,
    pickFromGallery,
    promptForPhoto,
};

export default NativeCameraService;
