import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { AppSettings, Currency } from '../types';
import { se } from 'date-fns/locale';

const Settings: React.FC = () => {
  const { settings, updateSettings, availableCurrencies } = useAppContext();

  if (!settings) {
    return <div className="p-4 text-red-500">Settings not found. Please initialize your settings.</div>;
  }
  // Initialize data WITH A void company object








  const [formData, setFormData] = useState<AppSettings>({ ...settings });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [name]: value,
      },
    }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currencyCode = e.target.value;
    const currency = availableCurrencies.find(c => c.code === currencyCode) || availableCurrencies[0];

    setFormData(prev => ({
      ...prev,
      currency,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Settings saved successfully!');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-end mb-4">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Company Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-name">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company-name"
                  name="name"
                  value={formData.company.name}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-logo">
                  Logo URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="company-logo"
                    name="logo"
                    value={formData.company.logo}
                    onChange={handleCompanyChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                {formData.company.logo && (
                  <div className="mt-2">
                    <img
                      src={formData.company.logo}
                      alt="Company Logo"
                      className="h-12 w-12 object-contain rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-email">
                  Email
                </label>
                <input
                  type="email"
                  id="company-email"
                  name="email"
                  value={formData.company.email}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="company-phone"
                  name="phone"
                  value={formData.company.phone}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-website">
                  Website
                </label>
                <input
                  type="url"
                  id="company-website"
                  name="website"
                  value={formData.company.website}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-taxId">
                  Tax ID / Business Number
                </label>
                <input
                  type="text"
                  id="company-taxId"
                  name="taxId"
                  value={formData.company.taxId}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Company Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-address">
                  Street Address
                </label>
                <input
                  type="text"
                  id="company-address"
                  name="address"
                  value={formData.company.address}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-city">
                  City
                </label>
                <input
                  type="text"
                  id="company-city"
                  name="city"
                  value={formData.company.city}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-state">
                  State / Province
                </label>
                <input
                  type="text"
                  id="company-state"
                  name="state"
                  value={formData.company.state}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-zipCode">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="company-zipCode"
                  name="zipCode"
                  value={formData.company.zipCode}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="company-country">
                  Country
                </label>
                <input
                  type="text"
                  id="company-country"
                  name="country"
                  value={formData.company.country}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Invoice Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  value={formData.currency.code}
                  onChange={handleCurrencyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {availableCurrencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <p className="text-sm text-gray-600">
                    This is how amounts will appear on your invoices:
                  </p>
                  <p className="text-lg font-medium mt-2">
                    {formData.currency.position === 'before'
                      ? `${formData.currency.symbol}1,234${formData.currency.decimalPlaces > 0 ? '.' + '0'.repeat(formData.currency.decimalPlaces) : ''}`
                      : `1,234${formData.currency.decimalPlaces > 0 ? '.' + '0'.repeat(formData.currency.decimalPlaces) : ''}${formData.currency.symbol}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="taxEnabled"
                  name="taxEnabled"
                  checked={formData.taxEnabled}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="taxEnabled" className="ml-2 block text-sm text-gray-900">
                  Enable Tax Calculation
                </label>
              </div>

              {formData.taxEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="defaultTaxRate">
                    Default Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="defaultTaxRate"
                    name="defaultTaxRate"
                    min="0"
                    step="0.1"
                    value={formData.defaultTaxRate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="paymentTerms">
                  Default Payment Terms (days)
                </label>
                <input
                  type="number"
                  id="paymentTerms"
                  name="paymentTerms"
                  min="0"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Invoice Numbering</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="invoiceNumberPrefix">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  id="invoiceNumberPrefix"
                  name="invoiceNumberPrefix"
                  value={formData.invoiceNumberPrefix}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="invoiceNumberCounter">
                  Next Invoice Number
                </label>
                <input
                  type="number"
                  id="invoiceNumberCounter"
                  name="invoiceNumberCounter"
                  min="1"
                  value={formData.invoiceNumberCounter}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="invoiceNumberSuffix">
                  Invoice Number Suffix (optional)
                </label>
                <input
                  type="text"
                  id="invoiceNumberSuffix"
                  name="invoiceNumberSuffix"
                  value={formData.invoiceNumberSuffix}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <p className="text-sm text-gray-600">
                  Your next invoice will be numbered:
                </p>
                <p className="text-lg font-medium mt-2">
                  {formData.invoiceNumberPrefix}{formData.invoiceNumberCounter}{formData.invoiceNumberSuffix}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            icon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;