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
    // ���W���Z�b�g
    this.position.x = p.x;
    this.position.y = p.y;

    // �T�C�Y�A�X�s�[�h���Z�b�g
    this.size = size;
    this.speed = speed;

    // �����t���O�𗧂Ă�
    this.alive = true;
};

CharacterShot.prototype.move = function () {
    // ���W���^����speed�������ړ�������
    this.position.y -= this.speed * 3;

    // �����ȏ��̍��W�ɓ��B���Ă����琶���t���O���~�낷
    if (this.position.y < -this.size) {
        this.alive = false;
    }

	// �����ȏ��̍��W�ɓ��B���Ă����琶���t���O���~�낷
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
    // ���W���Z�b�g
    this.position.x = p.x;
    this.position.y = p.y;

    // �T�C�Y�A�^�C�v���Z�b�g
    this.size = size;
    this.type = type;

    // �p�����[�^�����Z�b�g
    this.param = 0;

    // �����t���O�𗧂Ă�
    this.alive = true;
};

Enemy.prototype.move = function () {
    // �p�����[�^���C���N�������g
    this.param++;

    if (this.param >= 90) {
        // �^�C�v�ɉ����ĕ���
        switch (this.type) {
            case 0:
                // X �����ւ܂������i��
                this.position.x += 12;

                // �X�N���[���̉E�[���艜�ɓ��B�������؂��Ԃ�
                if (this.position.x > screenCanvas.width - this.size / 2) {
                    this.position.y += this.size;
                    this.position.x -= 12;
                    this.type = 1;
                }
                this.param = 0;
                break;
            case 1:
                // �}�C�i�X X �����ւ܂������i��
                this.position.x -= 12;

                // �X�N���[���̍��[���艜�ɓ��B�������؂��Ԃ�
                if (this.position.x < this.size / 2) {
                    this.type = 0;
                    this.position.y += this.size;
                    this.position.x += 12;
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
    // ���W�A�x�N�g�����Z�b�g
    this.position.x = p.x;
    this.position.y = p.y;
    this.vector.x = vector.x;
    this.vector.y = vector.y;

    // �T�C�Y�A�X�s�[�h���Z�b�g
    this.size = size;
    this.speed = speed;

    // �����t���O�𗧂Ă�
    this.alive = true;
};

EnemyShot.prototype.move = function () {
    // ���W���x�N�g���ɉ�����speed�������ړ�������
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;

    // �����ȏ��̍��W�ɓ��B���Ă����琶���t���O���~�낷
    if (
       this.position.x < -this.size ||
       this.position.y < -this.size ||
       this.position.x > this.size + screenCanvas.width ||
       this.position.y > this.size + screenCanvas.height
    ) {
        this.alive = false;
    }
};
