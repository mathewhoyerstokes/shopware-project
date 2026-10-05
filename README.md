# TechZone storefront

Shopware 6.3 shop customized through the TechZone plugin. Storefront changes live in the plugin, not in Shopware core.

## Quick View

Shoppers can preview a product from the listing without leaving the page.

Hovering a product image shows a Quick View button. Clicking it opens a modal with that product’s name, price, description, and add-to-cart form. The product card still links to the full product page.

The feature is three files in `custom/plugins/TechZone`:

- `src/Resources/views/storefront/component/product/card/box-standard.html.twig` extends the standard product card and adds the button, with the product URL stored on it.
- `src/Resources/app/storefront/src/plugin/quick-view/quick-view.plugin.js` handles the click, loads the product page, and places the product detail into the modal. The request is a normal page load. Shopware rejects this page when it is requested as AJAX.
- `src/Resources/app/storefront/src/scss/base.scss` styles the hover button, the overlay, and the dialog.

After a storefront JavaScript change, rebuild with `bin/build-storefront.sh`. After a style change, run `bin/console theme:compile`.
