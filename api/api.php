<?php
// vlozit MysqliDb class
require_once("./MysqliDb.php");

// udaje pro pripojeni k databazi
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'passwd');
define('DB_NAME', 'test');

// vutvorit pripojeni k databazi
$db = new MysqliDb (DB_HOST, DB_USER, DB_PASS, DB_NAME);

// univerzalni funkce pro zjisteni parametru
// pokud parametr neexistuje vrátí prázdnej string
function param( $param ){
	if( isset($_POST[$param]) ){
		return $_POST[$param];
	}elseif ( isset($_GET[$param])	 ){
		return $_GET[$param];
	}else{
		return '';
	}
}

// vytvori Array z GET stringu nebo POST dat
$method = $_SERVER['REQUEST_METHOD'];
if( $method == 'POST' ){
	$params = $_POST;
}elseif( $method == 'GET' ){
	parse_str($_SERVER['QUERY_STRING'], $params);
}
//echo print_r($params);
// odstranit z parametru data ktera se do databaze ukladat nebudou
// akce kterou volas, a tabulka do který to vkladas
unset($params['id']);
unset($params['akce']);
unset($params['tabulka']);

// nastavit vsechny potrebny funkce
// pro praci s databazi
/*
	Funkce insert vklada data do databaze
*/
function insert( $db, $params ){
  $result = $db->insert( param('tabulka'), $params );
	if($result){
		$returnArr['id'] = $result;
		echo json_encode( $returnArr );
	}else{
		$returnArr = Array(
			'error' => $db->getLastError()
		);
		echo json_encode($returnArr);
	}
};

/*
	Funkce update
	vezme ID z parametru poslanejch z JS 
	a pokusi se aktualizovat zaznam v databazi s prislusnym ID
	pokud zaznam s ID nenajde, vyhodi error
*/
function update( $db, $params ){
	$db->where( 'id', param('id') );
	$result = $db->update( param('tabulka'), $params );
	if ( $result ){
		if( $db->count > 0 ){
			echo json_encode($result);
		}else{
			echo json_encode( Array( 'error' => "SQL: Notthing to update!" ) );
		}
	}else{
		echo json_encode( Array( 'error' => $db->getLastError() ) );
	}
};

/*
	Funkce delete jen veme ID a zkusi vymazat udaj z databaze
	pokud se to nepovede (zaznam neexistuje) hodi error
*/
function delete( $db ){
	$db->where('id', param('id'));
	$result = $db->delete( param('tabulka') );
	if( $result ) {
		echo json_encode( $result );
	}else{
		echo json_encode( Array( 'error' => "SQL: Notthing to delete!" ) );
	};
};

/* 
	muj osobni pristup
 	pokud potrebuju vic dat najednou priradim je do array
	a v js pak dostanu JSON Array:
	Object {
	 	test: ["data z tabulky 'testTable'"]
 	};
*/
function fetch( $db ){
 	// pokud nedostane promenou "tabulka" provede fetch vseho
	if( param('tabulka') == "" ){
		$returnArr = Array(
			'test' => $db->get( 'test' )
		);
	}else{
		// jinak vrati jen chtenou tabulku
		$returnArr = $db->get( param('tabulka') );
	}
	// poslat zpatky array se vsemi daty
	echo json_encode( $returnArr );
};

// zjistit jakou akci volas (v javascript nastavis akci do promeny "a")
$action = param('akce');

// chekni jakou akci ches a podle toho volej funkci
// switch je lepsi varianta if/elseif/else
switch ($action) {
	case 'update':
	  update( $db, $params );
	  break;
	case 'insert':
	  insert( $db, $params );
	  break;
	case 'delete':
	  delete( $db );
	  break;
	case 'fetch':
	  fetch( $db );
	  break;
}

?>