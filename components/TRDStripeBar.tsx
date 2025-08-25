import React from 'react';

export default function TRDStripeBar({ height = 8 }: { height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="grid h-full w-full grid-cols-3">
        <div className="bg-trd-blue" />
        <div className="bg-trd-orange" />
        <div className="bg-trd-yellow" />
      </div>
    </div>
  );
}
