// シェーダを生成する関数
function create_shader(gl, id) {
    
    // シェーダを格納する変数
    var shader;
    
    // HTMLからscriptタグへの参照を取得
    var scriptElement = document.getElementById(id);
    
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
    var program = gl.createProgram();
    
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
    var vbo = gl.createBuffer();
    
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
    var ibo = gl.createBuffer();
    
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
    for (var i in vbo) {
        // バッファをバインドする
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
        
        // attributeLocationを有効にする
        gl.enableVertexAttribArray(attL[i]);
        
        // attributeLocationを通知し登録する
        gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }
    
}

function display_resize(gl){
    var dpr = 1.0;
    var c = document.getElementById('canvas');
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    gl.viewport(0.0, 0.0, c.width, c.height);
}

function update_framebuffer(gl){
    var c = document.getElementById('canvas');
    if(c.width <= 512 || c.height <= 512){
        bufferWidth = 512;
        bufferHeight = 512;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }else if((c.width > 512 || c.height > 512) && (c.width <= 1024 || c.height <= 1024)){
        bufferWidth = 1024;
        bufferHeight = 1024;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }else if((c.width > 1024 || c.height > 1024) && (c.width <= 2048 || c.height <= 2048)){
        bufferWidth = 2048;
        bufferHeight = 2048;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }else if((c.width > 2048 || c.height > 2048) && (c.width <= 4096 || c.height <= 4096)){
        bufferWidth = 4096;
        bufferHeight = 4096;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }else if((c.width > 4096 || c.height > 4096) && (c.width <= 8192 || c.height <= 8192)){
        bufferWidth = 8192;
        bufferHeight = 8192;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }else if((c.width > 8192 || c.height > 8192) && (c.width <= 16384 || c.height <= 16384)){
        bufferWidth = 16384;
        bufferHeight = 16384;
        fBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        bBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        rBuffer = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer1 = create_framebuffer(gl, bufferWidth, bufferHeight);
        gBuffer2 = create_framebuffer(gl, bufferWidth, bufferHeight);
    }
}

function create_framebuffer(gl, width, height){
    var frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    var depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    var fTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
}