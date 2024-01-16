"use client"
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

type ThemeState = {
    theme: Themes;
}
type Action = {
    toggleTheme: () => void;
    updateTheme: (theme: Themes) => void;
}

export const useThemeStore = create<ThemeState & Action>((set, get) => ({
    theme: Themes.DARK,
    toggleTheme: () => set((state) => ({ theme: state.theme === Themes.DARK ? Themes.LIGHT : Themes.DARK })),
    updateTheme: (theme: Themes) => set(() => ({ theme: theme }))
}));

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('ThemeStore', useThemeStore);
}

