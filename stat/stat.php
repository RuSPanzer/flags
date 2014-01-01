<?php
session_start();
header('Content-Type: text/html; charset=utf-8');

function getTable($array, $selectedRow = 0)
{
    $i = 0;
    print_r('<table border="1">
            <tr>
                <td>Позиция</td>
                <td>Имя</td>
                <td>Уровень</td>
                <td>Итоговый счет</td>
            </tr>');
    foreach ($array as $element) {
        $style = $selectedRow == ++$i ? 'style="font-weight: bold;"' : '';
        print_r('<tr ' . $style . '>');
        print_r('<td>' . $i . '</td><td>' . $element['name'] . '</td><td>' . $element['level'] . '</td><td>' . $element['score']);
        print_r('</tr>');
    }
    print_r('</table>');
}

function getMinScore($array)
{
    if (count($array) < 9) {
        return 0;
    }
    $min = $array[0]['score'];
    foreach ($array as $element) {
        if ($min >= $element['score']) {
            $min = $element['score'];
        }
    }
    return $min ? $min : 0;
}


function multiSort($a, $b){
    if ($a['score'] == $b['score']) {
        return 0;
    }
    return ($a['score'] < $b['score']) ? 1 : -1;
}

function getIndexByNameAndScore($array, $name, $score, $level)
{
    foreach ($array as $key => $element) {
        if ($element['name'] == $name && $element['score'] == $score && $element == $level) {
            return $key;
        }
    }
    return -1;
}

if (!isset($_SESSION['username'])) {
    header('Location: /');
}

$username = $_SESSION['username'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $method = $_GET['method'];
    $jsonString = file_get_contents(realpath('stat.json'));
    $json = json_decode($jsonString, true);
    switch ($method) {
        case 'all' :
        {
            getTable($json);
            break;
        }
        case 'min' :
        {
            $min = getMinScore($json);
            print_r($min);
            break;
        }
        case 'set' :
        {
            $score = $_GET['score'];
            $level = $_GET['level'];
            $result = array();
            $insert = false;
            $i=0;

            $result = $json;

            if ($score >= getMinScore($json)) {
                $result[] = array(
                    'name' => $username,
                    'score' => $score,
                    'level' => $level
                );
                usort($result, 'multiSort');
                if (count($result) == 10) {
                    array_pop($result);
                }
            }

            $resultJsonString = json_encode($result);
            file_put_contents('stat.json', $resultJsonString);
            getTable($result, getIndexByNameAndScore($result, $username, $score, $level));
            break;
        }
        case 'test':
        {
            print_r($_SESSION['auth']);
        }
    }
}