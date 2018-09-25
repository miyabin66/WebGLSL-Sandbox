// onload
onload = function(){

    var mx, my, cw, ch;
    var time = 0.0;
    var startTime = new Date().getTime();

    // canvasエレメントを取得
    var c = document.getElementById('canvas');

    // webglコンテキストを取得
    var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

    // アプリ立ち上げ時画面サイズ調整
    display_resize(gl);
    update_framebuffer(gl);
    cw = c.width;
    ch = c.height;

    // ウィンドウサイズ変更後画面サイズ調整
    window.onresize = function(){
        display_resize(gl);
        update_framebuffer(gl);
        cw = c.width;
        ch = c.height;
    };

    // イベントリスナー登録
    c.addEventListener('mousemove', function(e){
        mx = e.offsetX / cw;
        my = e.offsetY / ch;
    }, true);

    // matIVオブジェクトを生成
    var m = new matIV();
    // 各種行列の生成と初期化
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var tmpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());
    var invMatrix = m.identity(m.create());

    // 深度テストを有効にする
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // ブレンディングを有効にする
    gl.enable(gl.BLEND);

    // 頂点シェーダとフラグメントシェーダの生成
    var main_vs = create_shader(gl, 'main_vs');
    var main_fs = create_shader(gl, 'main_fs');

    // プログラムオブジェクトの生成とリンク
    var main_prg = create_program(gl, main_vs, main_fs);

    // attributeLocationの取得
    var main_attL = new Array();
    main_attL[0] = gl.getAttribLocation(main_prg, 'position');

    // attributeの要素数
    var main_attS = new Array();
    main_attS[0] = 3;

    // uniformLocationの取得
    var main_uniL = new Array();
    main_uniL[0] = gl.getUniformLocation(main_prg, 'mvpMatrix');
    main_uniL[1] = gl.getUniformLocation(main_prg, 'time');
    main_uniL[2] = gl.getUniformLocation(main_prg, 'mouse');
    main_uniL[3] = gl.getUniformLocation(main_prg, 'resolution');

    var vertex_position = [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];

    var index = [
        0, 2, 1,
        1, 2, 3
    ];

    var position_vbo = create_vbo(gl, vertex_position);
    var index_ibo = create_ibo(gl, index);

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
        time = (new Date().getTime() - startTime) * 0.001;

        // ビュー座標変換行列
        //m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

        // プロジェクション座標変換行列
        //m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

        // 各行列を掛け合わせ座標変換行列を完成させる
        m.multiply(pMatrix, vMatrix, mvpMatrix);
        m.multiply(mvpMatrix, mMatrix, mvpMatrix);

        // uniformLocationへ座標変換行列を登録
        gl.uniformMatrix4fv(main_uniL[0], false, mvpMatrix);

        // uniform 関連
        gl.uniform1f(main_uniL[1], time);
        gl.uniform2fv(main_uniL[2], [mx, my]);
        gl.uniform2fv(main_uniL[3], [cw, ch]);

        // モデルの描画
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // コンテキストの再描画
        gl.flush();
		requestAnimationFrame(arguments.callee);

    })();

};








