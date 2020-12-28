process.env.HEADLESS = 'false';
process.env.SLOWMO = 1000;

module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
    devtools: true,
    browserContext: 'incognito',
  },
  // server: {
  //   command: 'npx parcel todo/index.html',
  //   port: 1234,
  //   launchTimeout: 60000,
  // },
};
