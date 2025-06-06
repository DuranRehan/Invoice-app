import 'react-i18next';

declare module 'react-i18next' {
  interface Resources {
    translation: {
      layout: {
        dashboard: string;
        create_invoice: string;
        edit_invoice: string;
        view_invoice: string;
        invoices: string;
        add_client: string;
        edit_client: string;
        clients: string;
        settings: string;
      };
      dashboard: {
        new_invoice: string;
        add_client: string;
        paid_invoice: string;
        pending_invoice: string;
        overdue_invoice: string;
        total_invoices: string;
        recent_invoices: string;
        view_all_invoices: string;
        summary: string;
        client_label: string;
        invoice_label: string;
        invoice_status: string;
        paid_label: string;
        pending_label: string;
        overdue_label: string;
      };
    };
  }
}
