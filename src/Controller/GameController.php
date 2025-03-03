<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use TwitchApi\TwitchApi;
use App\Services\TwitchService;

final class GameController extends AbstractController
{

    private $twitchService;

    public function __construct(TwitchService $twitchService)
    {
        $this->twitchService = $twitchService;
    }

    #[Route('/lobby', name: 'lobby')]
    public function createLobby(Request $request): Response
    {
        $session = $request->getSession();
        $twitch_client_id = $this->getParameter('client_id');
        $twitch_client_secret = $this->getParameter('client_secret');
        
        $helixGuzzleClient = new \TwitchApi\HelixGuzzleClient($twitch_client_id);
        $twitchApi = new \TwitchApi\TwitchApi($helixGuzzleClient, $twitch_client_id, $twitch_client_secret);
        $twitch_access_token = $session->get('access_token');
        $user = $this->twitchService->getTwitchUser($twitch_access_token, $twitchApi);

        return $this->render('game/lobby.html.twig', [
            'client_id' => $twitch_client_id,
            'user' => $user,
            'access_token' => $twitch_access_token
        ]);
    }

    #[Route('/settings', name: 'settings')]
    public function manageSettings(Request $request): Response
    {
        return $this->render('game/settings.html.twig', [
            'controller_name' => 'GameController',
        ]);
    }

    #[Route('/customize', name: 'customize')]
    public function customizeHorse(Request $request): Response
    {
        return $this->render('game/customize.html.twig', [
            'controller_name' => 'GameController',
        ]);
    }

    #[Route('/rankings', name: 'rankings')]
    public function getRanking(Request $request): Response
    {
        return $this->render('game/rankings.html.twig', [
            'controller_name' => 'GameController',
        ]);
    }

    
}
