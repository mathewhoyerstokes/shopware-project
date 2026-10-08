<?php declare(strict_types=1);

namespace TechZone\Content\Cms;

use Shopware\Core\Content\Media\Cms\ImageCmsElementResolver;

class HeroCmsElementResolver extends ImageCmsElementResolver
{
    public function getType(): string
    {
        return 'hero';
    }
}
