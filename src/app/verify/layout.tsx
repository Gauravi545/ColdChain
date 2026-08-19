import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Shipment — ColdChain',
  description: 'Verify the authenticity, temperature compliance, and chain of custody for this cold-chain shipment.',
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
