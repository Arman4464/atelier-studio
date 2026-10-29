// src/pages/Home.tsx
import React from 'react';
import { Hero } from '../components/home/Hero';
import { KeyPieces } from '../components/home/KeyPieces';
import { Manifesto } from '../components/home/Manifesto';
import { Newsletter } from '../components/home/Newsletter';

export const Home: React.FC = () => {
  return (
    <main className="min-h-screen space-y-8 pb-20">
      <Hero />
      <KeyPieces />
      <Manifesto />
      <Newsletter />
    </main>
  );
};

export default Home;
