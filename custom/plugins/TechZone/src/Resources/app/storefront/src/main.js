import QuickViewPlugin from './plugin/quick-view/quick-view.plugin';
import StickyBuyBarPlugin from './plugin/sticky-buy-bar/sticky-buy-bar.plugin';
import ProductFinderPlugin from './plugin/product-finder/product-finder.plugin';
import ContactTabPlugin from './plugin/contact-tab/contact-tab.plugin';


const PluginManager = window.PluginManager;

PluginManager.register('QuickView', QuickViewPlugin, 'body');
PluginManager.register('StickyBuyBar', StickyBuyBarPlugin, '[data-sticky-buy-bar="true"]');
PluginManager.register('ProductFinder', ProductFinderPlugin, '[data-product-finder="true"]');
PluginManager.register('ContactTab', ContactTabPlugin, '[data-contact-tab]');