import type { OwnerProperty } from '@/data/partnerHub';

/**
 * Hook for managing owner properties in localStorage
 * Each owner's properties are stored separately using their email as key
 */
export function useOwnerProperties(ownerId: string) {
  const getProperties = (): OwnerProperty[] => {
    try {
      const data = localStorage.getItem(`ownerProperties_${ownerId}`);
      if (!data) return [];
      const properties = JSON.parse(data);
      return Array.isArray(properties) ? properties : [];
    } catch (error) {
      console.error('Error reading properties:', error);
      return [];
    }
  };

  const addProperty = (prop: Omit<OwnerProperty, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const properties = getProperties();
      const newProp: OwnerProperty = {
        ...prop,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      properties.push(newProp);
      localStorage.setItem(`ownerProperties_${ownerId}`, JSON.stringify(properties));
      return newProp;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const updateProperty = (id: string, updates: Partial<Omit<OwnerProperty, 'id' | 'ownerId' | 'createdAt'>>) => {
    try {
      const properties = getProperties();
      const index = properties.findIndex((p) => p.id === id);
      if (index < 0) {
        throw new Error('Property not found');
      }
      properties[index] = { ...properties[index], ...updates, updatedAt: new Date() };
      localStorage.setItem(`ownerProperties_${ownerId}`, JSON.stringify(properties));
      return properties[index];
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const deleteProperty = (id: string) => {
    try {
      let properties = getProperties();
      properties = properties.filter((p) => p.id !== id);
      localStorage.setItem(`ownerProperties_${ownerId}`, JSON.stringify(properties));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  return { getProperties, addProperty, updateProperty, deleteProperty };
}
