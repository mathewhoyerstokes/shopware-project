import QuickViewPlugin from './plugin/quick-view/quick-view.plugin';

const PluginManager = window.PluginManager;

PluginManager.register('QuickView', QuickViewPlugin, '[data-listing]');
