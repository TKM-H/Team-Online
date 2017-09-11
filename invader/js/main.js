// - global -------------------------------------------------------------------
var screenCanvas, info;
var run = true;
var fps = 1000 / 30;
var mouse = new Point();
var ctx;
var fire = false;
var fire2 = false;
var counter = 0;
var score = 0;
var message = "";
var move1 = new Point();
var move2 = new Point();

var input_key_buffer = new Array();

// - const --------------------------------------------------------------------
var CHARA_COLOR = 'rgba(0, 0, 255, 0.75)';
var CHARA_SHOT_COLOR = 'rgba(0, 255, 0, 0.75)';
var CHARA_SHOT_MAX_COUNT = 1;

var ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
var ENEMY_MAX_COUNT = 10;

var ENEMY_SHOT_COLOR = 'rgba(255, 0, 255, 0.75)';
var ENEMY_SHOT_MAX_COUNT = 100;

var BOSS_COLOR = 'rgba(128, 128, 128, 0.75)';
var BOSS_BIT_COLOR = 'rgba(64, 64, 64, 0.75)';
var BOSS_BIT_COUNT = 5;


// - main ---------------------------------------------------------------------
window.onload = function () {

    // スクリーンの初期化
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 300;
    screenCanvas.height = 600;

    // 2dコンテキスト
    ctx = screenCanvas.getContext('2d');

    // イベントの登録
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('keyup', keyUp, true);
   

    // その他のエレメント関連
    info = document.getElementById('info');

    // 自機初期化
    var chara = new Character();
    chara.init(10);
    chara.position.x = 100;
    chara.position.y = 500;

    var chara2 = new Character();
    chara2.init(10);
    chara2.position.x = 100;
    chara2.position.y = 100;
    

    var enemy = new Array(ENEMY_MAX_COUNT);
    for (i = 0; i < ENEMY_MAX_COUNT; i++) {
        enemy[i] = new Enemy();
    }

    var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
    for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        charaShot[i] = new CharacterShot();
    }

    var charaShot2 = new Array(CHARA_SHOT_MAX_COUNT);
    for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        charaShot2[i] = new CharacterShot();
    }

    // エネミーショット初期化
    var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
    for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        enemyShot[i] = new EnemyShot();
    }

    // ボス初期化
    var boss = new Boss();

    // ボスのビットを初期化
    var bit = new Array(BOSS_BIT_COUNT);
    for (i = 0; i < BOSS_BIT_COUNT; i++) {
        bit[i] = new Bit();
    }


    // ------------------------------------------------------------
    // キーボードを押したときに実行されるイベント
    // ------------------------------------------------------------
    document.onkeydown = function (e) {
        if (!e) e = window.event; // レガシー

        input_key_buffer[e.keyCode] = true;
    };

    // ------------------------------------------------------------
    // キーボードを離したときに実行されるイベント
    // ------------------------------------------------------------
    document.onkeyup = function (e) {
        if (!e) e = window.event; // レガシー

        input_key_buffer[e.keyCode] = false;
    };

    // ------------------------------------------------------------
    // ウィンドウが非アクティブになる瞬間に実行されるイベント
    // ------------------------------------------------------------
    window.onblur = function () {
        // 配列をクリアする
        input_key_buffer.length = 0;
    };

    function KeyIsDown(key_code) {

        if (input_key_buffer[key_code]) return true;

        return false;
    }


    // レンダリング処理を呼び出す
    (function () {
        ////////////移動処理(UP)///////////////// 
        if (KeyIsDown(68)) {
            if (KeyIsDown(65)) {
                move1.x = 0;
            } else {
                move1.x = 2;
            }
        }
        else if (!KeyIsDown(65)) {
            move1.x = 0;
        }

        if (KeyIsDown(65)) {
            if (KeyIsDown(68)) {
                move1.x = 0;
            } else {
                move1.x = -2;
            }
        }
        else if (!KeyIsDown(68)) {
            move1.x = 0;
        }
        ////////////移動処理(Down)///////////////// 
        if (KeyIsDown(39)) {
            if (KeyIsDown(37)) {
                move2.x = 0;
            } else {
                move2.x = 2;
            }
        }
        else if (!KeyIsDown(37)) {
            move2.x = 0;
        }

        if (KeyIsDown(37)) {
            if (KeyIsDown(39)) {
                move2.x = 0;
            } else {
                move2.x = -2;
            }
        }
        else if (!KeyIsDown(39)) {
            move2.x = 0;
        }
        ///////////////////////////////
        
        counter++;
        // カウンターの値によってシーン分岐
        switch (true) {
            // カウンターが70より小さい
            case counter < 70:
                message = 'READY...';
                break;

                // カウンターが100より小さい
            case counter < 100:
                message = 'GO!!';
                break;

                // カウンターが100以上
            default:
                message = '';
        }

        // fireフラグの値により分岐
        if (fire) 
		{
            // すべての自機ショットを調査する
            for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) 
			{
                // 自機ショットが既に発射されているかチェック
                if (!charaShot[i].alive) 
				{
                    // 自機ショットを新規にセット
                    charaShot[i].set(chara.position, 3, 5);

                    // ループを抜ける
                    break;
                }
            }
			//////////////////////////中東//////////////////////////
            var flag = 1;
            if(name == "1")//1Pなら2P用の関数に送る
            {
              socket.emit('shotChar2', {uname:name, shot:flag});
            }
            if(name == "2")//2Pなら1P用の関数に送る
            {
              socket.emit('shotChar1', {uname: name, shot:flag});
            }
            ////////////////////////////////////////////////////end
            // フラグを降ろしておく
            fire = false;
        }

        // fire2フラグの値により分岐
        if (fire2) {
            // すべての自機ショットを調査する
            for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
                // 自機ショットが既に発射されているかチェック
                if (!charaShot2[i].alive) {
                    // 自機ショットを新規にセット
                    charaShot2[i].set(chara2.position, 3, 5);

                    // ループを抜ける
                    break;
                }
            }
            // フラグを降ろしておく
            fire2 = false;
        }

        // screenクリア
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        ////////////////////////
        // パスの設定を開始
        ctx.beginPath();
		
		
		////////////1p, 2p の座標データをサーバーに送信////作成者　中東/////////
        var x = chara.position.x;
        var y = chara.position.y;
        if(name == "1")//1Pなら2P用の関数に送る
        {
          socket.emit('moveChar2', {uname:name, disx:x, disy:y});
        }
        if(name == "2")//2Pなら1P用の関数に送る
        {
          socket.emit('moveChar1',{uname: name, disx:x, disy:y});
        }
        //////////////////////////////////////////////////////////////end


        // 自機の位置を設定
        chara.position.x = chara.position.x;
        chara.position.y = chara.position.y;

        // 自機を描くパスを設定
        ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);

        chara.move(move2);

        // 自機の色を設定する
        ctx.fillStyle = CHARA_COLOR;

        // 自機を描く
        ctx.fill();
        ///////////////////
        ctx.beginPath();

        chara2.position.x = chara2.position.x;
        chara2.position.y = chara2.position.y;

        ctx.arc(chara2.position.x, chara2.position.y, chara2.size, 0, Math.PI * 2, false);

        //chara2.move(move1);
		////////サーバから相手の座標を取得し反映///////作成者　中東//////////////////
        if(name == "1")
        {
          socket.on('moveChar1', function(data)
          {
            if(data)
            {
              var vx = parseInt(data.disx);
              var vy = parseInt(data.disy);

              chara2.position.x = screenCanvas.width - vx;
              chara2.position.y = screenCanvas.height - vy;
            }
          });


          socket.on('shotChar1', function(data)
          {
              var f = parseInt(data.shot);
              if(f ==1)
              {
                for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++)
                {
                    if (!charaShot[i].alive)
                    {
                      charaShot[i].set(chara2.position, 3, - 5);
                      socket.emit('shotChar1', {uname:name, shot:0});
                      break;
                    }
                 }
               }
           });
        }

        if(name == "2")
        {
          socket.on('moveChar2', function(data)
          {
            if(data)
            {
              var vx = parseInt(data.disx);
              var vy = parseInt(data.disy);

              chara2.position.x = screenCanvas.width - vx;
              chara2.position.y = screenCanvas.height - vy;
            }
          });

          socket.on('shotChar2', function(data)
          {
              var f = parseInt(data.shot);

              if(f ==1)
              {
                for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++)
                {
                   if (!charaShot[i].alive)
                   {
                      charaShot[i].set(chara2.position, 3, - 5);
                      socket.emit('shotChar2', {uname:name, shot:0});
                      break;
                   }
                }
              }
          });
        }

        ////////////////////////////////////////////////////////end

        ctx.fillStyle = CHARA_COLOR;

        ctx.fill();

        /////////////////////////////////
        // パスの設定を開始
        ctx.beginPath();

        // すべての自機ショットを調査する
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // 自機ショットが既に発射されているかチェック
            if (charaShot[i].alive) {
                // 自機ショットを動かす
                charaShot[i].move();

                // 自機ショットを描くパスを設定
                ctx.arc(
                    charaShot[i].position.x,
                    charaShot[i].position.y,
                    charaShot[i].size,
                    0, Math.PI * 2, false
                );

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // 自機ショットの色を設定する
        ctx.fillStyle = CHARA_SHOT_COLOR;

        // 自機ショットを描く
        ctx.fill();
        ////////////

        ///////////////////
        // パスの設定を開始
        ctx.beginPath();

        // すべての自機ショットを調査する
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // 自機ショットが既に発射されているかチェック
            if (charaShot2[i].alive) {
                // 自機ショットを動かす
                charaShot2[i].move();

                // 自機ショットを描くパスを設定
                ctx.arc(
                    charaShot2[i].position.x,
                    charaShot2[i].position.y,
                    charaShot2[i].size,
                    0, Math.PI * 2, false
                );

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // 自機ショットの色を設定する
        ctx.fillStyle = CHARA_SHOT_COLOR;

        // 自機ショットを描く
        ctx.fill();
        ////////////

        // エネミーの出現管理 -------------------------------------------------
        // 1000 フレーム目までは 100 フレームに一度出現させる
        if (counter % 100 === 0 && counter < 1000) {
            // すべてのエネミーを調査する
            for (i = 0; i < ENEMY_MAX_COUNT; i++) {
                // エネミーの生存フラグをチェック
                if (!enemy[i].alive) {
                    // タイプを決定するパラメータを算出
                    j = (counter % 200) / 100;

                    // タイプに応じて初期位置を決める
                    var enemySize = 15;
                    enemy[i].position.x = -enemySize + (screenCanvas.width + enemySize * 2) * j
                    enemy[i].position.y = screenCanvas.height / 2;

                    // エネミーを新規にセット
                    enemy[i].set(enemy[i].position, enemySize, j);

                    // 1体出現させたのでループを抜ける
                    break;
                }
            }
        } /*else if (counter === 1000) {
            // 1000 フレーム目にボスを出現させる
            boss.position.x = screenCanvas.width / 2;
            boss.position.y = -80;
            boss.set(boss.position, 50, 30);
            alert("boss");
            // 同時にビットも出現させる
            for (i = 0; i < BOSS_BIT_COUNT; i++) {
                j = 360 / BOSS_BIT_COUNT;
                bit[i].set(boss, 15, 5, i * j);
            }
        }*/


        // すべてのエネミーを調査する
        for (i = 0; i < ENEMY_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (enemy[i].alive) {
                // エネミーを動かす
                enemy[i].move();

                // エネミーを描くパスを設定
                ctx.arc(
                    enemy[i].position.x,
                    enemy[i].position.y,
                    enemy[i].size,
                    0, Math.PI * 2, false
                );

                // ショットを打つかどうかパラメータの値からチェック
                if (enemy[i].param % 30 === 0) {
                    // エネミーショットを調査する
                    for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                        if (!enemyShot[j].alive) {
                            // エネミーショットを新規にセットする
                            p = new Point();
                            p.x = 0;
                            p.y = 2;
                            enemyShot[j].set(enemy[i].position, p, 5, 5);

                            // 1個出現させたのでループを抜ける
                            break;
                        }
                    }
                }

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // エネミーの色を設定する
        ctx.fillStyle = ENEMY_COLOR;

        // エネミーを描く
        ctx.fill();

        ////////////////
        // ボス -------------------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // ボスの出現フラグをチェック
        if (boss.alive) {
            // ボスを動かす
            boss.move();

            // ボスを描くパスを設定
            ctx.arc(
                boss.position.x,
                boss.position.y,
                boss.size,
                0, Math.PI * 2, false
            );

            // パスをいったん閉じる
            ctx.closePath();
        }

        // ボスの色を設定する
        ctx.fillStyle = BOSS_COLOR;

        // ボスを描く
        ctx.fill();

        // ビット -------------------------------------------
        // パスの設定を開始
        ctx.beginPath();

        // すべてのビットを調査する
        for (i = 0; i < BOSS_BIT_COUNT; i++) {
            // ビットの出現フラグをチェック
            if (bit[i].alive) {
                // ビットを動かす
                bit[i].move();

                // ビットを描くパスを設定
                ctx.arc(
                    bit[i].position.x,
                    bit[i].position.y,
                    bit[i].size,
                    0, Math.PI * 2, false
                );

                // ショットを打つかどうかパラメータの値からチェック
                if (bit[i].param % 25 === 0) {
                    // エネミーショットを調査する
                    for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                        if (!enemyShot[j].alive) {
                            // エネミーショットを新規にセットする
                            p = bit[i].position.distance(chara.position);
                            p.normalize();
                            enemyShot[j].set(bit[i].position, p, 4, 1.5);

                            // 1個出現させたのでループを抜ける
                            break;
                        }
                    }
                }

                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // ビットの色を設定する
        ctx.fillStyle = BOSS_BIT_COLOR;

        // ビットを描く
        ctx.fill();

        ///////////////
        ctx.beginPath();

        // すべての敵ショットを調査する
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            // 敵ショットが既に発射されているかチェック
            if (enemyShot[i].alive) {
                // 敵ショットを動かす
                enemyShot[i].move();

                // 敵ショットを描くパスを設定
                ctx.arc(
                    enemyShot[i].position.x,
                    enemyShot[i].position.y,
                    enemyShot[i].size,
                    0, Math.PI * 2, false
                );


                // パスをいったん閉じる
                ctx.closePath();
            }
        }

        // 敵ショットの色を設定する
        ctx.fillStyle = ENEMY_SHOT_COLOR;

        // 敵ショットを描く
        ctx.fill();

        /////////////////////////
        // 衝突判定 ---------------------------------------------------

        // 自機とエネミーショットとの衝突判定
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            // エネミーショットの生存フラグをチェック
            if (enemyShot[i].alive) {
                // 自機とエネミーショットとの距離を計測
                p = chara.position.distance(enemyShot[i].position);
                if (p.length() < chara.size) {
                    // 衝突していたら生存フラグを降ろす
                    chara.alive = false;

                    // 衝突があったのでパラメータを変更してループを抜ける
                    run = false;
                    window.location.href = "/html/gameOver.html";
                    message = 'GAME OVER !!';
                    break;
                }
            }
        }

        // 自機と自機ショットとの衝突判定
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // エネミーショットの生存フラグをチェック
            if (charaShot2[i].alive) {
                // 自機とエネミーショットとの距離を計測
                p = chara.position.distance(charaShot2[i].position);
                if (p.length() < chara.size) {
                    // 衝突していたら生存フラグを降ろす
                    chara.alive = false;

                    // 衝突があったのでパラメータを変更してループを抜ける
                    run = false;
                    window.location.href = "/html/gameOver.html";
                    message = 'GAME OVER !!';
                    break;
                }
            }
        }

        // 自機と自機ショットとの衝突判定
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // エネミーショットの生存フラグをチェック
            if (charaShot[i].alive) {
                // 自機とエネミーショットとの距離を計測
                p = chara2.position.distance(charaShot[i].position);
                if (p.length() < chara2.size) {
                    // 衝突していたら生存フラグを降ろす
                    chara2.alive = false;

                    // 衝突があったのでパラメータを変更してループを抜ける
                    run = false;
                    message = 'GAME OVER !!';
                    window.location.href = "/html/gameClear.html";
                    break;
                }
            }
        }


        

        // すべての自機ショットを調査する
        for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
            // 自機ショットの生存フラグをチェック
            if (charaShot[i].alive) {

                // 自機ショットとボスビットとの衝突判定
                for (j = 0; j < BOSS_BIT_COUNT; j++) {
                    // ビットの生存フラグをチェック
                    if (bit[j].alive) {
                        // ビットと自機ショットとの距離を計測
                        p = bit[j].position.distance(charaShot[i].position);
                        if (p.length() < bit[j].size) {
                            // 衝突していたら耐久値をデクリメントする
                            bit[j].life--;

                            // 自機ショットの生存フラグを降ろす
                            charaShot[i].alive = false;

                            // 耐久値がマイナスになったら生存フラグを降ろす
                            if (bit[j].life < 0) {
                                bit[j].alive = false;
                                score += 3;
                            }

                            // 衝突があったのでループを抜ける
                            break;
                        }
                    }
                }

                // ボスの生存フラグをチェック
                if (boss.alive) {
                    // 自機ショットとボスとの衝突判定
                    p = boss.position.distance(charaShot[i].position);
                    if (p.length() < boss.size) {
                        // 衝突していたら耐久値をデクリメントする
                        boss.life--;

                        // 自機ショットの生存フラグを降ろす
                        charaShot[i].alive = false;

                        // 耐久値がマイナスになったらクリア
                        if (boss.life < 0) {
                            score += 10;
                            run = false;
                            window.location.href = "html/gameClear.html";
                            message = 'CLEAR !!';
                        }
                    }
                }

                // 自機ショットとエネミーとの衝突判定
                for(j = 0; j < ENEMY_MAX_COUNT; j++){
                    // エネミーの生存フラグをチェック
                    if(enemy[j].alive){
                        // エネミーと自機ショットとの距離を計測
                        p = enemy[j].position.distance(charaShot[i].position);
                        if(p.length() < enemy[j].size){
                            // 衝突していたら生存フラグを降ろす
                            enemy[j].alive = false;
                            charaShot[i].alive = false;

                            // スコアを更新するためにインクリメント
                            score++;

                            // 衝突があったのでループを抜ける
                            break;
                        }
                    }
                }
            }
        }
        // HTMLを更新
        info.innerHTML = 'SCORE: ' + (score * 100) + ' ' + message;
        
        // フラグにより再帰呼び出し
        if(run){setTimeout(arguments.callee, fps);}
    })();
};

// - event --------------------------------------------------------------------
function mouseMove(event) {
    // マウスカーソル座標の更新
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event) {
    // フラグを立てる
    fire = true;
}


function keyDown(event) {
    // キーコードを取得
    var ck = event.keyCode;

    // Escキーが押されていたらフラグを降ろす
    if (ck === 27) { run = false; }
    if (ck === 32) {
        fire2 = true;
    }

}



function keyUp(event) {
    //var ck = event.keyCode;
    ////WorS
    //if (ck === 87 && ck===83) {
    //    move1.y = 0;
    //}
    ////DorA
    //if (ck === 68 && ck===65) {
    //    move1.x = 0;
    //}

}