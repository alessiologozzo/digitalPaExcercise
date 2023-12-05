<?php
namespace App\Utility;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\Tools\Pagination\Paginator;

class PaginatorInfo {
    private Paginator $paginator;
    private int $currentPage;
    private int $lastPage;

    private ?string $lastSearch = null;

    public function __construct(Request $request, EntityManagerInterface $em, string $entityName, int $itemsPerPage = 10) {
        $page = $request->query->get('page');
        isset($page) && is_numeric($page) && (int) $page > 0 ? $this->currentPage = (int) $page : $this->currentPage = 1; 

        $search = $request->query->get('search');

        $qb = $em->createQueryBuilder()->select('a')->from($entityName, 'a')->where('a.visible = true');

        $random = $request->query->get('random');
        if(isset($random))
            $qb->orderBy('RAND()');
        else if(isset($search)) {
            $qb->andWhere('a.name LIKE :search')->setParameter('search', $search . '%');
            $this->lastSearch = $search;
        }

        $this->paginator = new Paginator($qb);
        $this->paginator->getQuery()->setFirstResult(($this->currentPage - 1) * $itemsPerPage)->setMaxResults($itemsPerPage);

        $this->lastPage = isset($random) ? 1 : (int) ceil($this->paginator->count() / $itemsPerPage);
    }

    public function getResult() {
        return $this->paginator->getQuery()->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    }

    public function getPaginationInfo() {
        return [
            'currentPage' => $this->currentPage,
            'lastPage' => $this->lastPage,
            'lastSearch' => $this->lastSearch
        ];
    }
}