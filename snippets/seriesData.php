<?php
require_once('../connect.php');
$res = sendQuery('SELECT * FROM series ORDER BY seriesName');
echo json_encode($res->fetch_all());
?>