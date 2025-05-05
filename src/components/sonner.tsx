
import { Toaster } from "sonner";

// Settings for Sonner toast notifications
const SonnerToaster = () => {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: "'Sarabun', sans-serif",
        },
        className: "font-sarabun",
      }}
    />
  );
};

export default SonnerToaster;
