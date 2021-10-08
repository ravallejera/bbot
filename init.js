(function () {

  // Starmon
  function $(selector, context = document) {
    return context.querySelector(selector);
  }
  function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }


  // Main EVENT
  function Main() {
    const { search } = window.location;
    const { body } = document;
    const set = {
      timeout: {},
      interval: {},
      prev: {},
      observerMutation: true,
      productId: null,
    }

    const Notif = ($message) => {
      return $message && chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
          title: `Binance NFT BOT ${set.productId}`,
          message: $message,
          iconUrl: '/images/_32.png',
          type: 'basic'
        }
      });
  
      return console.log('Notif', $message);
    }

    if (!search.includes('buyme')) return;
    const params = search.split('&');
    set.productId = params[0].replace('?', '').replace('=', ': ');
    Notif(`Buy Me Enable!`);


    // handlers

    const mutationHandler = () => {
      const btns = $$('button', body);
      const btnBuy = btns.find(btn => btn.textContent == 'Buy Now');
      const btnClose = $$('svg[cursor]', body);
      const btnCancel = btns.find(btn => btn.textContent == 'Cancel');
      const btnConfirm = btns.find(btn => btn.textContent == 'Confirm');

      if (btnBuy && !btnClose.length > 0) {
        Notif('trigger buy button');
        btnBuy.click();
      }

      if (btnConfirm) {
        set.observerMutation = false;
        Notif('Mutation Observer disabled.');
        if (!search.includes('buyme=true')) {
          Notif('Buy Me is False.');
        };

        set.interval.btnclick = setInterval(() => {
          const isVisbile = $$('button', body).find(btn => btn.textContent == 'Confirm')
          if (isVisbile) {
            btnConfirm.click();
          }
          else {
            Notif('Btn click success.');
            clearInterval(set.interval.btnclick);
            clearTimeout(set.timeout.btnclick);
          }
        }, 10);

        set.timeout.btnclick = setTimeout(() => {
          clearInterval(set.interval.btnclick);
          clearTimeout(set.timeout.btnclick);
          Notif('Btn click timeout.');
          btnCancel.click();
          // set.observerMutation = true;
        }, 10000); // 10sec
      }
    }

    // observer
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
    }

    const observer = new MutationObserver((mutations) => {
      if (!set.observerMutation) return;

      for (const mutation of mutations) {
        clearTimeout(set.timeout.mutation);
        set.timeout.mutation = setTimeout(() => mutationHandler(), 0);
      }
    });
    observer.observe(body, observerConfig);
  }
  Main();
  // init
  console.clear();
  console.log('Bot Initialize!')
})();
