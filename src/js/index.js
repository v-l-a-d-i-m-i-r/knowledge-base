$(document).ready(() => {
  $('pre code').each(function () {
    const $codeBlock = $(this);
    const $pre = $codeBlock.parent();

    // create copy button
    const $btn = $('<button class="copy-btn">Copy</button>');

    // add button to pre element
    $pre.css('position', 'relative');
    $pre.append($btn);

    // handle copy click
    $btn.on('click', () => {
      const text = $codeBlock.text();

      // use Clipboard API if available
      navigator.clipboard.writeText(text).then(() => {
        $btn.text('Copied!');
        setTimeout(() => $btn.text('Copy'), 2000);
      });
    });
  });
});
