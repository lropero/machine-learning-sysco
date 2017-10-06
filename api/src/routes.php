<?php
define("API_KEY", "<API_KEY>");
define("ML_SCRIPT", "http://localhost/sysco/api/src/ml.py");

$app->get("/ml/{customer:[0-9]+}", function($request, $response, $args) {

	$authorization = $request->getHeaderLine("Auth");
	if(!strlen($authorization) || strcmp($authorization, API_KEY)) {
		return $response->withStatus(401);
	}

	$customer = $request->getAttribute("customer");

	if($customer) {

		$files = glob("img/*");
		foreach($files as $file){
			if(is_file($file)) {
				unlink($file);
			}
		}

		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, ML_SCRIPT . "?customer=" . $customer);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$res = curl_exec($curl);
		curl_close($curl);

		$imgs = [];
		$files = glob("img/*");
		foreach($files as $file){
			if(is_file($file)) {
				$imgs[] = base64_encode(file_get_contents($file));
			}
		}

		return $response->write(json_encode($imgs));
	}

	return $response->withStatus(404);
});
