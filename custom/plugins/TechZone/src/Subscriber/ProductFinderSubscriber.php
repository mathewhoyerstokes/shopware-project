<?php declare(strict_types=1);

namespace TechZone\Subscriber;

use Shopware\Core\Content\Property\PropertyGroupCollection;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Storefront\Page\Navigation\NavigationPageLoadedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductFinderSubscriber implements EventSubscriberInterface
{
    private const EXCLUDED_GROUPS = ['color', 'focus'];

    private const GROUP_ORDER = [
        'trading cards' => 0,
        'pokemon' => 1,
        'stem products' => 2,
    ];

    /**
     * @var EntityRepositoryInterface
     */
    private $propertyGroupRepository;

    public function __construct(EntityRepositoryInterface $propertyGroupRepository)
    {
        $this->propertyGroupRepository = $propertyGroupRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            NavigationPageLoadedEvent::class => 'onNavigationPageLoaded',
        ];
    }

    public function onNavigationPageLoaded(NavigationPageLoadedEvent $event): void
    {
        if ($event->getRequest()->attributes->get('_route') !== 'frontend.home.page') {
            return;
        }

        $criteria = new Criteria();
        $criteria->addAssociation('options');

        $groups = new PropertyGroupCollection();

        foreach ($this->propertyGroupRepository->search($criteria, $event->getContext()) as $group) {
            $name = mb_strtolower(trim((string) $group->getTranslation('name')));

            if (\in_array($name, self::EXCLUDED_GROUPS, true)) {
                continue;
            }

            $options = $group->getOptions();

            if ($options === null || $options->count() === 0) {
                continue;
            }

            $options->sort(static function ($left, $right): int {
                $position = ((int) $left->getTranslation('position')) <=> ((int) $right->getTranslation('position'));

                if ($position !== 0) {
                    return $position;
                }

                return strcasecmp((string) $left->getTranslation('name'), (string) $right->getTranslation('name'));
            });

            $groups->add($group);
        }

        $groups->sort(static function ($left, $right): int {
            $leftName = mb_strtolower(trim((string) $left->getTranslation('name')));
            $rightName = mb_strtolower(trim((string) $right->getTranslation('name')));
            $leftOrder = self::GROUP_ORDER[$leftName] ?? 100;
            $rightOrder = self::GROUP_ORDER[$rightName] ?? 100;

            if ($leftOrder !== $rightOrder) {
                return $leftOrder <=> $rightOrder;
            }

            return strcasecmp($leftName, $rightName);
        });

        $event->getPage()->addExtension('productFinderGroups', $groups);
    }
}
