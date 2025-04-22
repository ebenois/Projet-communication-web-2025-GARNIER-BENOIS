<?php
    $host = 'localhost'; //variables de connexion
    $dbname = 'gestion_notes';
    $username = 'root';
    $password = '';
    try 
    {
        $bdd = new PDO('mysql:host='. $host .';dbname='. $dbname .';charset=utf8',
        $username, $password);
    } 
    catch(Exception $e) 
    {
        // Si erreur, tout arrêter
        die('Erreur : '. $e->getMessage());
    }
    $requete = 'SELECT * FROM utilisateurs';
    $resultat = $bdd->query($requete);
    //$tableau = $resultat->fetch(); // On récupère la première ligne
    //echo $tableau["nom"] . " " . $tableau["prenom"];
    while ($ligne = $resultat->fetch(PDO::FETCH_ASSOC)) {
        echo $ligne["nom"] . " " . $ligne["prenom"] . "<br>";
    }
?>