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

        return $this->render('app/index.html.twig', [
            'controller_name' => 'AppController',
            'items' => $items,
            'pagination' => $paginator->getPaginationInfo()
        ]);
    }

    #[Route('/block', name: 'app_block')]
    public function blockItems(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->getMethod() == 'POST') {
            $idsStr = $request->request->get('idsToBlock');
            $ids = json_decode($idsStr);
            $counter = 0;

            foreach ($ids as $id) {
                $item = $em->getRepository(Image::class)->find($id);
                $item->setVisible(false);
                $em->persist($item);
                $counter++;
            }

            $em->flush();
            $this->addFlash('success', 'Bloccate ' . $counter . ' immagini!');
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
