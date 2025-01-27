"use client";
import { useEffect, useState } from 'react';
import { fetchLatestInvoices } from '@/app/lib/data'; // Assume this function fetches invoices for a customer

export default function Page() {
  const [customerData, setCustomerData] = useState<{ owed: number; paid: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const invoices = await fetchLatestInvoices(); // Fetch invoices for the customer
        const owed = invoices.reduce((sum: any, invoice: { amount: any; }) => sum + invoice.amount, 0);
        const paid = invoices.reduce((sum: any, invoice: { amount: any; }) => sum + invoice.amount, 0);
        setCustomerData({ owed, paid });
      } catch (err) {
        console.error('Failed to fetch the latest invoices:', err);
        setError('Failed to fetch the latest invoices.');
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!customerData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Customer Page</h1>
      <p>Amount Owed: ${customerData.owed}</p>
      <p>Amount Paid: ${customerData.paid}</p>
    </div>
  );
}

