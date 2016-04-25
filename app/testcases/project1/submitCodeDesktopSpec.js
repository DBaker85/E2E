/*
  Describe main test case
  */
  describe('Submit code :', function() {

    beforeEach(function() {
    /*
      Action to run before each 'it' declaration.
      This could be resetting vars, declaring objects or loading a page before each test.
      */
      browser.get('http://localhost:4001/');
      /*
        Set window to full screen size on each page load
      */
      browser.driver.manage().window().maximize();
      browser.sleep(1000);
    });


  /*
    Start a suite of tests on the open page
    */
    it('Normal submit a code button should display popup when clicked', function() {
      /*
      Search box should not be visible.
      Click on the search button.
      Check if search box is visible.
      */
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      expect($('.js-modal-submit-area').isDisplayed()).toBeTruthy();
    });


    it('Sticky header submit a code button should display popup when clicked', function() {
      /*
      Search box should not be visible.
      Click on the search button.
      Check if search box is visible.
      */
      browser.executeScript('window.scrollTo(0,300);').then(function () {
        browser.sleep(1500);
        expect($('.l-header__sticky-links .js-submit-code-header').isDisplayed()).toBeTruthy();
      });
      element(by.css('.l-header__sticky-links .js-submit-code-header')).click();
      browser.sleep(3500);
      expect($('.js-modal-submit-area').isDisplayed()).toBeTruthy();
    });


    it('Clicking on add a code adds another field', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(1);
      element(by.css('.js-add-input-button')).click();
      element(by.css('.js-add-input-button')).click();
      browser.sleep(1500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(3);
    });


    it('Clicking on remove a code removes a field', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      element(by.css('.js-add-input-button')).click();
      element(by.css('.js-add-input-button')).click();
      browser.sleep(1500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(3);
      browser.executeScript('$(".js-submit-code__input-block .js-submit-code-input-delete").last().click()');
      browser.sleep(1500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(2);
      browser.executeScript('$(".js-submit-code__input-block .js-submit-code-input-delete").last().click()');
      browser.sleep(1500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(1);
    });

    it('Submiting an invalid code gives an error message', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      element(by.css('.js-submit-code-input')).sendKeys('invalid');
      browser.sleep(1500);
      element(by.css('.js-modal-code-submit')).click();
      browser.sleep(3000);
      var errorMsg = element(by.css('.input-helper'));
      expect(errorMsg.getText()).toMatch('InvalidCode');
    });

    it('Submiting a redeemed code gives an error message', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      element(by.css('.js-submit-code-input')).sendKeys('redeemed');
       browser.sleep(1500);
      element(by.css('.js-modal-code-submit')).click();
      browser.sleep(3000);
      var errorMsg = element(by.css('.input-helper'));
      expect(errorMsg.getText()).toMatch('PreviouslyRedeemed');
    });

    it('Submiting a correct code gives a success screen', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      element(by.css('.js-submit-code-input')).sendKeys('valid');
      browser.sleep(1500);
      element(by.css('.js-modal-code-submit')).click();
      browser.sleep(3000);
      var thankYouHeader = element(by.css('.submit-code__header'));
      expect(thankYouHeader.getText()).toEqual('Thanks');
    });

    it('Submiting another code reloads the modal', function() {
      element(by.css('.l-header__actions .js-submit-code-header')).click();
      browser.sleep(3500);
      element(by.css('.js-submit-code-input')).sendKeys('valid');
      browser.sleep(1500);
      element(by.css('.js-modal-code-submit')).click();
      browser.sleep(3000);
      element(by.css('.js-submit-another-code')).click();
      browser.sleep(3500);
      var addCodeInput = element.all(by.css('.js-submit-code-input')).count();
      expect(addCodeInput).toBe(1);
    });


  });
