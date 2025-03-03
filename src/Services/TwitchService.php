<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use TwitchApi\TwitchApi;

class TwitchService
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function getTwitchUser($twitch_access_token, TwitchApi $twitchApi){

        $response = $twitchApi->getUsersApi()->getUserByAccessToken($twitch_access_token);
        // Get and decode the actual content sent by Twitch.
        $responseContent = json_decode($response->getBody()->getContents());
        // Return the first (or only) user.
        return $responseContent->data[0];
        
    }
    
}