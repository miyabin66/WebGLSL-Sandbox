// onload
onload = () => {

    let mx, my;
    const startTime = new Date().getTime();

    // canvasエレメントを取得
    const c = document.getElementById('canvas');

    // webglコンテキストを取得
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // イベントリスナー登録
    c.addEventListener('mousemove', (e) => {
        mx = e.offsetX / c.width;
        my = - e.offsetY / c.height;
    }, true);

    // matIVオブジェクトを生成
    const m = new matIV();
    // 各種行列の生成と初期化
    const mMatrix = m.identity(m.create());
    const vMatrix = m.identity(m.create());
    const pMatrix = m.identity(m.create());
    const mvpMatrix = m.identity(m.create());

    // 深度テストを有効にする
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // ブレンディングを有効にする
    gl.enable(gl.BLEND);

    // 頂点シェーダとフラグメントシェーダの生成
    const main_vs = create_shader(gl, 'main_vs');
    const main_fs = create_shader(gl, 'main_fs');

    // プログラムオブジェクトの生成とリンク
    const main_prg = create_program(gl, main_vs, main_fs);

    // attributeLocationの取得
    const main_attL = [];
    main_attL[0] = gl.getAttribLocation(main_prg, 'position');

    // attributeの要素数
    const main_attS = [];
    main_attS[0] = 3;

    // uniformLocationの取得
    const main_uniL = [];
    main_uniL[0] = gl.getUniformLocation(main_prg, 'mvpMatrix');
    main_uniL[1] = gl.getUniformLocation(main_prg, 'time');
    main_uniL[2] = gl.getUniformLocation(main_prg, 'mouse');
    main_uniL[3] = gl.getUniformLocation(main_prg, 'resolution');

    const vertex_position = [
        -1.0,  1.0,  0.0,
        1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];

    const index = [
        0, 1, 2,
        1, 2, 3
    ];

    const position_vbo = create_vbo(gl, vertex_position);
    const index_ibo = create_ibo(gl, index);

    gl.bindBuffer(gl.ARRAY_BUFFER, position_vbo);
    gl.enableVertexAttribArray(main_attL[0]);
    gl.vertexAttribPointer(main_attL[0], main_attS[0], gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_ibo);

    (function(){

        // canvasを初期化する色を設定する
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // canvasを初期化する際の深度を設定する
        gl.clearDepth(1.0);

        // canvasを初期化
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 時間管理
        const time = (new Date().getTime() - startTime) * 0.001;

        // 各行列を掛け合わせ座標変換行列を完成させる
        m.multiply(pMatrix, vMatrix, mvpMatrix);
        m.multiply(mvpMatrix, mMatrix, mvpMatrix);

        // uniformLocationへ座標変換行列を登録
        gl.uniformMatrix4fv(main_uniL[0], false, mvpMatrix);

        // uniform 関連
        gl.uniform1f(main_uniL[1], time);
        gl.uniform2fv(main_uniL[2], [mx, my]);
        gl.uniform2fv(main_uniL[3], [c.width, c.height]);

        // モデルの描画
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // コンテキストの再描画
        gl.flush();
		requestAnimationFrame(arguments.callee);

    })();

};
