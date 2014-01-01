<?php
session_start();
if (isset($_COOKIE['auth'])) {
    $_SESSION['username'] = $_COOKIE['auth'];
    header('Location: /');
}

if (isset($_SESSION['username'])) {
    header('Location: /');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['username']) {
    $name = $_POST['username'];
    $_SESSION['username'] = $name;
    if (!isset($_POST['remember'])) {
        setcookie('auth', $name, time()+60*60*24*30);
    } else {
        setcookie('auth', '', time()-60*60*24*30);
    }
    header('Location: /');
}

?>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Залогиниться в системе</title>
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
        <style>
            .form-signin {
                max-width: 600px;
                padding: 15px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <form class="form-signin" role="form" method="post">
                <h1><img src="globus.png" height="32" width="32">Собери пары. Страны мира</h1>
                <h2 class="form-signin-heading">Пожалуйста, представьтесь системе:</h2>
                <input type="text" name="username" class="form-control" placeholder="Ваше имя" required="" autofocus="">
                <label class="checkbox">
                    <input name="remember" type="checkbox" value="remember-me">Не запоминать меня
                </label>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Отправить</button>
            </form>
        </div>
    </body>

</html>