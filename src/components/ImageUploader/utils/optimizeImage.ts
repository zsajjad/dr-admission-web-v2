const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const INITIAL_QUALITY = 0.9;
const QUALITY_STEP = 0.1;
const MIN_QUALITY = 0.1;

/**
 * Optimizes an image file to be under the specified max size (default 2MB)
 * Uses canvas to resize and compress the image
 */
export const optimizeImage = async (file: File, maxSize: number = MAX_FILE_SIZE): Promise<File> => {
  // If already under max size, return as-is
  if (file.size <= maxSize) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = 2048;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try to compress with decreasing quality until under max size
      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            if (blob.size <= maxSize || quality <= MIN_QUALITY) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              // Try again with lower quality
              tryCompress(quality - QUALITY_STEP);
            }
          },
          'image/jpeg',
          quality,
        );
      };

      tryCompress(INITIAL_QUALITY);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Converts a data URL to a File object
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File | null => {
  const arr = dataUrl.split(',');
  if (arr.length < 2) {
    return null;
  }

  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    return null;
  }

  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
