<?php
// include the database object
include('connectdb.php');

// represents a logged in player
// contains the player's name, id, and in-game preferences
class Player {
	private $playerName;
	private $playerId; // create new or return existing from db

	// fetches id for this player from the database
	private function fetchPlayerId() {
		global $db;

		// get id for this player, if it exists (user has played before)
		$get_id_query = $db->prepare("SELECT id FROM players WHERE name = :name;");
		$get_id_query->execute(array('name' => $this->playerName));
		$rows = $get_id_query->fetchAll();

		// if id exists, assign it to the scope variable
		// otherwise, create a new entry in the database
		if (!empty($rows[0]['id'])) {
			return $rows[0]['id'];
		} else {
			return $this->createPlayerRow();
		}
	}

	// creates a new entry for the player in the database
	private function createPlayerRow() {
		global $db;

		$insert_query = $db->prepare("INSERT INTO players (name) VALUES (:name);");
		$insert_query->execute(array('name' => $this->playerName));
		
		$get_last_id = $db->prepare("SELECT LAST_INSERT_ID();");
		$get_last_id->execute();
		$rows = $get_last_id->fetchAll();

		return $rows[0][0];
	}

	public function __construct($name) {
		$this->playerName = $name;
		// automatically creates a new id if player does not exist already
		$this->playerId = $this->fetchPlayerId();
	}

	public function getName() {
		return $this->playerName;
	}

	public function getId() {
		return $this->playerId;
	}

}
