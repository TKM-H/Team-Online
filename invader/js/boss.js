// - boss ---------------------------------------------------------------------
function Boss() {
    this.position = new Point();
    this.size = 0;
    this.life = 0;
    this.param = 0;
    this.alive = false;
}

Boss.prototype.set = function (p, size, life) {
    // ���W���Z�b�g
    this.position.x = p.x;
    this.position.y = p.y;

    // �T�C�Y�A�ϋv�l���Z�b�g
    this.size = size;
    this.life = life;

    // �p�����[�^�����Z�b�g
    this.param = 0;

    // �����t���O�𗧂Ă�
    this.alive = true;
};

Boss.prototype.move = function () {
    var i, j;
    // �p�����[�^���C���N�������g
    this.param++;

    // �p�����[�^�ɉ����ĕ���
    switch (true) {
        case this.param < 100:
            // �������ւ܂������i��
            this.position.y += 1.5;
            break;
        default:
            // �p�����[�^���烉�W�A�������߂�
            i = ((this.param - 100) % 360) * Math.PI / 180;

            // ���W�A�����牡�ړ��ʂ��Z�o
            j = screenCanvas.width / 2;
            this.position.x = j + Math.sin(i) * j;
            break;
    }
};


// - boss bit -----------------------------------------------------------------
function Bit() {
    this.position = new Point();
    this.parent = null;
    this.size = 0;
    this.life = 0;
    this.param = 0;
    this.alive = false;
}

Bit.prototype.set = function (parent, size, life, param) {
    // ��̂ƂȂ�{�X���Z�b�g
    this.parent = parent;

    // �T�C�Y�A�ϋv�l���Z�b�g
    this.size = size;
    this.life = life;

    // �p�����[�^�ɏ����l���Z�b�g
    this.param = param;

    // �����t���O�𗧂Ă�
    this.alive = true;
};

Bit.prototype.move = function () {
    var i, x, y;

    // �p�����[�^���C���N�������g
    this.param++;

    // �p�����[�^���烉�W�A�������߂�
    i = (this.param % 360) * Math.PI / 180;

    // ���W�A�����牡�ړ��ʂ��Z�o
    x = Math.cos(i) * (this.parent.size + this.size);
    y = Math.sin(i) * (this.parent.size + this.size);
    this.position.x = this.parent.position.x + x;
    this.position.y = this.parent.position.y + y;
};