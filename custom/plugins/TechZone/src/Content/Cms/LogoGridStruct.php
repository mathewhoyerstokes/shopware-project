<?php declare(strict_types=1);

namespace TechZone\Content\Cms;

use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\Struct\Struct;

class LogoGridStruct extends Struct
{
    /**
     * @var array<int, MediaEntity|null>
     */
    protected $items = [];

    public function getItems(): array
    {
        return $this->items;
    }

    public function setItem(int $index, ?MediaEntity $media): void
    {
        $this->items[$index] = $media;
    }
}
