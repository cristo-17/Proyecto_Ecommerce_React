// src/infrastructure/payments/payuService.ts

export interface PayUCheckoutParams {
  amount: string;
  buyerEmail: string;
  referenceCode: string;
  buyerFullName: string;
  payerPhone: string;
  payerDNI: string;
  signature: string; // Ahora viene del backend
}

const PAYU_URL = "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/";

export const processPayUCheckout = async ({
  amount,
  buyerEmail,
  referenceCode,
  buyerFullName,
  payerPhone,
  payerDNI,
  signature,
}: PayUCheckoutParams): Promise<void> => {
  // Los valores merchantId, accountId también deberían venir del backend en un entorno real,
  // pero como no son secretos, podemos mantenerlos aquí o recibirlos también.
  const merchantId = "508029";
  const accountId = "512323";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = PAYU_URL;

  const payuParams: Record<string, string> = {
    merchantId,
    accountId,
    description: "Compra en AppCelulares",
    referenceCode,
    amount,
    tax: "0",
    taxReturnBase: "0",
    currency: "PEN",
    signature, // Usamos la firma recibida del backend
    test: "1",
    buyerEmail,
    buyerFullName,
    payerEmail: buyerEmail,
    payerFullName: buyerFullName,
    buyerDocumentType: "DNI",
    buyerDocument: payerDNI,
    payerDocumentType: "DNI",
    payerDocument: payerDNI,
    payerPhone: payerPhone,
    payerMobilePhone: payerPhone,
    billingCountry: "PE",
    responseUrl: window.location.origin + "/factura/" + referenceCode,
  };

  Object.entries(payuParams).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
