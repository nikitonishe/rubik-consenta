/* global describe test expect */
const path = require('path');
const { createApp, createKubik } =  require('rubik-main/tests/helpers/creators');

const { Kubiks: { Config } } = require('rubik-main');
const Consenta = require('../classes/Consenta');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const get = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));
  const kubik = createKubik(Consenta, app);
  return { app, kubik };
}

describe('Кубик esputnik', () => {
  test('Создается и подключается в App без проблем', () => {
    const app = createApp();
    const kubik = createKubik(Consenta, app);

    expect(app[kubik.name]).toBe(kubik);
    expect(app.get(kubik.name)).toBe(kubik);
  });

  test('Поднимается без ошибок', async () => {
    const { app } = get();
    await app.up();
    await app.down();
  });

  test('Передает промокод', async () => {
    const { app, kubik } = get();
    await app.up();

    const result = await kubik.Customer.CreateSale({
      promocode: 'test',
      sum: '100',
      saleId: 'ns@indotech.ru'
    })

    expect(result).toBeTruthy();

    await app.down();
  })
});
