<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $imagesData = json_decode(file_get_contents(dirname(__DIR__, 2) . '\\config\\data.json'))->data;
        shuffle($imagesData);
        foreach ($imagesData as $data) {
            $image = new Image($data->name, $data->src, \DateTime::createFromFormat('Y-m-d', $data->date));
            $manager->persist($image);
        }

        $manager->flush();
    }
}
