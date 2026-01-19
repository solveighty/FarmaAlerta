import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Farmacia } from '@/data/mockData';

const GOOGLE_APPS_SCRIPT_URL = process.env.EXPO_PUBLIC_GOOGLE_APPS_SCRIPT_URL || '';

interface FarmaciaContextType {
  activeFarmacia: Farmacia | null;
  allFarmacias: Farmacia[];
  registerFarmacia: (farmacia: Omit<Farmacia, 'id'>) => Promise<{ success: boolean; error?: string }>;
  setActiveFarmacia: (farmaciaId: string) => Promise<void>;
  logoutFarmacia: () => Promise<void>;
  getActiveFarmaciaName: () => string;
  getAllFarmacias: () => Farmacia[];
  loginFarmacia: (email: string, contraseña: string) => Promise<{ success: boolean; error?: string }>;
  updateFarmaciaPhoto: (photoUri: string) => Promise<void>;
}

const FarmaciaContext = createContext<FarmaciaContextType | undefined>(undefined);

export const FarmaciaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFarmacia, setActiveFarmaciaState] = useState<Farmacia | null>(null);
  const [allFarmacias, setAllFarmaciasState] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarmacias();
  }, []);

  const loadFarmacias = async () => {
    try {
      setLoading(true);

      // Cargar desde Google Apps Script
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
      const data = await response.json();

      // Si la respuesta es un objeto único, envolverlo en un array
      let farmacias: Farmacia[] = Array.isArray(data) ? data : [data];
      setAllFarmaciasState(farmacias);

      // Intentar cargar farmacia activa si existe
      const activeFarmaciaId = await AsyncStorage.getItem('activeFarmaciaId');
      if (activeFarmaciaId && farmacias.length > 0) {
        const active = farmacias.find(f => f.id === activeFarmaciaId);
        if (active) {
          setActiveFarmaciaState(active);
        }
      }
    } catch (error) {
      console.error('Error loading farmacias from Google Sheets:', error);
      setAllFarmaciasState([]);
    } finally {
      setLoading(false);
    }
  };

  const loginFarmacia = async (
    email: string,
    contraseña: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email.trim() || !contraseña.trim()) {
        return { success: false, error: 'Email y contraseña son requeridos' };
      }

      // Buscar farmacia por email y contraseña
      const farmacia = allFarmacias.find(
        f => f.email?.toLowerCase().trim() === email.toLowerCase().trim() &&
          f.contraseña === contraseña
      );

      if (farmacia) {
        await AsyncStorage.setItem('activeFarmaciaId', farmacia.id);
        setActiveFarmaciaState(farmacia);
        return { success: true };
      } else {
        return { success: false, error: 'Email o contraseña incorrectos' };
      }
    } catch (error) {
      console.error('Error login farmacia:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const registerFarmacia = async (
    farmacia: Omit<Farmacia, 'id'>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validar que el nombre no esté vacío
      if (!farmacia.nombre.trim()) {
        return { success: false, error: 'El nombre de la farmacia no puede estar vacío' };
      }

      // Validar que el nombre no sea duplicado (case-insensitive)
      const existe = allFarmacias.some(
        f => f.nombre.toLowerCase().trim() === farmacia.nombre.toLowerCase().trim()
      );

      if (existe) {
        return { success: false, error: 'Esta farmacia ya está registrada' };
      }

      // Crear nueva farmacia
      const newFarmacia: Farmacia = {
        ...farmacia,
        id: Date.now().toString(),
      };

      const updatedFarmacias = [...allFarmacias, newFarmacia];
      setAllFarmaciasState(updatedFarmacias);

      await AsyncStorage.setItem('activeFarmaciaId', newFarmacia.id);
      setActiveFarmaciaState(newFarmacia);

      return { success: true };
    } catch (error) {
      console.error('Error registering farmacia:', error);
      return { success: false, error: 'Error al registrar farmacia' };
    }
  };

  const setActiveFarmacia = async (farmaciaId: string) => {
    try {
      const farmacia = allFarmacias.find(f => f.id === farmaciaId);
      if (farmacia) {
        await AsyncStorage.setItem('activeFarmaciaId', farmaciaId);
        setActiveFarmaciaState(farmacia);
      }
    } catch (error) {
      console.error('Error setting active farmacia:', error);
    }
  };

  const logoutFarmacia = async () => {
    try {
      await AsyncStorage.removeItem('activeFarmaciaId');
      setActiveFarmaciaState(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getActiveFarmaciaName = () => {
    return activeFarmacia?.nombre || 'Farmacia';
  };

  const getAllFarmacias = () => {
    return allFarmacias;
  };

  const updateFarmaciaPhoto = async (photoUri: string) => {
    try {
      if (!activeFarmacia) {
        console.error('No active farmacia');
        return;
      }

      // Subir foto a imgbb
      const formData = new FormData();
      formData.append('image', { uri: photoUri, type: 'image/jpeg', name: 'farmacia-photo.jpg' } as any);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const imgbbData = await imgbbResponse.json();
      const photoUrl = imgbbData.data.url;

      // Actualizar en Google Sheets
      const updateResponse = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateFoto',
          email: activeFarmacia.email,
          urlFoto: photoUrl,
        }),
      });

      const result = await updateResponse.json();
      if (result.success) {
        // Actualizar el estado local
        const updatedFarmacia = { ...activeFarmacia, urlFoto: photoUrl };
        setActiveFarmaciaState(updatedFarmacia);

        // Actualizar en la lista de farmacias
        setAllFarmaciasState(
          allFarmacias.map(f => f.id === activeFarmacia.id ? updatedFarmacia : f)
        );

        // Guardar en AsyncStorage
        await AsyncStorage.setItem('activeFarmaciaId', activeFarmacia.id);
      }
    } catch (error) {
      console.error('Error updating farmacia photo:', error);
    }
  };

  return (
    <FarmaciaContext.Provider
      value={{
        activeFarmacia,
        allFarmacias,
        registerFarmacia,
        setActiveFarmacia,
        logoutFarmacia,
        getActiveFarmaciaName,
        getAllFarmacias,
        loginFarmacia,
        updateFarmaciaPhoto,
      }}
    >
      {children}
    </FarmaciaContext.Provider>
  );
};

export const useFarmacia = () => {
  const context = useContext(FarmaciaContext);
  if (!context) {
    throw new Error('useFarmacia must be used within a FarmaciaProvider');
  }
  return context;
};
