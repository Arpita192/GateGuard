import * as faceapi from 'face-api.js';

/**
 * Loads all necessary face-api.js models from the public/models directory.
 * This should be called once when the component that needs face-api mounts.
 */
export const loadModels = async () => {
  const MODEL_URL = '/models'; // Path from the public folder
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ]);
    console.log("FaceAPI models loaded successfully.");
  } catch (error) {
    console.error("Error loading FaceAPI models:", error);
  }
};

/**
 * Detects a single face in an image and returns its descriptor.
 * @param {HTMLImageElement | string} image - The image element or URL to process.
 * @returns {Float32Array | undefined} The face descriptor or undefined if no face is found.
 */
export const getFullFaceDescriptor = async (image) => {
  const input = typeof image === 'string' ? await faceapi.fetchImage(image) : image;
  const detection = await faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  return detection?.descriptor;
};

/**
 * Compares two face descriptors and returns a boolean indicating if they match.
 * @param {Float32Array} descriptor1 - The first face descriptor.
 * @param {Float32Array} descriptor2 - The second face descriptor.
 * @param {number} threshold - The distance threshold for a match (default: 0.5).
 * @returns {boolean} True if the faces are considered a match, false otherwise.
 */
export const isFaceMatch = (descriptor1, descriptor2, threshold = 0.5) => {
  if (!descriptor1 || !descriptor2) {
    return false;
  }
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  return distance < threshold;
};