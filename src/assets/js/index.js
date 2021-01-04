hljs.debugMode();
hljs.initHighlightingOnLoad();

// (() => {
//   // const $window = $(window);
//   // const $document = $(document);
//   // const $html = $('html');
//   // const $header = $('header');
//   // const $main = $('main');
//   // const $footer = $('footer');

//   // const smoothScroll = (settings = {}) => {
//   //   const defaults = {
//   //     selector: '',
//   //     offset: 0,
//   //     duration: 500,
//   //     onScroll: () => {},
//   //   };

//   //   const { selector, offset, duration, onScroll } = { ...defaults, ...settings };

//   //   $(selector).on('click', (event) => {
//   //     const href = event.target.getAttribute('href');

//   //     $('html').animate({
//   //       scrollTop: $(href).offset().top + offset,
//   //     }, duration, onScroll);
//   //   });
//   // };

//   // const waypoint = () => {
//   //   const hrefs = $('.bd-toc a').map((i, element) => element.getAttribute('href'));
//   //   const waypointsSelector = hrefs.toArray().join(', ');
//   //   const waypointsElementsObjects = $(waypointsSelector)
//   //     .map((i, element) => {
//   //       const $element = $(element);
//   //       const id = $element.attr('id');
//   //       const top = $element.offset().top;
//   //       const bottom = top + $element.outerHeight();

//   //       return { id, top, bottom };
//   //     });

//   //   $(document).on('scroll', () => {
//   //     const scrollTop = $('html').scrollTop();

//   //     const elementId = waypointsElementsObjects

//   //     console.log('height', $($(waypointsSelector)[0]).height())
//   //     console.log('offset', $($(waypointsSelector)[0]).offset().top)
//   //     // console.log('top', $($(waypointsSelector)[0]).top())
//   //     // console.log('offsetHeight', $($(waypointsSelector)[0]).offsetHeight())
//   //   })
//   // }


//   // const highlightCode = () => {
//   //   $('pre code').each((i, element) => {
//   //     hljs.highlightBlock(element);
//   //   });
//   // };

//   const fixFooter = () => {
//     const htmlOuterHeight = $html.outerHeight(true);
//     const headerOuterHeight = $header.outerHeight(true);
//     const footerOuterHeight = $footer.outerHeight(true);

//     $main.css({
//       'min-height': htmlOuterHeight - headerOuterHeight - footerOuterHeight,
//     });
//   }


//   $(() => {
//     highlightCode();
//     // fixFooter();


//     // $window.on('resize', () => {
//     //   fixFooter();
//     // });



//     // smoothScroll({
//     //   selector: '.bd-toc a',
//     //   offset: 0,
//     //   duration: 500,
//     //   offset: - $('header').outerHeight(),
//     // });



//     // waypoint();


//     // $('pre').each((i, element) => $(element).addClass('snippet'));



//     // var snippets = document.querySelectorAll('pre');
//     // [].forEach.call(snippets, function(snippet) {
//     //     snippet.firstChild.insertAdjacentHTML('beforebegin', '<button class="btn" data-clipboard-snippet><img class="clippy" width="13" src="./assets/icons/clippy.svg" alt="Copy to clipboard"></button>');
//     // });
//     // var clipboardSnippets = new ClipboardJS('[data-clipboard-snippet]',{
//     //     target: function(trigger) {
//     //         return trigger.nextElementSibling;
//     //     }
//     // });
//     // clipboardSnippets.on('success', function(e) {
//     //     e.clearSelection();
//     //     console.info('Action:', e.action);
//     //     console.info('Text:', e.text);
//     //     console.info('Trigger:', e.trigger);
//     //     showTooltip(e.trigger, 'Copied!');
//     // });
//     // clipboardSnippets.on('error', function(e) {
//     //     console.error('Action:', e.action);
//     //     console.error('Trigger:', e.trigger);
//     //     showTooltip(e.trigger, fallbackMessage(e.action));
//     // });



//     // var btns = document.querySelectorAll('.btn');
//     // for (var i = 0; i < btns.length; i++) {
//     //     btns[i].addEventListener('mouseleave', clearTooltip);
//     //     btns[i].addEventListener('blur', clearTooltip);
//     // }
//     // function clearTooltip(e) {
//     //     e.currentTarget.setAttribute('class', 'btn');
//     //     e.currentTarget.removeAttribute('aria-label');
//     // }
//     // function showTooltip(elem, msg) {
//     //     elem.setAttribute('class', 'btn tooltipped tooltipped-s');
//     //     elem.setAttribute('aria-label', msg);
//     // }
//     // function fallbackMessage(action) {
//     //     var actionMsg = '';
//     //     var actionKey = (action === 'cut' ? 'X' : 'C');
//     //     if (/iPhone|iPad/i.test(navigator.userAgent)) {
//     //         actionMsg = 'No support :(';
//     //     } else if (/Mac/i.test(navigator.userAgent)) {
//     //         actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
//     //     } else {
//     //         actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
//     //     }
//     //     return actionMsg;
//     // }

//       // hljs.initHighlightingOnLoad();
//     // var clipboardDemos = new ClipboardJS('[data-clipboard-demo]');
//     // clipboardDemos.on('success', function(e) {
//     //     e.clearSelection();
//     //     console.info('Action:', e.action);
//     //     console.info('Text:', e.text);
//     //     console.info('Trigger:', e.trigger);
//     //     showTooltip(e.trigger, 'Copied!');
//     // });
//     // clipboardDemos.on('error', function(e) {
//     //     console.error('Action:', e.action);
//     //     console.error('Trigger:', e.trigger);
//     //     showTooltip(e.trigger, fallbackMessage(e.action));
//     // });
//   });
// })();


