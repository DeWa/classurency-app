describe('Classurrency smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows login screen', async () => {
    await expect(element(by.id('loginScreen'))).toBeVisible();
  });
});
