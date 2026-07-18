// src/infrastructure/payments/payuService.ts
import CryptoJS from "crypto-js";

export interface PayUCheckoutParams {
  amount: string;
  buyerEmail: string;
  referenceCode: string;
  buyerFullName: string;
  payerPhone: string;
  payerDNI: string;
}

// Credenciales y Configuración PayU (Hardcoded para Pruebas)
const merchantId = "508029";
const accountId = "512323";
const apiKey = "4Vj8eK4rloUd272L48hsrarnUA";
const PAYU_URL = "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/";

export const processPayUCheckout = async ({
  amount,
  buyerEmail,
  referenceCode,
  buyerFullName,
  payerPhone,
  payerDNI,
}: PayUCheckoutParams): Promise<void> => {
  // Cálculo de firma MD5 según requerimientos de PayU
  const signatureString = `${apiKey}~${merchantId}~${referenceCode}~${amount}~PEN`;
  const signature = CryptoJS.MD5(signatureString).toString();

  // Creación dinámica del formulario oculto
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
    signature,
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

  // Agregar al DOM, enviar y limpiar
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
