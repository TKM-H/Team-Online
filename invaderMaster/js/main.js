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

var playerImg1 = new Image();
var enemyImg1 = new Image();

var playerImg2 = new Image();
playerImg2.src = "/Images/player2.png";

var bg = new Image();
bg.src = "/Images/titleback.png";

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

    socket.emit('connectNo', {num:2});//サーバに保存

    // �X�N���[���̏�����
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 300;
    screenCanvas.height = 530;

    // 2d�R���e�L�X�g
    ctx = screenCanvas.getContext('2d');

    // �C�x���g�̓o�^
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('keyup', keyUp, true);


    // ���̑��̃G�������g�֘A
    info = document.getElementById('info');

    // ���@������
    var chara = new Character();
    chara.init(10);
    chara.position.x = 100;
    chara.position.y = 500;
    playerImg1.src = "/Images/player.png";
    enemyImg1.src = "/Images/enemy1.png";

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

    // �G�l�~�[�V���b�g������
    var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
    for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        enemyShot[i] = new EnemyShot();
    }

    // �{�X������
    var boss = new Boss();

    // �{�X�̃r�b�g��������
    var bit = new Array(BOSS_BIT_COUNT);
    for (i = 0; i < BOSS_BIT_COUNT; i++) {
        bit[i] = new Bit();
    }


    // ------------------------------------------------------------
    // �L�[�{�[�h���������Ƃ��Ɏ��s�������C�x���g
    // ------------------------------------------------------------
    document.onkeydown = function (e) {
        if (!e) e = window.event; // ���K�V�[

        input_key_buffer[e.keyCode] = true;
    };

    // ------------------------------------------------------------
    // �L�[�{�[�h�𗣂����Ƃ��Ɏ��s�������C�x���g
    // ------------------------------------------------------------
    document.onkeyup = function (e) {
        if (!e) e = window.event; // ���K�V�[

        input_key_buffer[e.keyCode] = false;
    };

    // ------------------------------------------------------------
    // �E�B���h�E�����A�N�e�B�u�ɂȂ��u�ԂɎ��s�������C�x���g
    // ------------------------------------------------------------
    window.onblur = function () {
        // �z�����N���A����
        input_key_buffer.length = 0;
    };

    function KeyIsDown(key_code) {

        if (input_key_buffer[key_code]) return true;

        return false;
    }


    // �����_�����O�������Ăяo��
    (function () {
      socket.emit('connectNo', {num:2});//サーバに保存
        ////////////�ړ�����(UP)/////////////////
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
        ////////////�ړ�����(Down)/////////////////
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


        if (KeyIsDown(32)) {
          fire = true;
        }
        ///////////////////////////////

        counter++;
        // �J�E���^�[�̒l�ɂ����ăV�[������
        switch (true) {
            // �J�E���^�[��70���菬����
            case counter < 70:
                message = 'READY...';
                break;

                // �J�E���^�[��100���菬����
            case counter < 100:
                message = 'GO!!';
                break;

                // �J�E���^�[��100�ȏ�
            default:
                message = '';
        }

        // fire�t���O�̒l�ɂ��蕪��
    if (fire)
		{
            // ���ׂĂ̎��@�V���b�g�𒲍�����
            for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++)
			{
                // ���@�V���b�g�����ɔ��˂����Ă��邩�`�F�b�N
                if (!charaShot[i].alive)
				{
                    // ���@�V���b�g���V�K�ɃZ�b�g
                    charaShot[i].set(chara.position, 3, 5);

                    // ���[�v�𔲂���
                    break;
                }
            }
			//////////////////////////����//////////////////////////
            var flag = 1;
            if(name == "1")//1P�Ȃ�2P�p�̊֐��ɑ���
            {
              socket.emit('shotChar2', {uname:name, shot:flag});
            }
            if(name == "2")//2P�Ȃ�1P�p�̊֐��ɑ���
            {
              socket.emit('shotChar1', {uname: name, shot:flag});
            }
            ////////////////////////////////////////////////////end
            // �t���O���~�낵�Ă���
            fire = false;
        }

        // fire2�t���O�̒l�ɂ��蕪��
        if (fire2) {
            // ���ׂĂ̎��@�V���b�g�𒲍�����
            for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
                // ���@�V���b�g�����ɔ��˂����Ă��邩�`�F�b�N
                if (!charaShot2[i].alive) {
                    // ���@�V���b�g���V�K�ɃZ�b�g
                    charaShot2[i].set(chara2.position, 3, 5);

                    // ���[�v�𔲂���
                    break;
                }
            }
            // �t���O���~�낵�Ă���
            fire2 = false;
        }

        // screen�N���A
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        ////////////////////////
        // �p�X�̐ݒ����J�n
        ctx.beginPath();

        ctx.drawImage(bg, 0, 0);


		////////////1p, 2p �̍��W�f�[�^���T�[�o�[�ɑ��M////�쐬�ҁ@����/////////
        var x = chara.position.x;
        var y = chara.position.y;
        if(name == "1")//1P�Ȃ�2P�p�̊֐��ɑ���
        {
          socket.emit('moveChar2', {uname:name, disx:x, disy:y});
        }
        if(name == "2")//2P�Ȃ�1P�p�̊֐��ɑ���
        {
          socket.emit('moveChar1',{uname: name, disx:x, disy:y});
        }
        //////////////////////////////////////////////////////////////end


        // ���@�̈ʒu���ݒ�
        chara.position.x = chara.position.x;
        chara.position.y = chara.position.y;

        // ���@���`���p�X���ݒ�
        //ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);
        ctx.drawImage(playerImg1,0,0,47,30,chara.position.x-23,chara.position.y,47,30);

        chara.move(move2);

        // ���@�̐F���ݒ肷��
        ctx.fillStyle = CHARA_COLOR;

        // ���@���`��
        ctx.fill();
        ///////////////////
        ctx.beginPath();

        chara2.position.x = chara2.position.x;
        chara2.position.y = chara2.position.y;

        ctx.arc(chara2.position.x, chara2.position.y, chara2.size, 0, Math.PI * 2, false);

        //chara2.move(move1);
		////////�T�[�o���瑊���̍��W���擾�����f///////�쐬�ҁ@����//////////////////
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

        socket.on('gameEnd', function(data)
        {
           if(data)
           {
             if(data.uname != name)
             {
               console.log("ok");
               console.log(data.flag);

               if(data.flag == 'lose')
               {
                 window.location.href = "/html/gameClear.html";
               }
               else if(data.flag == 'win')
               {
                 window.location.href = "/html/gameOver.html";
               }
             }
           }
        });

        ////////////////////////////////////////////////////////end

        ctx.fillStyle = CHARA_COLOR;

        ctx.fill();

        /////////////////////////////////
        // �p�X�̐ݒ����J�n
        ctx.beginPath();

        // ���ׂĂ̎��@�V���b�g�𒲍�����
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // ���@�V���b�g�����ɔ��˂����Ă��邩�`�F�b�N
            if (charaShot[i].alive) {
                // ���@�V���b�g�𓮂���
                charaShot[i].move();

                // ���@�V���b�g���`���p�X���ݒ�
                ctx.arc(
                    charaShot[i].position.x,
                    charaShot[i].position.y,
                    charaShot[i].size,
                    0, Math.PI * 2, false
                );

                // �p�X��������������
                ctx.closePath();
            }
        }

        // ���@�V���b�g�̐F���ݒ肷��
        ctx.fillStyle = CHARA_SHOT_COLOR;

        // ���@�V���b�g���`��
        ctx.fill();
        ////////////

        ///////////////////
        // �p�X�̐ݒ����J�n
        ctx.beginPath();

        // ���ׂĂ̎��@�V���b�g�𒲍�����
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // ���@�V���b�g�����ɔ��˂����Ă��邩�`�F�b�N
            if (charaShot2[i].alive) {
                // ���@�V���b�g�𓮂���
                charaShot2[i].move();

                // ���@�V���b�g���`���p�X���ݒ�
                ctx.arc(
                    charaShot2[i].position.x,
                    charaShot2[i].position.y,
                    charaShot2[i].size,
                    0, Math.PI * 2, false
                );

                // �p�X��������������
                ctx.closePath();
            }
        }

        // ���@�V���b�g�̐F���ݒ肷��
        ctx.fillStyle = CHARA_SHOT_COLOR;

        // ���@�V���b�g���`��
        ctx.fill();
        ////////////

        // �G�l�~�[�̏o���Ǘ� -------------------------------------------------
        // 1000 �t���[���ڂ܂ł� 100 �t���[���Ɉ��x�o��������
        if (counter % 100 === 0 && counter < 1000) {
            // ���ׂẴG�l�~�[�𒲍�����
            for (i = 0; i < ENEMY_MAX_COUNT; i++) {
                // �G�l�~�[�̐����t���O���`�F�b�N
                if (!enemy[i].alive) {
                    // �^�C�v�����肷���p�����[�^���Z�o
                    j = (counter % 200) / 100;

                    // �^�C�v�ɉ����ď����ʒu�����߂�
                    var enemySize = 15;
                    enemy[i].position.x = -enemySize + (screenCanvas.width + enemySize * 2) * j
                    enemy[i].position.y = screenCanvas.height / 2;

                    // �G�l�~�[���V�K�ɃZ�b�g
                    enemy[i].set(enemy[i].position, enemySize, j);

                    // 1�̏o���������̂Ń��[�v�𔲂���
                    break;
                }
            }
        } /*else if (counter === 1000) {
            // 1000 �t���[���ڂɃ{�X���o��������
            boss.position.x = screenCanvas.width / 2;
            boss.position.y = -80;
            boss.set(boss.position, 50, 30);
            alert("boss");
            // �����Ƀr�b�g���o��������
            for (i = 0; i < BOSS_BIT_COUNT; i++) {
                j = 360 / BOSS_BIT_COUNT;
                bit[i].set(boss, 15, 5, i * j);
            }
        }*/


        // ���ׂẴG�l�~�[�𒲍�����
        for (i = 0; i < ENEMY_MAX_COUNT; i++) {
            // �G�l�~�[�̐����t���O���`�F�b�N
            if (enemy[i].alive) {
                // �G�l�~�[�𓮂���
                enemy[i].move();

                // �G�l�~�[���`���p�X���ݒ�
                ctx.arc(
                    enemy[i].position.x,
                    enemy[i].position.y,
                    enemy[i].size,
                    0, Math.PI * 2, false
                );
                ctx.drawImage(enemyImg1,0,0,32,26,enemy[i].position.x-16,enemy[i].position.y,32,26);

                // �V���b�g���ł��ǂ����p�����[�^�̒l�����`�F�b�N
                if (enemy[i].param % 30 === 0) {
                    // �G�l�~�[�V���b�g�𒲍�����
                    for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                        if (!enemyShot[j].alive) {
                            // �G�l�~�[�V���b�g���V�K�ɃZ�b�g����
                            p = new Point();
                            p.x = 0;
                            p.y = 2;
                            if(Math.floor(Math.random() * 2) === 0){
                              var v = -1;
                            }
                            else{
                              var v = 1;
                            }
                            p.y *= v;
                            enemyShot[j].set(enemy[i].position, p, 5, 5);

                            // 1�o���������̂Ń��[�v�𔲂���
                            break;
                        }
                    }
                }

                // �p�X��������������
                ctx.closePath();
            }
        }

        // �G�l�~�[�̐F���ݒ肷��
        //ctx.fillStyle = ENEMY_COLOR;

        // �G�l�~�[���`��
        //ctx.fill();

        ////////////////
        // �{�X -------------------------------------------------------
        // �p�X�̐ݒ����J�n
        ctx.beginPath();

        // �{�X�̏o���t���O���`�F�b�N
        if (boss.alive) {
            // �{�X�𓮂���
            boss.move();

            // �{�X���`���p�X���ݒ�
            ctx.arc(
                boss.position.x,
                boss.position.y,
                boss.size,
                0, Math.PI * 2, false
            );

            // �p�X��������������
            ctx.closePath();
        }

        // �{�X�̐F���ݒ肷��
        ctx.fillStyle = BOSS_COLOR;

        // �{�X���`��
        ctx.fill();

        // �r�b�g -------------------------------------------
        // �p�X�̐ݒ����J�n
        ctx.beginPath();

        // ���ׂẴr�b�g�𒲍�����
        for (i = 0; i < BOSS_BIT_COUNT; i++) {
            // �r�b�g�̏o���t���O���`�F�b�N
            if (bit[i].alive) {
                // �r�b�g�𓮂���
                bit[i].move();

                // �r�b�g���`���p�X���ݒ�
                ctx.arc(
                    bit[i].position.x,
                    bit[i].position.y,
                    bit[i].size,
                    0, Math.PI * 2, false
                );

                // �V���b�g���ł��ǂ����p�����[�^�̒l�����`�F�b�N
                if (bit[i].param % 25 === 0) {
                    // �G�l�~�[�V���b�g�𒲍�����
                    for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                        if (!enemyShot[j].alive) {
                            // �G�l�~�[�V���b�g���V�K�ɃZ�b�g����
                            p = bit[i].position.distance(chara.position);
                            p.normalize();
                            enemyShot[j].set(bit[i].position, p, 4, 1.5);

                            // 1�o���������̂Ń��[�v�𔲂���
                            break;
                        }
                    }
                }

                // �p�X��������������
                ctx.closePath();
            }
        }

        // �r�b�g�̐F���ݒ肷��
        ctx.fillStyle = BOSS_BIT_COLOR;

        // �r�b�g���`��
        ctx.fill();

        ///////////////
        ctx.beginPath();

        // ���ׂĂ̓G�V���b�g�𒲍�����
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            // �G�V���b�g�����ɔ��˂����Ă��邩�`�F�b�N
            if (enemyShot[i].alive) {
                // �G�V���b�g�𓮂���
                enemyShot[i].move();

                // �G�V���b�g���`���p�X���ݒ�
                ctx.arc(
                    enemyShot[i].position.x,
                    enemyShot[i].position.y,
                    enemyShot[i].size,
                    0, Math.PI * 2, false
                );


                // �p�X��������������
                ctx.closePath();
            }
        }

        // �G�V���b�g�̐F���ݒ肷��
        ctx.fillStyle = ENEMY_SHOT_COLOR;

        // �G�V���b�g���`��
        ctx.fill();

        /////////////////////////
        // �Փ˔��� ---------------------------------------------------

        // ���@�ƃG�l�~�[�V���b�g�Ƃ̏Փ˔���
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            // �G�l�~�[�V���b�g�̐����t���O���`�F�b�N
            if (enemyShot[i].alive) {
                // ���@�ƃG�l�~�[�V���b�g�Ƃ̋������v��
                p = chara.position.distance(enemyShot[i].position);
                if (p.length() < chara.size) {
                    // �Փ˂��Ă����琶���t���O���~�낷
                    chara.alive = false;

                    // �Փ˂��������̂Ńp�����[�^���ύX���ă��[�v�𔲂���
                    run = false;
                    socket.emit('gameEnd', {uname:name, flag:'lose'});//サーバに保存
                    window.location.href = "/html/gameOver.html";
                    message = 'GAME OVER !!';
                    break;
                }
            }
        }

        // ���@�ƃG�l�~�[�V���b�g�Ƃ̏Փ˔���
        for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
            // �G�l�~�[�V���b�g�̐����t���O���`�F�b�N
            if (enemyShot[i].alive) {
                // ���@�ƃG�l�~�[�V���b�g�Ƃ̋������v��
                p = chara2.position.distance(enemyShot[i].position);
                if (p.length() < chara2.size) {
                    // �Փ˂��Ă����琶���t���O���~�낷
                    chara2.alive = false;

                    // �Փ˂��������̂Ńp�����[�^���ύX���ă��[�v�𔲂���
                    run = false;
                    socket.emit('gameEnd', {uname:name, flag:'win'});//サーバに保存
                    window.location.href = "/html/gameClear.html";
                    message = 'GAME OVER !!';
                    break;
                }
            }
        }

        // ���@�Ǝ��@�V���b�g�Ƃ̏Փ˔���
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // �G�l�~�[�V���b�g�̐����t���O���`�F�b�N
            if (charaShot2[i].alive) {
                // ���@�ƃG�l�~�[�V���b�g�Ƃ̋������v��
                p = chara.position.distance(charaShot2[i].position);
                if (p.length() < chara.size) {
                    // �Փ˂��Ă����琶���t���O���~�낷
                    chara.alive = false;

                    // �Փ˂��������̂Ńp�����[�^���ύX���ă��[�v�𔲂���
                    run = false;
                    socket.emit('gameEnd', {uname:name, flag:'lose'});//サーバに保存
                    window.location.href = "/html/gameOver.html";
                    message = 'GAME OVER !!';
                    break;
                }
            }
        }

        // ���@�Ǝ��@�V���b�g�Ƃ̏Փ˔���
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
            // �G�l�~�[�V���b�g�̐����t���O���`�F�b�N
            if (charaShot[i].alive) {
                // ���@�ƃG�l�~�[�V���b�g�Ƃ̋������v��
                p = chara2.position.distance(charaShot[i].position);
                if (p.length() < chara2.size) {
                    // �Փ˂��Ă����琶���t���O���~�낷
                    chara2.alive = false;

                    // �Փ˂��������̂Ńp�����[�^���ύX���ă��[�v�𔲂���
                    run = false;
                    socket.emit('gameEnd', {uname:name, flag:'win'});//サーバに保存
                    window.location.href = "/html/gameClear.html";
                    break;
                }
            }
        }




        // ���ׂĂ̎��@�V���b�g�𒲍�����
        for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
            // ���@�V���b�g�̐����t���O���`�F�b�N
            if (charaShot[i].alive) {

                // ���@�V���b�g�ƃ{�X�r�b�g�Ƃ̏Փ˔���
                for (j = 0; j < BOSS_BIT_COUNT; j++) {
                    // �r�b�g�̐����t���O���`�F�b�N
                    if (bit[j].alive) {
                        // �r�b�g�Ǝ��@�V���b�g�Ƃ̋������v��
                        p = bit[j].position.distance(charaShot[i].position);
                        if (p.length() < bit[j].size) {
                            // �Փ˂��Ă������ϋv�l���f�N�������g����
                            bit[j].life--;

                            // ���@�V���b�g�̐����t���O���~�낷
                            charaShot[i].alive = false;

                            // �ϋv�l���}�C�i�X�ɂȂ����琶���t���O���~�낷
                            if (bit[j].life < 0) {
                                bit[j].alive = false;
                                score += 3;
                            }

                            // �Փ˂��������̂Ń��[�v�𔲂���
                            break;
                        }
                    }
                }

                // �{�X�̐����t���O���`�F�b�N
                if (boss.alive) {
                    // ���@�V���b�g�ƃ{�X�Ƃ̏Փ˔���
                    p = boss.position.distance(charaShot[i].position);
                    if (p.length() < boss.size) {
                        // �Փ˂��Ă������ϋv�l���f�N�������g����
                        boss.life--;

                        // ���@�V���b�g�̐����t���O���~�낷
                        charaShot[i].alive = false;

                        // �ϋv�l���}�C�i�X�ɂȂ������N���A
                        if (boss.life < 0) {
                            score += 10;
                            run = false;
                            window.location.href = "/html/gameClear.html";
                            message = 'CLEAR !!';
                        }
                    }
                }

                // ���@�V���b�g�ƃG�l�~�[�Ƃ̏Փ˔���
                for(j = 0; j < ENEMY_MAX_COUNT; j++){
                    // �G�l�~�[�̐����t���O���`�F�b�N
                    if(enemy[j].alive){
                        // �G�l�~�[�Ǝ��@�V���b�g�Ƃ̋������v��
                        p = enemy[j].position.distance(charaShot[i].position);
                        if(p.length() < enemy[j].size){
                            // �Փ˂��Ă����琶���t���O���~�낷
                            enemy[j].alive = false;
                            charaShot[i].alive = false;

                            // �X�R�A���X�V���邽�߂ɃC���N�������g
                            score++;

                            // �Փ˂��������̂Ń��[�v�𔲂���
                            break;
                        }
                    }
                }
            }
        }
        // HTML���X�V
        info.innerHTML = 'SCORE: ' + (score * 100) + ' ' + message;

        // �t���O�ɂ����ċA�Ăяo��
        if(run){setTimeout(arguments.callee, fps);}
    })();
};

// - event --------------------------------------------------------------------
function mouseMove(event) {
    // �}�E�X�J�[�\�����W�̍X�V
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event) {
    // �t���O�𗧂Ă�
    //fire = true;
}


function keyDown(event) {
    // �L�[�R�[�h���擾
    var ck = event.keyCode;

    // Esc�L�[���������Ă������t���O���~�낷
    if (ck === 27) { run = false; }
    if (ck === 32) {
        //fire2 = true;
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
