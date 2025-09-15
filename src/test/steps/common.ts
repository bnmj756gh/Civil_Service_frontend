const { I } = inject();

const iAmOnPage = (text: string): void => {
  const testUrl = 'https://localhost:3100';
  const url = new URL(text, testUrl);
  if (!url.searchParams.has('lng')) {
    url.searchParams.set('lng', 'en');
  }
  I.amOnPage(url.toString());
};

Given('I go to {string}', iAmOnPage);

Then('the page URL should be {string}', (url: string): void => {
  I.waitInUrl(url);
});

Then('the page should include {string}', (text: string): void => {
  I.waitForText(text);
});