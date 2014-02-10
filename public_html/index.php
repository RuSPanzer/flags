<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('Location: /login.php');
}
?>
<!DOCTYPE html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Собери пары. Страны мира</title>
    <link href="reset.css" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">
    <link href="style.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.7.2.js" type="text/javascript"></script>
    <script src="countryList.js" type="text/javascript"></script>
    <script src="script.js" type="text/javascript"></script>
    <script src="jquery.jqwindow.js" type="text/javascript"></script>
</head>

<body>
<div class="content">

    <h1><img src="globus.png" height="32" width="32">Собери пары. Страны мира</h1>

    <div class="time">
        <div>Осталось времени: <span id="currentTime"></span></div>
        <div class="progress_width">
            <div id="progressBar"></div>
        </div>
    </div>

    <div id="gametable">
        <table id="gamefield">
            <tr>
                <td id='1-1'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='1-2'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='1-3'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='1-4'>
                    <button disabled class="entity" type="button"></button>
                </td>
            </tr>
            <tr>
                <td id='2-1'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='2-2'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='2-3'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='2-4'>
                    <button disabled class="entity" type="button"></button>
                </td>
            </tr>
            <tr>
                <td id='3-1'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='3-2'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='3-3'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='3-4'>
                    <button disabled class="entity" type="button"></button>
                </td>
            </tr>
            <tr>
                <td id='4-1'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='4-2'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='4-3'>
                    <button disabled class="entity" type="button"></button>
                </td>
                <td id='4-4'>
                    <button disabled class="entity" type="button"></button>
                </td>
            </tr>
        </table>
    </div>

    <div id="gamebar">
        <div>Добро пожаловать, <?php echo($_SESSION['username']); ?></div>
        <div class="level-info">Уровень <span id="level"></span></div>
        <div id="score-wrapper">
            <div>Счет</div>
            <div id="score">0</div>
        </div>
        <div>
            Бонус за уровень: <span id="bonusTime"></span>
        </div>
        <div class="message"></div>
        <div class="newgame"><button type="button" class="btn btn-success" onclick="newGame();">Новая игра</button> </div>
        <div style="margin-top: 10px;"><button class="btn btn-info" onclick="getScoreTable();">Таблица рекордов</button></div>
        <div style="margin-top: 10px;"><button class="btn btn-info" onclick="about();">Инструкции</button></div>

    </div>

    <div class="clearfix"></div>
    <p style="margin-top: 10px;">(c) Рыбалка Михаил aka RuSPanzer</p>
    
    <div style="display: none;">
        <audio id="errorMusic">
            <source src="../sounds/error.mp3">
        </audio>
<!--        <audio id="gameOverMusic">
            <source src="sounds/gameover.mp3">
        </audio>-->
        <audio id="presentsMusic">
            <source src="../sounds/success.mp3">
        </audio>
<!--		<audio id="mainMusic" loop>
			<source src="sounds/main.mp3">
		</audio>-->
    </div>

</div>

</body>