
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "sonner"

// Add viewport meta tag to ensure proper mobile rendering
const metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
document.head.appendChild(metaTag);

// Add mobile-specific touch handling
document.addEventListener('touchstart', function() {}, {passive: true});

// Add Thai font (Sarabun)
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;700&display=swap';
document.head.appendChild(fontLink);

// Add PCI badge script for payment security display
const pciScript = document.createElement('script');
pciScript.src = 'https://seal.digicert.com/seals/cascade/seal.min.js';
pciScript.async = true;
document.head.appendChild(pciScript);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <Toaster richColors closeButton position="top-right" />
  </HelmetProvider>
);
