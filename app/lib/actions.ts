'use server';
import { z } from 'zod'; //zod is a library for data validation
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`; //this will insert the invoice data into the database

  } //this will try to insert the invoice data into the database
  catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  } //this will catch any errors that occur during the insertion of the invoice data
  revalidatePath('/dashboard/invoices'); //this will revalidate the invoices page, meaning that the page will be updated with the new invoice
  redirect('/dashboard/invoices'); //this will redirect the user to the invoices
} //this function will be used to create a new invoice

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    // We'll log the error to the console for now
    console.error(error);
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
} //this function will be used to delete an invoice

export async function editInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
} //this authenticate function will be used to authenticate the user and sign them in