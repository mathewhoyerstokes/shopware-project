<?php declare(strict_types=1);

namespace TechZone\Content\Cms;

use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\Struct\Struct;

class QuoteSliderStruct extends Struct
{
    /**
     * @var array<int, MediaEntity|null>
     */
    protected $slides = [];

    public function getSlides(): array
    {
        return $this->slides;
    }

    public function setSlide(int $index, ?MediaEntity $media): void
    {
        $this->slides[$index] = $media;
    }
}
