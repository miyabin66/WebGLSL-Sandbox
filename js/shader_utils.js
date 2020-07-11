// シェーダを生成する関数
function create_shader(gl, id) {

    // シェーダを格納する変数
    let shader;

    // HTMLからscriptタグへの参照を取得
    const scriptElement = document.getElementById(id);

    // scriptタグが存在しない場合は抜ける
    if (!scriptElement) {
        return;
    }

    // scriptタグのtype属性をチェック
    switch (scriptElement.type) {

        // 頂点シェーダの場合
        case 'x-shader/x-vertex':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;

        // フラグメントシェーダの場合
        case 'x-shader/x-fragment':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;

        default:
            return;

    }

    // 生成されたシェーダにソースを割り当てる
    gl.shaderSource(shader, scriptElement.text);

    // シェーダをコンパイルする
    gl.compileShader(shader);

    // シェーダが正しくコンパイルされたかチェック
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        // 成功していたらシェーダを返して終了
        return shader;

    } else {

        // 失敗していたらエラーログをアラートする
        alert(gl.getShaderInfoLog(shader));
    }
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(gl, vs, fs) {
    // プログラムオブジェクトの生成
    const program = gl.createProgram();

    // プログラムオブジェクトにシェーダを割り当てる
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // シェーダをリンク
    gl.linkProgram(program);

    // シェーダのリンクが正しく行なわれたかチェック
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {

        // 成功していたらプログラムオブジェクトを有効にする
        gl.useProgram(program);

        // プログラムオブジェクトを返して終了
        return program;

    } else {

        // 失敗していたらエラーログをアラートする
        alert(gl.getProgramInfoLog(program));
    }
}

// VBOを生成する関数
function create_vbo(gl, data) {

    // バッファオブジェクトの生成
    const vbo = gl.createBuffer();

    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // バッファにデータをセット
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // 生成した VBO を返して終了
    return vbo;

}

// IBOを生成する関数
function create_ibo(gl, data) {

    // バッファオブジェクトの生成
    const ibo = gl.createBuffer();

    // バッファをバインドする
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // バッファにデータをセット
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);

    // バッファのバインドを無効化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // 生成したIBOを返して終了
    return ibo;

}

// VBOをバインドし登録する関数
function set_attribute(gl, vbo, attL, attS) {
    // 引数として受け取った配列を処理する
    for (let i in vbo) {
        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);

        // attributeLocationを有効にする
        gl.enableVertexAttribArray(attL[i]);

        // attributeLocationを通知し登録する
        gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }

}
