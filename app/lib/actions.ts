'use server';
import { z } from 'zod'; //zod is a library for data validation
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});//this is the schema that will be used to validate the form data

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }); //this is the data that will be sent to the server
    const amountInCents = amount * 100; //this will convert the amount to cents
    const date = new Date().toISOString().split('T')[0]; //this will get the current date
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`; //this will insert the invoice data into the database

    revalidatePath('/dashboard/invoices'); //this will revalidate the invoices page, meaning that the page will be updated with the new invoice
    redirect('/dashboard/invoices'); //this will redirect the user to the invoices
} //this function will be used to create a new invoice

