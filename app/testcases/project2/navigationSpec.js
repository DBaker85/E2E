/*
  Describe main test case
  */
  describe('Navigation', function() {

    beforeEach(function() {
    /*
      Action to run before each 'it' declaration.
      This could be resetting vars, declaring objects or loading a page before each test.
      */
      // browser.get('http://localhost:9000/');
      // LocalStorage local = ((WebStorage) driver).getLocalStorage();
      // local.clear();

    });


  /*
    Start a suite of tests on the open page
    */
    it('should redirect to homepage if plan and email pages are accessed without a plan id', function() {
      browser.get('http://localhost:9000/#/plan/');
      expect(browser.getLocationAbsUrl()).toMatch("/");
      browser.get('http://localhost:9000/#/email/');
      expect(browser.getLocationAbsUrl()).toMatch("/");
    });

    it('should open plan and email page if plan id exists', function() {
      browser.get('http://localhost:9000/#/plan/54');
      expect(browser.getLocationAbsUrl()).toMatch("/plan/54");
      element(by.css('.email__holder')).click();
      expect(browser.getLocationAbsUrl()).toMatch("/email");
    });





  });
