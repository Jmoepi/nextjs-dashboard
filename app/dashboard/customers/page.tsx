// "use client";
// import { useEffect, useState } from 'react';
// import { fetchLatestInvoices } from '@/app/lib/data'; // Assume this function fetches invoices for a customer

// export default function Page() {
//   const [customerData, setCustomerData] = useState<{ owed: number; paid: number } | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const invoices = await fetchLatestInvoices(); // Fetch invoices for the customer
//         const owed = invoices.reduce((sum: any, invoice: { amount: any; }) => sum + invoice.amount, 0);
//         const paid = invoices.reduce((sum: any, invoice: { amount: any; }) => sum + invoice.amount, 0);
//         setCustomerData({ owed, paid });
//       } catch (err) {
//         console.error('Failed to fetch the latest invoices:', err);
//         setError('Failed to fetch the latest invoices.');
//       }
//     }
//     fetchData();
//   }, []);

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!customerData) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <h1>Customer Page</h1>
//       <p>Amount Owed: ${customerData.owed}</p>
//       <p>Amount Paid: ${customerData.paid}</p>
//     </div>
//   );
// }

//import { Customer } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import Image from 'next/image';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import FormattedCustomersTable from '@/app/ui/customers/table';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { fetchFilteredCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Customers',
};

export async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const customers = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
      </div>
      <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
       
      </Suspense>
    </div>
  );
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_pending: number;
  total_paid: number;
}
export default async function CustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <Image
                      src={customer.image_url}
                      alt={`${customer.name}'s profile picture`}
                      className="mr-2 rounded-full"
                      width={28}
                      height={28}
                    />
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Owed</p>
                    <p className="font-medium">{formatCurrency(customer.total_pending)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="font-medium">{formatCurrency(customer.total_paid)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Pending
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {customers?.map((customer) => (
                <tr
                  key={customer.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={customer.image_url}
                        alt={`${customer.name}'s profile picture`}
                        className="rounded-full"
                        width={28}
                        height={28}
                      />
                      <p>{customer.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(customer.total_pending)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(customer.total_paid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

