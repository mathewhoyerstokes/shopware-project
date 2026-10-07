# TechZone storefront

Shopware 6.3 shop customized through the TechZone plugin. Storefront changes live in the plugin, not in Shopware core.

The live storefront is deployed on Vercel at https://shopware-project.vercel.app.

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

A two-step finder sits at the top of the homepage. The shopper picks a focus, then a colour, and Show Matches opens the Home category filtered by those choices.

Each radio `value` is a real property option ID from the admin, not the label. The script joins the two IDs with `|`, because Shopware reads listing filters as `?properties=id1|id2`. Options in different property groups must both match, so Focus plus Colour returns only products that have both.

A product also has to be in the Home category and visible on the TechZone Geelong sales channel, or the listing will not show it.

The markup is `src/Resources/views/storefront/component/custom/product-finder.html.twig`, included from `page/content/index.html.twig`. `product-finder.plugin.js` switches the steps and builds the filter URL. The styles are in `base.scss`.

After a storefront JavaScript change, rebuild with `bin/build-storefront.sh`. After a style change, run `bin/console theme:compile`.
