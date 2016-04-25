/*
  Describe main test case
  */
  describe('Search :', function() {

    beforeEach(function() {
    /*
      Action to run before each 'it' declaration.
      This could be resetting vars, declaring objects or loading a page before each test.
    */
    browser.get('http://localhost:4001/');
    browser.sleep(1000);
    });

  /*
    Open a page for testing.
    Here it is out of the `beforeEach` to chain actions after each 'it'.
    In this case open the search and check,
    while it is open, check the search suggestions.
      */
    browser.get('http://localhost:4001/');

  /*
    Start a suite of tests on the open page
    */
    it('Clicking on search displays the search bar', function() {
      /*
      Search box should not be visible.
      Click on the search button.
      Check if search box is visible.
      */
      expect($('.js-search-box').isDisplayed()).toBeFalsy();
      element(by.css('.js-search-show')).click();
      browser.sleep(1000);
      expect($('.js-search-box.show').isDisplayed()).toBeTruthy();
    });

    it('Typing text in the search field triggers autocomplete-suggestions', function() {
    /*
      Search suggestions should not be visible.
      Type 'baby' in the search field.
      Check if search suggestions are visible.
      */
      element(by.css('.js-search-show')).click();
      browser.sleep(1000);
      expect($('.autocomplete-suggestions').isDisplayed()).toBeFalsy();
      element(by.css('.js-search-field')).sendKeys('baby');
      browser.sleep(1000);
      expect($('.autocomplete-suggestions').isDisplayed()).toBeTruthy();

    });



  });



