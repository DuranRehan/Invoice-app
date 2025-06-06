import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Invoice, Client, AppSettings } from '../../types';

import interRegular from '../../fonts/Inter-Regular.ttf';
import interBold from '../../fonts/Inter-Bold.ttf';

Font.register({
  family: 'Inter',
  src: interRegular,
});
Font.register({
  family: 'Inter-Bold',
  src: interBold,
});

interface InvoicePDFProps {
  invoice: Invoice;
  client: Client;
  settings: AppSettings;
  formatCurrency: (amount: number) => string;
  fileName?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyInfo: {
    flex: 1,
  },
  companyLogo: {
    width: 48,
    height: 48,
    marginBottom: 8,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  invoiceDetails: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'right',
    lineHeight: 1.5,
  },
  clientSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontSize: 10,
  },
  description: { width: '40%' },
  quantity: { width: '15%', textAlign: 'right' },
  price: { width: '15%', textAlign: 'right' },
  tax: { width: '15%', textAlign: 'right' },
  amount: { width: '15%', textAlign: 'right' },
  summarySection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    fontSize: 10,
    marginVertical: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },


  subSummaryRow: {
    flexDirection: 'row',
    fontSize: 10,
    marginVertical: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,


  },

  summaryLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 8,
    fontFamily: 'Inter-Bold',
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
  },

  subSummaryValue: {
    width: 100,
    textAlign: 'right',
  },



  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
    textAlign: 'center',
  },

  footerTextTerm: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#27292e',
    marginBottom: 6,
    paddingBottom: 4,
    textAlign: 'center',
  },

  footerTextUrl: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
    textAlign: 'center',
  },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  client,
  settings,
  formatCurrency,
  fileName
}) => (
  <Document title={fileName || `${invoice.number}.pdf`}>
    <Page size="A4" style={styles.page}>

      <View style={styles.header}>
        <View style={styles.companyInfo}>
          {settings.company.logo && (
            <Image src={settings.company.logo} style={styles.companyLogo} />
          )}
          <Text style={styles.companyName}>{settings.company.name}</Text>
          <Text style={styles.companyDetails}>
            {settings.company.email}
            {'\n'}
            {settings.company.phone}
          </Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>{invoice.title || 'INVOICE'}</Text>
          <Text style={styles.invoiceDetails}>
            Invoice Number: {invoice.number}
            {'\n'}
            Invoice Date: {format(new Date(invoice.date), 'MMMM d, yyyy')}
            {'\n'}
            Due Date: {format(new Date(invoice.dueDate), 'MMMM d, yyyy')}
          </Text>
        </View>
      </View>

      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={styles.companyDetails}>
          {client.name}
          {'\n'}
          {client.address}, {client.city} {client.zipCode}
          {'\n'}
          {client.country}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.quantity}>Quantity</Text>
          <Text style={styles.price}>Unit Price</Text>
          {settings.taxEnabled && <Text style={styles.tax}>Tax Rate</Text>}
          <Text style={styles.amount}>Amount</Text>
        </View>

        {invoice.items?.length > 0 &&
          invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.price}>{formatCurrency(item.unitPrice)}</Text>
              {settings.taxEnabled && (
                <Text style={styles.tax}>{item.taxRate}%</Text>
              )}
              <Text style={styles.amount}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.subSummaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.subSummaryValue}>{formatCurrency(invoice.subtotal)}</Text>
        </View>
        {settings.taxEnabled && invoice.taxTotal > 0 && (
          <View style={styles.subSummaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.subSummaryValue}>{formatCurrency(invoice.taxTotal)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(invoice.total)}</Text>
        </View>
      </View>

      {(invoice.notes || invoice.terms) && (
        <View style={styles.footer}>
          {invoice.terms && (
            <Text style={styles.footerTextTerm}>{invoice.terms}</Text>
          )}
          {invoice.notes && (
            <Text style={styles.footerText}>{invoice.notes}</Text>
          )}
        </View>
      )}



      <View style={styles.footer}>
        <Text style={styles.footerTextUrl}>Thank you for your business!</Text>
        {settings.company.website && (
          <Text style={styles.footerTextUrl}>{settings.company.website}</Text>
        )}
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
