<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Image;
use App\Utility\PaginatorInfo;

class AppController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(Request $request, EntityManagerInterface $em): Response
    {
        $paginator = new PaginatorInfo($request, $em, Image::class);
        $items = $paginator->getResult();

        //Formatto il campo date degli elementi per avere anno-mese-giorno
        $items = array_map(function ($item) {
            $item['date'] = date_format($item['date'], 'Y-m-d');
            return $item;
        }, $items);

        //Stabilisco se nel database c'è almeno un immagine bloccata (mi serve lato client per disabilitare o abilitare il bottone per il ripristino)
        $isBlocked = $em->createQueryBuilder()->select('a')->from(Image::class, 'a')->where('a.visible = false')->setMaxResults(1)->getQuery()->getResult();
        count($isBlocked) > 0 ? $isBlocked = true : $isBlocked = false;

        return $this->render('app/index.html.twig', [
            'controller_name' => 'AppController',
            'items' => $items,
            'pagination' => $paginator->getPaginationInfo(),
            'isBlocked' => $isBlocked
        ]);
    }

    #[Route('/block', name: 'app_block')]
    public function blockItems(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->getMethod() == 'POST') {
            $idsStr = $request->request->get('idsToBlock');
            $ids = json_decode($idsStr);

            $items = $em->createQueryBuilder()->select('a')->from(Image::class, 'a')->where('a.id IN (:ids)')->setParameter('ids', $ids)->getQuery()->getResult();
            foreach($items as $item) {
                $item->setVisible(false);
                $em->persist($item);
            }

            $em->flush();
            $this->addFlash('success', 'Bloccate ' . count($ids) . ' immagini!');
        }

        return $this->redirectToRoute('app_home');
    }

    #[Route('/restore', name: 'app_restore')]
    public function restore(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->getMethod() == 'POST') {
            $items = $em->createQueryBuilder()->select('a')->from(Image::class, 'a')->where('a.visible = false')->getQuery()->getResult();

            foreach ($items as $item) {
                $item->setVisible(true);
                $em->persist($item);
            }

            $em->flush();
            $this->addFlash('success', 'Ripristinate ' . count($items) . ' immagini!');
        }
        return $this->redirectToRoute('app_home');
    }
}
