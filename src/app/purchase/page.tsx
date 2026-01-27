// src/app/purchase/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ödeme - UPlus Studio',
  description: 'Güvenli ödeme işlemi',
};

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Import the client component directly
import PurchaseForm from './PurchaseForm';

export default function PurchasePage() {
  return <PurchaseForm />;
}