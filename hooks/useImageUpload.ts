import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY || '';

interface UploadResult {
  url: string | null;
  loading: boolean;
  error: string | null;
}

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Error al seleccionar imagen');
      return null;
    }
  };

  const uploadToImgbb = async (imageAsset: ImagePicker.ImagePickerAsset): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      // En React Native, FormData.append puede recibir un objeto con uri
      formData.append('image', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: `product-${Date.now()}.jpg`,
      } as any);
      
      formData.append('key', IMGBB_API_KEY);

      const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();

      if (data.success) {
        console.log('✅ Imagen subida:', data.data.url);
        setLoading(false);
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Error al subir imagen');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error uploading to imgbb:', err);
      setError(errorMsg);
      setLoading(false);
      return null;
    }
  };

  const selectAndUpload = async (): Promise<string | null> => {
    const imageAsset = await pickImage();
    if (!imageAsset) return null;

    return uploadToImgbb(imageAsset);
  };

  return {
    selectAndUpload,
    pickImage,
    uploadToImgbb,
    loading,
    error,
  };
};
