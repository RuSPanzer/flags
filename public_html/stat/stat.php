<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
$config = require_once('../../application/config.php');

function xmlHttpCheck() {
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
        print_r('Попытка обмануть систему :-)');
        return false;
    }
    return true;
}

if (!isset($_SESSION['username'])) {
    header('Location: /');
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (!isset($_SERVER['HTTP_REFERER']) || !strpos($_SERVER['HTTP_REFERER'], $_SERVER['HTTP_HOST'])) {
        print_r('Чтобы получить доступ к этой страничке перейдите на главную страницу сайта и воспользуйтесь соотвествующей кнопкой');
    } else {
        $db = new SafeMySQL($config['db']);

        $method = $_GET['method'];

        switch ($method) {
            case 'all' :
            {
                $sql = 'SELECT * FROM user_stat ORDER BY score DESC' . ';';

                $selectedRow = 0;

                $array = $db->getAll($sql);

                $i = 0;
                print_r('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
                print_r('<title>Таблица рекордов</title>');
                print_r('<h4>Таблица рекордов</h4>');
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

                break;
            }
            case 'min' :
            {
                if (xmlHttpCheck()) {
                    $sql = 'SELECT MIN(score) FROM user_stat' . ';';
                    $min = $db->getOne($sql);
                    print_r($min);
                }
                break;
            }
            case 'set' :
            {
                if (xmlHttpCheck()) {
                    $score = $_GET['score'];
                    $level = $_GET['level'];
                    $name = $_SESSION['username'];

                    $sql = 'SELECT MIN(score) FROM user_stat' . ';';
                    $min = $db->getOne($sql);

                    $sql = 'SELECT COUNT(*) FROM user_stat' . ';';
                    $count = $db->getOne($sql);

                    if ($count == 10) {
                        $sql = 'SELECT id FROM user_stat ORDER BY score' . ';' ;
                        $deletedIndex = $db->getOne($sql);
                        print_r($deletedIndex);
                        $sql = 'DELETE FROM user_stat WHERE id = ' . $deletedIndex . ';';
                        $db->query($sql);
                    }

                    $sql = "INSERT INTO user_stat (name, score, level) VALUES ('$name', $score, $level)" . ';';
                    $db->query($sql);
                }
                break;
            }
        }
    };


}