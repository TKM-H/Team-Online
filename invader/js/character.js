function Character() {
    this.position = new Point();
    this.size = 0;
}

Character.prototype.init = function (size) {
    this.size = size;
};

Character.prototype.move = function (move) {
    this.position.x += move.x;
    this.position.y += move.y;
}

function CharacterShot() {
    this.position = new Point();
    this.size = 0;
    this.speed = 0;
    this.alive = false;
}

CharacterShot.prototype.set = function (p, size, speed) {
    // 座標をセット
    this.position.x = p.x;
    this.position.y = p.y;

    // サイズ、スピードをセット
    this.size = size;
    this.speed = speed;

    // 生存フラグを立てる
    this.alive = true;
};

CharacterShot.prototype.move = function () {
    // 座標を真上にspeed分だけ移動させる
    this.position.y -= this.speed * 3;

    // 一定以上の座標に到達していたら生存フラグを降ろす
    if (this.position.y < -this.size) {
        this.alive = false;
    }
	
	// 一定以上の座標に到達していたら生存フラグを降ろす
    if (this.position.y > 600) {
        this.alive = false;
    }
};

function Enemy() {
    this.position = new Point();
    this.size = 0;
    this.type = 0;
    this.param = 0;
    this.alive = false;
}

Enemy.prototype.set = function (p, size, type) {
    // 座標をセット
    this.position.x = p.x;
    this.position.y = p.y;

    // サイズ、タイプをセット
    this.size = size;
    this.type = type;

    // パラメータをリセット
    this.param = 0;

    // 生存フラグを立てる
    this.alive = true;
};

Enemy.prototype.move = function () {
    // パラメータをインクリメント
    this.param++;

    if (this.param >= 90) {
        // タイプに応じて分岐
        switch (this.type) {
            case 0:
                // X 方向へまっすぐ進む
                this.position.x += 12;

                // スクリーンの右端より奥に到達したら切り返す
                if (this.position.x > screenCanvas.width - this.size / 2) {
                    this.position.y += this.size;
                    this.type = 1;
                }
                this.param = 0;
                break;
            case 1:
                // マイナス X 方向へまっすぐ進む
                this.position.x -= 12;

                // スクリーンの左端より奥に到達したら切り返す
                if (this.position.x < this.size / 2) {
                    this.type = 0;
                    this.position.y += this.size;
                }
                this.param = 0;
                break;
        }
    }
    
};

function EnemyShot() {
    this.position = new Point();
    this.vector = new Point();
    this.size = 0;
    this.speed = 0;
    this.alive = false;
}

EnemyShot.prototype.set = function (p, vector, size, speed) {
    // 座標、ベクトルをセット
    this.position.x = p.x;
    this.position.y = p.y;
    this.vector.x = vector.x;
    this.vector.y = vector.y;

    // サイズ、スピードをセット
    this.size = size;
    this.speed = speed;

    // 生存フラグを立てる
    this.alive = true;
};

EnemyShot.prototype.move = function () {
    // 座標をベクトルに応じてspeed分だけ移動させる
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    // 一定以上の座標に到達していたら生存フラグを降ろす
    if (
       this.position.x < -this.size ||
       this.position.y < -this.size ||
       this.position.x > this.size + screenCanvas.width ||
       this.position.y > this.size + screenCanvas.height
    ) {
        this.alive = false;
    }
};