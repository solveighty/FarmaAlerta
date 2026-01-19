import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Cliente {
  id: string;
  nombre: string;
  fechaRegistro: string;
}

interface UserContextType {
  activeClient: Cliente | null;
  allClientes: Cliente[];
  registerCliente: (nombre: string) => Promise<{ success: boolean; error?: string }>;
  setActiveClient: (clientId: string) => Promise<void>;
  logoutCliente: () => Promise<void>;
  getActiveClientName: () => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeClient, setActiveClientState] = useState<Cliente | null>(null);
  const [allClientes, setAllClientesState] = useState<Cliente[]>([]);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const clientesData = await AsyncStorage.getItem('clientes');
      const activeClientId = await AsyncStorage.getItem('activeClientId');

      let clientes: Cliente[] = [];
      if (clientesData) {
        clientes = JSON.parse(clientesData);
      }

      setAllClientesState(clientes);

      if (activeClientId && clientes.length > 0) {
        const active = clientes.find(c => c.id === activeClientId);
        if (active) {
          setActiveClientState(active);
        }
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const registerCliente = async (nombre: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validar que el nombre no esté vacío
      if (!nombre.trim()) {
        return { success: false, error: 'El nombre no puede estar vacío' };
      }

      // Validar que el nombre no sea duplicado (case-insensitive)
      const existe = allClientes.some(
        c => c.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
      );

      if (existe) {
        return { success: false, error: 'Este nombre de cliente ya está registrado' };
      }

      // Crear nuevo cliente
      const newCliente: Cliente = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        fechaRegistro: new Date().toISOString().split('T')[0],
      };

      const updatedClientes = [...allClientes, newCliente];

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('clientes', JSON.stringify(updatedClientes));
      await AsyncStorage.setItem('activeClientId', newCliente.id);

      // Actualizar estado
      setAllClientesState(updatedClientes);
      setActiveClientState(newCliente);

      return { success: true };
    } catch (error) {
      console.error('Error registering cliente:', error);
      return { success: false, error: 'Error al registrar cliente' };
    }
  };

  const setActiveClient = async (clientId: string) => {
    try {
      const cliente = allClientes.find(c => c.id === clientId);
      if (cliente) {
        await AsyncStorage.setItem('activeClientId', clientId);
        setActiveClientState(cliente);
      }
    } catch (error) {
      console.error('Error setting active client:', error);
    }
  };

  const logoutCliente = async () => {
    try {
      await AsyncStorage.removeItem('activeClientId');
      setActiveClientState(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getActiveClientName = () => {
    return activeClient?.nombre || 'Usuario';
  };

  return (
    <UserContext.Provider
      value={{
        activeClient,
        allClientes,
        registerCliente,
        setActiveClient,
        logoutCliente,
        getActiveClientName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
