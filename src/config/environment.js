// src/config/environment.js

/**
 * Configuración de entornos para la integración con Dynamics 365
 *
 * AMBIENTE: QA
 * Usuario de Aplicación: Dyn365WebApiQAMetroTest
 * Cuenta: user003dynamics@test.cl
 * Secreto ID: cc81f5bc-2db9-4e13-a61e-f99ace86a242
 * Secreto Name: Dyn365WebApiQAMetroSantiago
 */

const ENVIRONMENTS = {
  QA: {
    name: 'QA',
    apiBaseUrl: 'https://qa-dynamics-func-metro-b7c4h5b0dwfmg3ep.eastus2-01.azurewebsites.net',
    endpoints: {
      contact: '/api/Contacto',
      incident: '/api/IncidentCreate',
      event: '/api/EventCreate',
    },
    // Código de función (Function Key)
    functionCode: {
      contact: 'N3XY6D25l9Glfxm3_gd3B_y8XVXUbcMPf75R6iW18ufjAzFu0SCuOA==',
      incident: 'tH6FMZ2eYC74YTt1yROkTB08mCGaxGPrKtfrRZwsYHKbAzFuFEdMjw==',
      event: 'WdSitDWvFX9KA6TeLQpjYNunz5aWk6kmZv0WY9yOmUfiAzFuhlFH0g==',
    },

    // Configuración OAuth 2.0
    oauth: {
      enabled: true,
      // Estos valores se obtienen desde Azure AD
      clientId: 'cc81f5bc-2db9-4e13-a61e-f99ace86a242',
      secretName: 'Dyn365WebApiQAMetroSantiago',
      // El scope y authority dependerán de la configuración de Azure AD
      scope: 'https://[tenant].crm.dynamics.com/.default',
      authority: 'https://login.microsoftonline.com/[tenant-id]',
    },

    // Configuración de timeout
    timeout: 30000, // 30 segundos

    // Usuario de prueba
    testAccount: 'user003dynamics@metropago.cl',
  },

  DEV: {
    name: 'DEV',
    apiBaseUrl: 'https://dev-dynamics-func-metro-ckfxg7ffghb2cway.eastus2-01.azurewebsites.net', // Configurar cuando esté disponible
    endpoints: {
      contact: '/api/Contacto',
      incident: '/api/IncidentCreate',
      event: '/api/EventCreate',
    },
    functionCode: {
      contact: 'LedCu-yLmj5hptI3ysGE1AnfPUlGtKUnyPylUfkl51a0AzFuey4ISg==',
      incident: 'qSKnxKTk6iHlZO2IRS2NC6Hv_BEk4OtAqxmd-fnQjD86AzFuKr--2A==',
      event: '-zewsZmuVWp9gpAhH8kJ3ufavCN7_22GpOAf4m6E_Az1AzFuo5uqpQ==',
    },
    oauth: {
      enabled: true,
      // Estos valores se obtienen desde Azure AD
      clientId: 'cc151484-e203-41fd-9db1-a274230f8b0d',
      secretName: 'Dyn365WebApiDevMetroSantiago',
      // El scope y authority dependerán de la configuración de Azure AD
      scope: 'https://[tenant].crm.dynamics.com/.default',
      authority: 'https://login.microsoftonline.com/[tenant-id]',
    },
    timeout: 30000,
    testAccount: 'user003dynamics@metropago.cl',
  },

  PROD: {
    name: 'PROD',
    apiBaseUrl: 'https://prod-dynamics-func-metro-f0bbf5htcdcsd5h3.eastus2-01.azurewebsites.net', // Configurar cuando esté disponible
    endpoints: {
      contact: '/api/Contacto',
      incident: '/api/IncidentCreate',
      event: '/api/EventCreate',
    },
    functionCode: {
      contact: 'rW0RPO_v1nIynYmOA-B2nS4jiihjV0n52JmPX5tE0qNmAzFupTOoVg==',
      incident: 'MnTnb4yQi_7QjiPRx4rv4YyP9ELiED47yiTM7BqLvCfRAzFuHFxXMg==',
      event: 'aw3Cfy9mvYyA2XzU-Mjh0gNkVLFLVSL-uQrm0hjRSTXgAzFuy6fSLg==',
    },
    oauth: {
      enabled: true,
      // Estos valores se obtienen desde Azure AD
      clientId: 'c8dbe49b-ea84-497b-bc97-d72c13c6d044',
      secretName: 'Dyn365ebApiPRODMetroSantiago',
      // El scope y authority dependerán de la configuración de Azure AD
      scope: 'https://[tenant].crm.dynamics.com/.default',
      authority: 'https://login.microsoftonline.com/[tenant-id]',
    },
    timeout: 30000,
    testAccount: 'user003dynamics@metropago.cl',
  },
};

// Seleccionar ambiente actual
const CURRENT_ENV = 'QA';

export const ENV_CONFIG = ENVIRONMENTS[CURRENT_ENV];

export default ENV_CONFIG;