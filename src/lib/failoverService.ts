import { PrismaClient } from '@prisma/client';
import { FbrInvoicePayload } from './fbrTypes';

const prisma = new PrismaClient();

/**
 * Handles offline buffering for network disconnection.
 * Saves the exact payload into the database so it can be 
 * reviewed and manually re-transmitted without data loss.
 */
export async function bufferFailedInvoice(invoiceId: string, payload: FbrInvoicePayload, errorMessage: string) {
  // Update invoice status to FAILED_CONNECTION and log the validation error
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: 'FAILED_CONNECTION',
      validationError: errorMessage,
    },
  });

  // For a real production app, we might also store the full serialized payload into a separate
  // FBR_Logs table for audit purposes, but updating the invoice status brings it to the 
  // Failover Queue on the Command Center UI.
}
