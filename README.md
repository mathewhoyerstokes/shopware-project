# TechZone storefront

Shopware 6.3 shop customized through the TechZone plugin. Storefront changes live in the plugin, not in Shopware core.

The shop is at http://204.168.132.214. Anyone with that link can open it in a browser. The admin is at http://204.168.132.214/admin.

## Quick View

Shoppers can preview a product from the listing without leaving the page.

Hovering a product image shows a Quick View button. Clicking it opens a modal with that product’s name, price, description, and add-to-cart form. The product card still links to the full product page.

The feature is three files in `custom/plugins/TechZone`:

- `src/Resources/views/storefront/component/product/card/box-standard.html.twig` extends the standard product card and adds the button, with the product URL stored on it.
- `src/Resources/app/storefront/src/plugin/quick-view/quick-view.plugin.js` handles the click, loads the product page, and places the product detail into the modal. The request is a normal page load. Shopware rejects this page when it is requested as AJAX.
- `src/Resources/app/storefront/src/scss/base.scss` styles the hover button, the overlay, and the dialog.

## Sticky buy bar

On the product page, a bar is fixed to the bottom of the screen. It stays hidden while the main buy form is in view, then slides up once that form scrolls away. It shows the product image, name, number, price, quantity, and an Add to Cart button.

Add to Cart posts to Shopware’s line-item route and redirects to `frontend.checkout.cart.page`. The route name `frontend.cart.page` does not exist in Shopware 6.3, so using it returned an error after the product was already in the cart.

The markup is `src/Resources/views/storefront/component/custom/sticky-buy-bar.html.twig`, included from the product detail template. `sticky-buy-bar.plugin.js` watches the main buy form with an IntersectionObserver and toggles an `is-visible` class. The styles are in `base.scss`.

## Product finder

A two-step finder sits at the bottom of the homepage, just above the footer. Step 1 lists property groups from the admin, such as Trading Cards, Pokemon, and Stem products. Step 2 lists only the options inside the group the shopper picked, such as Chinese, English, and Japanese for Pokemon, or bikes and Cars for Stem products. Show Matches opens `/finder` filtered by that one option.

The labels and option ids are read from the database, so renaming a group or option in the admin changes the finder. The old color and Focus groups are left out. A product appears only when that option is assigned to it and the product is visible on the TechZone Geelong sales channel. An option with nothing assigned, such as bikes, still shows as a choice and then returns no products.

These properties are shop data, not plugin code. Deploying the finder does not create them. They are edited in the admin at http://204.168.132.214/admin. That shop already has the Trading Cards, Pokemon, and Stem products groups.

The markup is `src/Resources/views/storefront/component/custom/product-finder.html.twig`, included from `page/content/index.html.twig` after the shopping-experience sections, and only when the page action is `home`. `src/Subscriber/ProductFinderSubscriber.php` loads the groups onto the homepage. `product-finder.plugin.js` switches the steps. `src/Storefront/Controller/ProductFinderController.php` serves `/finder` and loads the matching products. The results template is `page/finder/index.html.twig`. The styles are in `base.scss`.

## Shopping experience blocks

Custom blocks live in the TechZone plugin and show up in Shopping Experiences under the **Custom components** category. That category is added in `src/Resources/public/administration/js/tech-zone.js`, which also registers the blocks. Shopware’s own Text, Images, and Commerce blocks stay in their own categories.

To use one, open Content, then Shopping Experiences, edit the layout, and choose **Custom components** from the block category dropdown.

**Hero** is a full-width image with a dark overlay and the text on top of it. The fields are image, headline, text, button text, and button link. The button is shown when both the text and the link are filled in. If no image is chosen, the storefront uses `bundles/techzone/hero.jpg`. The storefront templates are `element/cms-element-hero.html.twig` and `block/cms-block-hero.html.twig`. `src/Content/Cms/HeroCmsElementResolver.php` loads the selected media. The layout styles are in `src/Resources/app/storefront/src/scss/hero.scss`. On the homepage the hero sits flush under the header.

**Two column** is a full-width band. The heading is on the left. The text and up to two buttons are on the right. On a small screen the heading stacks above the text. The background starts as light gray (`#ececec`) and can be changed with the color picker. A button is shown only when both its text and its link are set. The storefront templates are `element/cms-element-two-column.html.twig` and `block/cms-block-two-column.html.twig`. The styles are in `src/Resources/app/storefront/src/scss/two-column.scss`.

These blocks are part of the layout saved in Shopping Experiences. The layout for http://204.168.132.214 is edited in that shop's admin.

## Twig templates

Storefront markup is overridden in `custom/plugins/TechZone/src/Resources/views/storefront`. A template uses `{% sw_extends %}` on the matching Shopware template, then replaces a named `{% block %}`. Shopware renders the plugin version of that block and leaves the rest of the core template alone. `{% sw_include %}` pulls in another template, and `{{ parent() }}` keeps the original block content when the override only needs to wrap it.

The homepage template, `page/content/index.html.twig`, drops the breadcrumb and prints the shopping-experience sections. After those sections, on the home page only, it includes the product finder so the finder stays below the CMS blocks and just above the footer.

Navigation templates turn the desktop Home item into a flyout of image cards, and the phone and iPad menu into the same cards at full width. The close control is only the X. Facebook and Instagram links sit at the bottom of that menu. `layout/navigation/category-card-image.html.twig` uses the category image when one is assigned, and otherwise a bundled image for Stem, Cards, Toys, and Clothing.

Header templates rebuild the top bar, logo, search, account menu, and the main header row. `base.html.twig` keeps that header sticky. The footer template empties the default hotline, link columns, payment logos, service menu, VAT note, and copyright so those core blocks do not render.

Product templates add the Quick View button around the product image, and the product page appends the sticky buy bar after the normal product content.

After a Twig change, clear the cache with `bin/console cache:clear --no-warmup` and `bin/console cache:pool:clear cache.http`. Production Twig keeps the previous template until that cache is cleared. After a storefront JavaScript change, rebuild with `bin/build-storefront.sh`. After a style change, run `bin/console theme:compile`.
