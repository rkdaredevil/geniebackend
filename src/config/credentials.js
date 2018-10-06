module.exports = {
  email: {
    host: "mlsrvr.vinove.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'rupesh.thakur@mail.vinove.com',
      pass: 'rupesh@123'
    }
  },
  firebase: {
    apiKey: "AIzaSyAcVcf68hJb-aMk_gGODkcxPB79juJZvT4",
    authDomain: "lipchain-a1151.firebaseapp.com",
    databaseURL: "https://lipchain-a1151.firebaseio.com",
    projectId: "lipchain-a1151",
    storageBucket: "lipchain-a1151.appspot.com",
    messagingSenderId: "520981663370"
  },
  JWT_SECRET: '224b9da9083e1a2080cf1bfd34a37c44',
  EMAIL_SOLT: 'fab710ed9e72c7358e6a52b471845fa8',
  PASS_SOLT: '4062a4e163e4d2cedc42559214d10433',
  PRIVATEKEY_SOLT: "e74d7c0de21e72aaffc8f2eef2bdb7c1",
  MAIL_FROM: "rupesh.thakur@mail.vinove.com",
  SMTP_SERVER: "mlsrvr.vinove.com",
  SMTP_PORT: 587,
  MAIL_AUTH: {
    user: 'rupesh.thakur@mail.vinove.com',
    pass: 'rupesh@123'
  },
  SOLT_ROUND: 10,
  ROLES: ["ADMIN", "USER", "SUPER_ADMIN"]
};
