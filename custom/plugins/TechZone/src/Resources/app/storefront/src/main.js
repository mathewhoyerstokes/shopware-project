import QuickViewPlugin from './plugin/quick-view/quick-view.plugin';
import StickyBuyBarPlugin from './plugin/sticky-buy-bar/sticky-buy-bar.plugin';


const PluginManager = window.PluginManager;

PluginManager.register('QuickView', QuickViewPlugin, '[data-listing]');
PluginManager.register('StickyBuyBar', StickyBuyBarPlugin, '[data-sticky-buy-bar="true"]');