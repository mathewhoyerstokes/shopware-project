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
        'techzone-two-column.buttonTwoUrl': 'Second button link'
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

    Component.override('sw-cms-sidebar', {
        template: '{% block sw_cms_sidebar_block_overview_category_options %}{% parent %}<option value="custom">Custom components</option>{% endblock %}'
    });
})();
