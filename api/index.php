<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Auth");

require("vendor/autoload.php");

session_start();
set_time_limit(0);

$c = new \Slim\Container();
$c["notFoundHandler"] = function($c) {
	return function($request, $response) use ($c) {
		return $c["response"]->withStatus(405);
	};
};

$app = new \Slim\App($c);

require("src/routes.php");

$app->run();
