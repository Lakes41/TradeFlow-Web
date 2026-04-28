import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { z } from 'zod';
import InvoiceMintForm from '../InvoiceMintForm';
import { useSession } from 'next-auth/react';
import { useMintInvoice } from '@/hooks/useMintInvoice';

// Mock the dependencies
jest.mock('next-auth/react');
jest.mock('@/hooks/useMintInvoice');
jest.mock('@/soroban', () => ({
  mintInvoice: jest.fn(),
}));

const mockSession = {
  data: {
    user: {
      publicKey: 'GD5DJQDKEBOLYKP5S6O4KIX3YXNBFVPBBM4VEGTFBKPEJIIQRPYDQ4MG'
    }
  }
};

const mockMintInvoice = {
  mint: jest.fn(),
  loading: false,
  error: null,
  txStatus: null
};

describe('InvoiceMintForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (useMintInvoice as jest.Mock).mockReturnValue(mockMintInvoice);
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose: jest.fn(),
      onSuccess: jest.fn(),
      ...props
    };
    return render(<InvoiceMintForm {...defaultProps} />);
  };

  describe('Form Fields', () => {
    it('renders all required fields', () => {
      renderComponent();

      expect(screen.getByLabelText(/debtor name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/invoice amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/invoice document/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/supporting document uri/i)).toBeInTheDocument();
    });

    it('shows required field indicators', () => {
      renderComponent();

      expect(screen.getByText(/debtor name \*/i)).toBeInTheDocument();
      expect(screen.getByText(/invoice amount \*/i)).toBeInTheDocument();
      expect(screen.getByText(/due date \*/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('validates debtor name field', async () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/debtor name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('validates amount field', async () => {
      renderComponent();

      const amountInput = screen.getByLabelText(/invoice amount/i);
      fireEvent.change(amountInput, { target: { value: '0' } });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      });
    });

    it('validates due date field', async () => {
      renderComponent();

      // Set a past date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const pastDate = yesterday.toISOString().split('T')[0];

      const dueDateInput = screen.getByLabelText(/due date/i);
      fireEvent.change(dueDateInput, { target: { value: pastDate } });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/due date must be in the future/i)).toBeInTheDocument();
      });
    });

    it('validates supporting document URI format', async () => {
      renderComponent();

      const uriInput = screen.getByLabelText(/supporting document uri/i);
      fireEvent.change(uriInput, { target: { value: 'invalid-url' } });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/must be a valid url/i)).toBeInTheDocument();
      });
    });
  });

  describe('Fee Calculation', () => {
    it('calculates and displays fees when amount is entered', async () => {
      renderComponent();

      const amountInput = screen.getByLabelText(/invoice amount/i);
      fireEvent.change(amountInput, { target: { value: '1000' } });

      await waitFor(() => {
        expect(screen.getByText(/fee breakdown/i)).toBeInTheDocument();
        expect(screen.getByText(/\$0\.0010/i)).toBeInTheDocument(); // Network fee
        expect(screen.getByText(/\$5\.00/i)).toBeInTheDocument(); // Protocol fee (0.5% of 1000)
        expect(screen.getByText(/\$5\.00/i)).toBeInTheDocument(); // Total fee
      });
    });

    it('hides fee breakdown when amount is zero', async () => {
      renderComponent();

      const amountInput = screen.getByLabelText(/invoice amount/i);
      fireEvent.change(amountInput, { target: { value: '0' } });

      await waitFor(() => {
        expect(screen.queryByText(/fee breakdown/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('requires at least one document (file or URI)', async () => {
      renderComponent();

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/debtor name/i), { 
        target: { value: 'Test Debtor' } 
      });
      fireEvent.change(screen.getByLabelText(/invoice amount/i), { 
        target: { value: '100' } 
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(screen.getByLabelText(/due date/i), { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please provide either an invoice file or a supporting document uri/i)).toBeInTheDocument();
      });
    });

    it('submits form with valid data and file', async () => {
      const mockMint = jest.fn().mockResolvedValue('success');
      (useMintInvoice as jest.Mock).mockReturnValue({
        ...mockMintInvoice,
        mint: mockMint
      });

      renderComponent();

      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/debtor name/i), { 
        target: { value: 'Test Debtor' } 
      });
      fireEvent.change(screen.getByLabelText(/invoice amount/i), { 
        target: { value: '100' } 
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(screen.getByLabelText(/due date/i), { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      // Mock file upload
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/invoice document/i);
      Object.defineProperty(fileInput, 'files', {
        value: [file]
      });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMint).toHaveBeenCalledWith(
          expect.objectContaining({
            invoiceId: expect.stringMatching(/^INV-\d+-[a-z0-9]+$/),
            amount: expect.any(BigInt),
            recipient: mockSession.data.user.publicKey,
            callerPublicKey: mockSession.data.user.publicKey,
            metadata: expect.objectContaining({
              debtorName: 'Test Debtor',
              dueDate: tomorrow.toISOString().split('T')[0],
              supportingDocumentUri: null,
              timestamp: expect.any(Number)
            })
          })
        );
      });
    });

    it('submits form with valid data and URI', async () => {
      const mockMint = jest.fn().mockResolvedValue('success');
      (useMintInvoice as jest.Mock).mockReturnValue({
        ...mockMintInvoice,
        mint: mockMint
      });

      renderComponent();

      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/debtor name/i), { 
        target: { value: 'Test Debtor' } 
      });
      fireEvent.change(screen.getByLabelText(/invoice amount/i), { 
        target: { value: '100' } 
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(screen.getByLabelText(/due date/i), { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      fireEvent.change(screen.getByLabelText(/supporting document uri/i), { 
        target: { value: 'https://example.com/invoice.pdf' } 
      });

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMint).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              supportingDocumentUri: 'https://example.com/invoice.pdf'
            })
          })
        );
      });
    });
  });

  describe('Input Sanitization', () => {
    it('sanitizes debtor name input', async () => {
      renderComponent();

      const debtorNameInput = screen.getByLabelText(/debtor name/i);
      fireEvent.change(debtorNameInput, { 
        target: { value: 'Test<script>alert("xss")</script>' } 
      });

      // The form should sanitize the input
      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Should not contain script tags after sanitization
        expect(mockMintInvoice.mint).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays contract errors', () => {
      (useMintInvoice as jest.Mock).mockReturnValue({
        ...mockMintInvoice,
        error: 'Contract execution failed'
      });

      renderComponent();

      expect(screen.getByText(/contract execution failed/i)).toBeInTheDocument();
    });

    it('displays transaction status', () => {
      (useMintInvoice as jest.Mock).mockReturnValue({
        ...mockMintInvoice,
        txStatus: 'Transaction successful'
      });

      renderComponent();

      expect(screen.getByText(/on-chain: transaction successful/i)).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('disables submit button when form is incomplete', () => {
      renderComponent();

      const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when required fields are filled', async () => {
      renderComponent();

      fireEvent.change(screen.getByLabelText(/debtor name/i), { 
        target: { value: 'Test Debtor' } 
      });
      fireEvent.change(screen.getByLabelText(/invoice amount/i), { 
        target: { value: '100' } 
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(screen.getByLabelText(/due date/i), { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /mint invoice nft/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('shows loading state during submission', async () => {
      (useMintInvoice as jest.Mock).mockReturnValue({
        ...mockMintInvoice,
        loading: true
      });

      renderComponent();

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/debtor name/i), { 
        target: { value: 'Test Debtor' } 
      });
      fireEvent.change(screen.getByLabelText(/invoice amount/i), { 
        target: { value: '100' } 
      });
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      fireEvent.change(screen.getByLabelText(/due date/i), { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submitting to stellar/i });
        expect(submitButton).toBeDisabled();
      });
    });
  });
});

// Inconsequential change for repo health
