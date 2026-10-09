(function () {
    var Component = Shopware.Component;
    var Mixin = Shopware.Mixin;

    Shopware.Locale.extend('en-GB', {
        'techzone-hero.label': 'Hero',
        'techzone-hero.headline': 'Headline',
        'techzone-hero.text': 'Text',
        'techzone-hero.buttonText': 'Button text',
        'techzone-hero.buttonUrl': 'Button link',
        'techzone-hero.image': 'Image',
        'techzone-two-column.label': 'Two column',
        'techzone-two-column.background': 'Background',
        'techzone-two-column.headline': 'Heading',
        'techzone-two-column.text': 'Text',
        'techzone-two-column.buttonText': 'Button text',
        'techzone-two-column.buttonUrl': 'Button link',
        'techzone-two-column.buttonTwoText': 'Second button text',
        'techzone-two-column.buttonTwoUrl': 'Second button link',
        'techzone-quote-slider.label': 'Quote slider',
        'techzone-quote-slider.title': 'Title',
        'techzone-quote-slider.quote': 'Quote',
        'techzone-quote-slider.image': 'Image'
    });

    Component.register('sw-cms-el-hero', {
        template: [
            '<div class="sw-cms-el-hero" style="position:relative;min-height:280px;display:flex;align-items:center;overflow:hidden;background:#1a1a1a;color:#fff;">',
            '<img v-if="mediaUrl" :src="mediaUrl" style="position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:cover;">',
            '<div style="position:absolute;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.35);"></div>',
            '<div style="position:relative;z-index:1;padding:32px;max-width:520px;">',
            '<h2 style="margin:0 0 8px;color:#fff;font-size:32px;line-height:1.1;">{{ headline }}</h2>',
            '<p style="margin:0;color:#fff;">{{ text }}</p>',
            '</div>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        computed: {
            headline: function () {
                return this.element.config.headline.value;
            },

            text: function () {
                return this.element.config.text.value;
            },

            mediaUrl: function () {
                var media = this.element.data && this.element.data.media;

                if (media && media.url) {
                    return media.url;
                }

                return null;
            }
        },

        created: function () {
            this.initElementConfig('hero');
            this.initElementData('hero');
        }
    });

    Component.register('sw-cms-el-config-hero', {
        template: [
            '<div class="sw-cms-el-config-hero">',
            '<sw-media-upload-v2 variant="regular" :uploadTag="uploadTag" :source="previewSource" :allowMultiSelect="false" :caption="$tc(\'techzone-hero.image\')" @media-upload-sidebar-open="onOpenMediaModal" @media-upload-remove-image="onImageRemove"></sw-media-upload-v2>',
            '<sw-upload-listener :uploadTag="uploadTag" autoUpload @media-upload-finish="onImageUpload"></sw-upload-listener>',
            '<sw-media-modal-v2 variant="regular" v-if="mediaModalIsOpen" :allowMultiSelect="false" @media-modal-selection-change="onSelectionChanges" @modal-close="onCloseModal"></sw-media-modal-v2>',
            '<sw-field type="text" :label="$tc(\'techzone-hero.headline\')" v-model="element.config.headline.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="textarea" :label="$tc(\'techzone-hero.text\')" v-model="element.config.text.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-hero.buttonText\')" v-model="element.config.buttonText.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-hero.buttonUrl\')" v-model="element.config.buttonUrl.value" @input="onElementUpdate"></sw-field>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        inject: ['repositoryFactory'],

        data: function () {
            return {
                mediaModalIsOpen: false
            };
        },

        computed: {
            mediaRepository: function () {
                return this.repositoryFactory.create('media');
            },

            uploadTag: function () {
                return 'cms-element-hero-config-' + this.element.id;
            },

            previewSource: function () {
                if (this.element.data && this.element.data.media && this.element.data.media.id) {
                    return this.element.data.media;
                }

                return this.element.config.media.value;
            }
        },

        created: function () {
            this.initElementConfig('hero');
        },

        methods: {
            onElementUpdate: function () {
                this.$emit('element-update', this.element);
            },

            onImageUpload: function (payload) {
                var targetId = payload.targetId;
                var self = this;

                this.mediaRepository.get(targetId, Shopware.Context.api).then(function (mediaEntity) {
                    self.element.config.media.value = mediaEntity.id;
                    self.updateElementData(mediaEntity);
                    self.$emit('element-update', self.element);
                });
            },

            onImageRemove: function () {
                this.element.config.media.value = null;
                this.updateElementData();
                this.$emit('element-update', this.element);
            },

            onCloseModal: function () {
                this.mediaModalIsOpen = false;
            },

            onOpenMediaModal: function () {
                this.mediaModalIsOpen = true;
            },

            onSelectionChanges: function (mediaEntity) {
                var media = mediaEntity[0];
                this.element.config.media.value = media.id;
                this.updateElementData(media);
                this.$emit('element-update', this.element);
            },

            updateElementData: function (media) {
                if (!this.element.data) {
                    this.$set(this.element, 'data', {});
                }

                this.$set(this.element.data, 'mediaId', media ? media.id : null);
                this.$set(this.element.data, 'media', media || null);
            }
        }
    });

    Component.register('sw-cms-el-preview-hero', {
        template: '<div style="height:100%;min-height:80px;background:#1a1a1a;color:#fff;display:flex;align-items:flex-end;padding:12px;font-weight:700;">Hero</div>'
    });

    Component.register('sw-cms-block-hero', {
        template: '<div class="sw-cms-block-hero"><slot name="hero"></slot></div>'
    });

    Component.register('sw-cms-preview-hero', {
        template: '<div style="height:80px;background:#1a1a1a;color:#fff;display:flex;align-items:flex-end;padding:8px;font-size:12px;font-weight:700;">Hero</div>'
    });

    Shopware.Service('cmsService').registerCmsElement({
        name: 'hero',
        label: 'techzone-hero.label',
        component: 'sw-cms-el-hero',
        configComponent: 'sw-cms-el-config-hero',
        previewComponent: 'sw-cms-el-preview-hero',
        defaultConfig: {
            media: {
                source: 'static',
                value: null,
                entity: {
                    name: 'media'
                }
            },
            headline: {
                source: 'static',
                value: 'TechZone'
            },
            text: {
                source: 'static',
                value: 'the only place to shop electro.'
            },
            buttonText: {
                source: 'static',
                value: ''
            },
            buttonUrl: {
                source: 'static',
                value: ''
            }
        }
    });

    Shopware.Service('cmsService').registerCmsBlock({
        name: 'hero',
        label: 'techzone-hero.label',
        category: 'custom',
        component: 'sw-cms-block-hero',
        previewComponent: 'sw-cms-preview-hero',
        defaultConfig: {
            marginBottom: '0',
            marginTop: '0',
            marginLeft: '0',
            marginRight: '0',
            sizingMode: 'full_width'
        },
        slots: {
            hero: {
                type: 'hero'
            }
        }
    });

    Component.register('sw-cms-el-two-column', {
        template: [
            '<div class="sw-cms-el-two-column" :style="previewStyle">',
            '<h2 style="margin:0;font-size:28px;line-height:1.05;">{{ headline }}</h2>',
            '<div>',
            '<p style="margin:0 0 12px;">{{ text }}</p>',
            '<span v-if="buttonText" style="display:inline-block;margin-right:8px;padding:8px 12px;background:#fff;border:1px solid #d5d5d5;font-size:12px;font-weight:700;">{{ buttonText }}</span>',
            '<span v-if="buttonTwoText" style="display:inline-block;padding:8px 12px;background:#fff;border:1px solid #d5d5d5;font-size:12px;font-weight:700;">{{ buttonTwoText }}</span>',
            '</div>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        computed: {
            headline: function () {
                return this.element.config.headline.value;
            },

            text: function () {
                return this.element.config.text.value;
            },

            buttonText: function () {
                return this.element.config.buttonText.value;
            },

            buttonTwoText: function () {
                return this.element.config.buttonTwoText.value;
            },

            previewStyle: function () {
                return {
                    background: this.element.config.backgroundColor.value || '#ececec',
                    color: '#1a1a1a',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.15fr',
                    gap: '24px',
                    alignItems: 'center',
                    minHeight: '180px',
                    padding: '28px'
                };
            }
        },

        created: function () {
            this.initElementConfig('two-column');
            this.initElementData('two-column');
        }
    });

    Component.register('sw-cms-el-config-two-column', {
        template: [
            '<div class="sw-cms-el-config-two-column">',
            '<sw-colorpicker :label="$tc(\'techzone-two-column.background\')" colorOutput="hex" :alpha="false" :zIndex="10000" v-model="element.config.backgroundColor.value" @input="onElementUpdate"></sw-colorpicker>',
            '<sw-field type="text" :label="$tc(\'techzone-two-column.headline\')" v-model="element.config.headline.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="textarea" :label="$tc(\'techzone-two-column.text\')" v-model="element.config.text.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-two-column.buttonText\')" v-model="element.config.buttonText.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-two-column.buttonUrl\')" v-model="element.config.buttonUrl.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-two-column.buttonTwoText\')" v-model="element.config.buttonTwoText.value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="text" :label="$tc(\'techzone-two-column.buttonTwoUrl\')" v-model="element.config.buttonTwoUrl.value" @input="onElementUpdate"></sw-field>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        created: function () {
            this.initElementConfig('two-column');
        },

        methods: {
            onElementUpdate: function () {
                this.$emit('element-update', this.element);
            }
        }
    });

    Component.register('sw-cms-el-preview-two-column', {
        template: '<div style="height:100%;min-height:80px;display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;padding:12px;background:#ececec;"><strong>Heading</strong><span>Text and buttons</span></div>'
    });

    Component.register('sw-cms-block-two-column', {
        template: '<div class="sw-cms-block-two-column"><slot name="two-column"></slot></div>'
    });

    Component.register('sw-cms-preview-two-column', {
        template: '<div style="height:80px;display:grid;grid-template-columns:1fr 1.15fr;gap:8px;align-items:center;padding:8px;background:#ececec;font-size:12px;"><strong>Heading</strong><span>Text and buttons</span></div>'
    });

    Shopware.Service('cmsService').registerCmsElement({
        name: 'two-column',
        label: 'techzone-two-column.label',
        component: 'sw-cms-el-two-column',
        configComponent: 'sw-cms-el-config-two-column',
        previewComponent: 'sw-cms-el-preview-two-column',
        defaultConfig: {
            backgroundColor: {
                source: 'static',
                value: '#ececec'
            },
            headline: {
                source: 'static',
                value: 'Shop the latest'
            },
            text: {
                source: 'static',
                value: 'Electronics, clothing, toys and cards, all in one place.'
            },
            buttonText: {
                source: 'static',
                value: 'Shop now'
            },
            buttonUrl: {
                source: 'static',
                value: '/'
            },
            buttonTwoText: {
                source: 'static',
                value: 'View clothing'
            },
            buttonTwoUrl: {
                source: 'static',
                value: '/Clothing/'
            }
        }
    });

    Shopware.Service('cmsService').registerCmsBlock({
        name: 'two-column',
        label: 'techzone-two-column.label',
        category: 'custom',
        component: 'sw-cms-block-two-column',
        previewComponent: 'sw-cms-preview-two-column',
        defaultConfig: {
            marginBottom: '0',
            marginTop: '0',
            marginLeft: '0',
            marginRight: '0',
            sizingMode: 'full_width'
        },
        slots: {
            'two-column': {
                type: 'two-column'
            }
        }
    });

    Component.register('sw-cms-el-quote-slider', {
        template: [
            '<div class="sw-cms-el-quote-slider" style="position:relative;min-height:180px;background:#f2f2f2;">',
            '<div style="width:62%;height:180px;background:#e5e7eb;"></div>',
            '<div style="position:absolute;top:24px;right:12px;width:46%;padding:16px;background:#fff;">',
            '<h2 style="margin:0 0 8px;font-size:18px;">{{ title }}</h2>',
            '<p style="margin:0;">{{ quote }}</p>',
            '</div>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        computed: {
            title: function () {
                return this.element.config.title1.value;
            },

            quote: function () {
                return this.element.config.quote1.value;
            }
        },

        created: function () {
            this.initElementConfig('quote-slider');
            this.initElementData('quote-slider');
        }
    });

    Component.register('sw-cms-el-config-quote-slider', {
        template: [
            '<div class="sw-cms-el-config-quote-slider">',
            '<div v-for="index in [1, 2, 3, 4]" :key="index" style="margin-bottom:24px;">',
            '<h3 style="margin:0 0 12px;font-size:14px;">Card {{ index }}</h3>',
            '<sw-media-upload-v2 variant="regular" :uploadTag="uploadTag(index)" :source="previewSource(index)" :allowMultiSelect="false" :caption="$tc(\'techzone-quote-slider.image\')" @media-upload-sidebar-open="onOpenMediaModal(index)" @media-upload-remove-image="onImageRemove(index)"></sw-media-upload-v2>',
            '<sw-upload-listener :uploadTag="uploadTag(index)" autoUpload @media-upload-finish="onImageUpload(index, $event)"></sw-upload-listener>',
            '<sw-field type="text" :label="$tc(\'techzone-quote-slider.title\')" v-model="element.config[\'title\' + index].value" @input="onElementUpdate"></sw-field>',
            '<sw-field type="textarea" :label="$tc(\'techzone-quote-slider.quote\')" v-model="element.config[\'quote\' + index].value" @input="onElementUpdate"></sw-field>',
            '</div>',
            '<sw-media-modal-v2 variant="regular" v-if="mediaModalIsOpen" :allowMultiSelect="false" @media-modal-selection-change="onSelectionChanges" @modal-close="onCloseModal"></sw-media-modal-v2>',
            '</div>'
        ].join(''),

        mixins: [
            Mixin.getByName('cms-element')
        ],

        inject: ['repositoryFactory'],

        data: function () {
            return {
                mediaModalIsOpen: false,
                activeIndex: 1
            };
        },

        computed: {
            mediaRepository: function () {
                return this.repositoryFactory.create('media');
            }
        },

        created: function () {
            this.initElementConfig('quote-slider');
        },

        methods: {
            onElementUpdate: function () {
                this.$emit('element-update', this.element);
            },

            uploadTag: function (index) {
                return 'cms-element-quote-slider-' + this.element.id + '-' + index;
            },

            previewSource: function (index) {
                var key = 'media' + index;
                var data = this.element.data && this.element.data[key];

                if (data && data.id) {
                    return data;
                }

                return this.element.config[key].value;
            },

            onImageUpload: function (index, payload) {
                var self = this;

                this.mediaRepository.get(payload.targetId, Shopware.Context.api).then(function (mediaEntity) {
                    self.setMedia(index, mediaEntity);
                });
            },

            onImageRemove: function (index) {
                this.setMedia(index, null);
            },

            onOpenMediaModal: function (index) {
                this.activeIndex = index;
                this.mediaModalIsOpen = true;
            },

            onCloseModal: function () {
                this.mediaModalIsOpen = false;
            },

            onSelectionChanges: function (mediaEntity) {
                this.setMedia(this.activeIndex, mediaEntity[0]);
            },

            setMedia: function (index, media) {
                var key = 'media' + index;

                this.element.config[key].value = media ? media.id : null;

                if (!this.element.data) {
                    this.$set(this.element, 'data', {});
                }

                this.$set(this.element.data, key, media || null);
                this.$emit('element-update', this.element);
            }
        }
    });

    Component.register('sw-cms-el-preview-quote-slider', {
        template: '<div style="height:100%;min-height:80px;position:relative;background:#f2f2f2;"><div style="width:58%;height:100%;min-height:80px;background:#e5e7eb;"></div><div style="position:absolute;top:16px;right:8px;width:48%;padding:8px;background:#fff;font-size:12px;font-weight:700;">Quote slider</div></div>'
    });

    Component.register('sw-cms-block-quote-slider', {
        template: '<div class="sw-cms-block-quote-slider"><slot name="quote-slider"></slot></div>'
    });

    Component.register('sw-cms-preview-quote-slider', {
        template: '<div style="height:80px;position:relative;background:#f2f2f2;"><div style="width:58%;height:100%;background:#e5e7eb;"></div><div style="position:absolute;top:16px;right:8px;width:48%;padding:8px;background:#fff;font-size:12px;font-weight:700;">Quote slider</div></div>'
    });

    Shopware.Service('cmsService').registerCmsElement({
        name: 'quote-slider',
        label: 'techzone-quote-slider.label',
        component: 'sw-cms-el-quote-slider',
        configComponent: 'sw-cms-el-config-quote-slider',
        previewComponent: 'sw-cms-el-preview-quote-slider',
        defaultConfig: {
            media1: { source: 'static', value: null, entity: { name: 'media' } },
            title1: { source: 'static', value: 'Easy to find' },
            quote1: { source: 'static', value: 'I found the right pack in a couple of clicks, and it arrived exactly as shown.' },
            media2: { source: 'static', value: null, entity: { name: 'media' } },
            title2: { source: 'static', value: 'Worth coming back' },
            quote2: { source: 'static', value: 'The range is clear, and I already know where I will look next time.' },
            media3: { source: 'static', value: null, entity: { name: 'media' } },
            title3: { source: 'static', value: 'Ready for game night' },
            quote3: { source: 'static', value: 'Everything we needed was in one place, so we spent the evening playing instead of searching.' },
            media4: { source: 'static', value: null, entity: { name: 'media' } },
            title4: { source: 'static', value: 'A shop that gets it' },
            quote4: { source: 'static', value: 'The photos match the product, and checkout did not get in the way.' }
        }
    });

    Shopware.Service('cmsService').registerCmsBlock({
        name: 'quote-slider',
        label: 'techzone-quote-slider.label',
        category: 'custom',
        component: 'sw-cms-block-quote-slider',
        previewComponent: 'sw-cms-preview-quote-slider',
        defaultConfig: {
            marginBottom: '20px',
            marginTop: '20px',
            marginLeft: '20px',
            marginRight: '20px',
            sizingMode: 'boxed'
        },
        slots: {
            'quote-slider': {
                type: 'quote-slider'
            }
        }
    });

    Component.override('sw-cms-sidebar', {
        template: '{% block sw_cms_sidebar_block_overview_category_options %}{% parent %}<option value="custom">Custom components</option>{% endblock %}'
    });
})();
