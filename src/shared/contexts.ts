'use client';

import { createContext, useContext } from 'react';

export const ModalContext = createContext<(() => void) | null>(null);

export const useModalContext = () => {
    return useContext(ModalContext);
};
