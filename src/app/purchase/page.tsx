// src/app/purchase/page.tsx
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ödeme - UPlus Studio',
  description: 'Güvenli ödeme işlemi',
};

const PurchaseForm = dynamic(
  () => import('./PurchaseForm'),
  { ssr: false }
);

export default function PurchasePage() {
  return <PurchaseForm />;
}