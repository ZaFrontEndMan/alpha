import { create } from 'zustand';
import type { SiteData } from './data';

interface SiteDataStore {
  // Data state
  data: SiteData | null;
  initialData: SiteData | null;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  saveMessage: string;
  
  // Actions
  setData: (data: SiteData) => void;
  setInitialData: (data: SiteData) => void;
  updateData: (updates: Partial<SiteData>) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setSaveMessage: (message: string) => void;
  discardChanges: () => void;
  saveChanges: () => Promise<void>;
  fetchData: () => Promise<void>;
}

export const useSiteDataStore = create<SiteDataStore>((set, get) => ({
  data: null,
  initialData: null,
  isLoading: true,
  isSaving: false,
  hasChanges: false,
  saveMessage: '',
  
  setData: (data) => {
    const { initialData } = get();
    set({ 
      data,
      hasChanges: initialData ? JSON.stringify(data) !== JSON.stringify(initialData) : false
    });
  },
  
  setInitialData: (data) => set({ initialData: data, data, hasChanges: false }),
  
  updateData: (updates) => {
    const currentData = get().data;
    if (!currentData) return;
    
    const newData = { ...currentData, ...updates };
    get().setData(newData);
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setSaveMessage: (message) => set({ saveMessage: message }),
  
  discardChanges: () => {
    const { initialData } = get();
    if (initialData) {
      set({ data: initialData, hasChanges: false, saveMessage: '' });
    }
  },
  
  saveChanges: async () => {
    const { data, setSaving, setSaveMessage, setInitialData } = get();
    if (!data) return;
    
    setSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/landing-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      setInitialData(data);
      setSaveMessage('✓ Changes saved successfully!');
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('✕ Failed to save changes');
    } finally {
      setSaving(false);
    }
  },
  
  fetchData: async () => {
    const { setLoading, setInitialData } = get();
    setLoading(true);
    
    try {
      const response = await fetch('/api/landing-data');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setInitialData(data);
    } catch (error) {
      console.error('Error fetching site data:', error);
    } finally {
      setLoading(false);
    }
  },
}));
