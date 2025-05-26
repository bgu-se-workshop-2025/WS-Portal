import React, { useState, useEffect } from 'react';
import { getStore } from '../../../sdk/modules/store/publicStore';
import { sdk } from '../../../sdk/sdk';
import TransactionList from './TransactionList';
import { TransactionViewProps } from './TransactionView';

enum TransactionPageType {
    STORE = 'store',
    USER = 'user'
}

interface TransactionPageProps {
    id: string;
    pageType: TransactionPageType;
}

const TransactionPage: React.FC<TransactionPageProps> = ({ id, pageType }) => {
  const [transactions, setTransactions] = useState<TransactionViewProps[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = pageType === TransactionPageType.STORE
          ? await sdk.getStoreOrders(id, { page: 0, size: 10 })
          : await sdk.getUserOrders({ page: 0, size: 10 });

        const mappedOrders: TransactionViewProps[] = orders.map((order: any) => ({
          buyerName: order.buyer?.name || 'Unknown Buyer',
          dateTime: order.createdAt,
          paymentDetails: {
            payerName: order.payment?.payerName || 'Unknown Payer',
            payerEmail: order.payment?.payerEmail || 'Unknown Email',
            paymentMethod: order.payment?.paymentMethod,
            externalId: order.payment?.externalId || 'N/A',
          },
          shippingAddress: {
            country: order.shipping?.country || 'Unknown Country',
            city: order.shipping?.city || 'Unknown City',
            region: order.shipping?.region,
            street: order.shipping?.street || 'Unknown Street',
            zipCode: order.shipping?.zipCode || '00000',
            homeNumber: order.shipping?.homeNumber || '0',
            apartmentNumber: order.shipping?.apartmentNumber,
            mailbox: order.shipping?.mailbox,
          },
        }));

        setTransactions(mappedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [id, pageType]);

  return (
    <TransactionList transactions={transactions} />
  );
};

export default TransactionPage;