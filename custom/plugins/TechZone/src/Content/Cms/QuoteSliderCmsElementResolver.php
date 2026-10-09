<?php declare(strict_types=1);

namespace TechZone\Content\Cms;

use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\MediaEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;

class QuoteSliderCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'quote-slider';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $mediaIds = [];

        for ($index = 1; $index <= 4; $index++) {
            $mediaConfig = $slot->getFieldConfig()->get('media' . $index);

            if ($mediaConfig && $mediaConfig->getValue()) {
                $mediaIds[] = $mediaConfig->getValue();
            }
        }

        if ($mediaIds === []) {
            return null;
        }

        $criteria = new Criteria($mediaIds);
        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('media_' . $slot->getUniqueIdentifier(), MediaDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $slider = new QuoteSliderStruct();
        $slot->setData($slider);

        $searchResult = $result->get('media_' . $slot->getUniqueIdentifier());

        for ($index = 1; $index <= 4; $index++) {
            $mediaConfig = $slot->getFieldConfig()->get('media' . $index);
            $media = null;

            if ($searchResult && $mediaConfig && $mediaConfig->getValue()) {
                /** @var MediaEntity|null $media */
                $media = $searchResult->get($mediaConfig->getValue());
            }

            $slider->setSlide($index, $media);
        }
    }
}
