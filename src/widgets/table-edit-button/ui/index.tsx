'use client';

import { ModalContext } from '@/shared';
import { FC, ReactNode, useState } from 'react';

export const TableEditButton: FC<{
    children: ReactNode;
    name: string;
    isNew?: boolean;
}> = ({ children, name = 'User', isNew = false }) => {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <ModalContext.Provider value={close}>
            <button
                onClick={() => setOpen(true)}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
                {isNew ? 'Add' : 'Edit'}
            </button>
            {open && (
                <div
                    className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
                    onClick={close}
                >
                    <div
                        className="relative p-4 w-full max-w-2xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between px-4 pt-4 md:px-5 md:pt-5">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isNew ? 'Add' : 'Edit'} {name}
                                </h3>
                                <button
                                    type="button"
                                    onClick={close}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
