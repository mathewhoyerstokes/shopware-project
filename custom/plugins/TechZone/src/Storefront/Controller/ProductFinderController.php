<?php declare(strict_types=1);

namespace TechZone\Storefront\Controller;

use Shopware\Core\Content\Product\Aggregate\ProductVisibility\ProductVisibilityDefinition;
use Shopware\Core\Content\Product\SalesChannel\ProductAvailableFilter;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Struct\ArrayEntity;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepositoryInterface;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Storefront\Framework\Cache\Annotation\HttpCache;
use Shopware\Storefront\Page\GenericPageLoader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @RouteScope(scopes={"storefront"})
 */
class ProductFinderController extends StorefrontController
{
    /**
     * @var GenericPageLoader
     */
    private $genericPageLoader;

    /**
     * @var SalesChannelRepositoryInterface
     */
    private $productRepository;

    /**
     * @var EntityRepositoryInterface
     */
    private $optionRepository;

    public function __construct(
        GenericPageLoader $genericPageLoader,
        SalesChannelRepositoryInterface $productRepository,
        EntityRepositoryInterface $optionRepository
    ) {
        $this->genericPageLoader = $genericPageLoader;
        $this->productRepository = $productRepository;
        $this->optionRepository = $optionRepository;
    }

    /**
     * @HttpCache()
     * @Route("/finder", name="frontend.techzone.finder", methods={"GET"})
     */
    public function matches(Request $request, SalesChannelContext $context): Response
    {
        $page = $this->genericPageLoader->load($request, $context);
        $optionId = strtolower((string) $request->query->get('properties', ''));
        $products = null;
        $optionName = '';
        $groupName = '';

        if (Uuid::isValid($optionId)) {
            $optionCriteria = new Criteria([$optionId]);
            $optionCriteria->addAssociation('group');
            $option = $this->optionRepository->search($optionCriteria, $context->getContext())->first();

            if ($option) {
                $optionName = (string) $option->getTranslation('name');
                $group = $option->getGroup();
                $groupName = $group ? (string) $group->getTranslation('name') : '';

                $criteria = new Criteria();
                $criteria->addFilter(new EqualsAnyFilter('product.propertyIds', [$optionId]));
                $criteria->addFilter(new EqualsFilter('product.parentId', null));
                $criteria->addFilter(new ProductAvailableFilter(
                    $context->getSalesChannel()->getId(),
                    ProductVisibilityDefinition::VISIBILITY_ALL
                ));
                $criteria->addAssociation('cover.media');
                $criteria->setLimit(24);

                $products = $this->productRepository->search($criteria, $context);
            }
        }

        $page->addExtension('productFinder', new ArrayEntity([
            'products' => $products,
            'optionName' => $optionName,
            'groupName' => $groupName,
        ]));

        return $this->renderStorefront('@Storefront/storefront/page/finder/index.html.twig', [
            'page' => $page,
        ]);
    }
}
