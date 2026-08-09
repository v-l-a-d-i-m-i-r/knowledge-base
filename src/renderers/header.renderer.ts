export function renderHeader(): string {
  return `
    <nav class="header">
      <div class="wrapper header__wrapper">
        <a class="header__logo" href="/">YN</a>

        <ul class="header__menu">
          <li class="header__menu-item">
            <a class="header__menu-item-link" href="/"></a>
          </li>
        </ul>
      </div>
    </nav>
  `;
}
