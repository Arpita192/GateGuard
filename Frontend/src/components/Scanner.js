import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = ({ onScanSuccess }) => {
    // Use a ref to hold the scanner instance so it persists between renders
    const scannerRef = useRef(null);

    useEffect(() => {
        // --- THIS IS THE CORRECTED LOGIC TO PREVENT DUPLICATE CAMERAS AND CLEANUP ERRORS ---

        // 1. Create a new scanner instance only if one doesn't already exist.
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("qr-reader-container");
        }
        const html5QrCode = scannerRef.current;

        // 2. Define the success and error callbacks
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            onScanSuccess(decodedText);
        };
        const qrCodeErrorCallback = (errorMessage) => {
            // We can ignore parse errors which happen frequently.
        };

        // 3. Start the scanner only if it's not already running.
        if (html5QrCode && !html5QrCode.isScanning) {
            Html5Qrcode.getCameras().then(cameras => {
                if (cameras && cameras.length) {
                    const cameraId = cameras[0].id;
                    html5QrCode.start(
                        cameraId,
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        qrCodeSuccessCallback,
                        qrCodeErrorCallback
                    ).catch(err => {
                        console.error("Unable to start scanning.", err);
                    });
                }
            }).catch(err => {
                console.error("Error getting cameras.", err);
            });
        }

        // 4. Define the cleanup function to stop the scanner when the component unmounts
        return () => {
            const scanner = scannerRef.current;
            // IMPORTANT: Check if the scanner exists AND is currently scanning before trying to stop it.
            if (scanner && scanner.isScanning) {
                scanner.stop()
                    .then(() => {
                        console.log("Scanner stopped successfully.");
                        // The clear method removes any UI elements left by the scanner.
                        scanner.clear();
                    })
                    .catch(err => {
                        // This error is now less likely but we keep the catch for safety.
                        console.warn("Error stopping the scanner, it might have already been stopped.", err);
                    });
            }
        };
    }, [onScanSuccess]);

    return (
        <div id="qr-reader-container" style={{ width: '100%' }}></div>
    );
};

export default Scanner;
