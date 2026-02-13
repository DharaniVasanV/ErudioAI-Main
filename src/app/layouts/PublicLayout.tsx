import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold text-indigo-900">ErudioAI</span>
         </div>
      </header>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};