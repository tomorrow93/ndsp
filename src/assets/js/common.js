//进制转换
export function convert(num,from,to){
    var pattern=/^(2|8|10|16){1}$/;
    if(!pattern.test(from)||!pattern.test(to)){
        console.error('源进制from和目标进制to必须都为[2,8,10,16]其中的数字');
        return;
    }
    //如果源进制为十进制
    if(from==10){
        var toString = parseInt(num).toString(to);
        if(to==2&&toString.length<24) {
            var appendString = '';
            for(var i=0;i<24-toString.length;i++) {
                appendString+='0';
            }
            toString = appendString+toString
        }
        return toString;
    }
    //如果目标进制是十进制
    if(to==10){
        return parseInt(num,from);
    }
    //其他进制的转换
    return parseInt(num,from).toString(to);
}

//obj转数组
export function objOfPropertyToArr(object) {
    var arr = [];
    var i = 0;
    for (var item in object) {
        arr[i] = item;
        i++;
    }
    return arr;
}

//图片预览
export function setImagePreviews(avalue) {
    var docObj = document.getElementById("doc");
    var dd = document.getElementById("dd");
    dd.innerHTML = "";
    var fileList = docObj.files;
    for (var i = 0; i < fileList.length; i++) {
        dd.innerHTML += "<div style='float:left' > <img id='img" + i + "'  /> </div>";
        var imgObjPreview = document.getElementById("img"+i);
        if (docObj.files && docObj.files[i]) {
            //火狐下，直接设img属性
            imgObjPreview.style.display = 'block';
            imgObjPreview.style.width = '200px';
            imgObjPreview.style.height = '200px';
            //imgObjPreview.src = docObj.files[0].getAsDataURL();
            //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
            imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
        }
        else {
            //IE下，使用滤镜
            docObj.select();
            var imgSrc = document.selection.createRange().text;
            alert(imgSrc)
            var localImagId = document.getElementById("img" + i);
            //必须设置初始大小
            localImagId.style.width = "200px";
            localImagId.style.height = "200px";
            //图片异常的捕捉，防止用户修改后缀来伪造图片
            try {
                localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
            }
            catch (e) {
                alert("您上传的图片格式不正确，请重新选择!");
                return false;
            }
            imgObjPreview.style.display = 'none';
            document.selection.empty();
        }
    }
    return true;
}

export function setImagePreviews2(ele,imgBox) {
  var docObj = ele;
  var dd =imgBox;
  dd.innerHTML = "";
  var fileList = docObj.files;
  for (var i = 0; i < fileList.length; i++) {
    dd.innerHTML += "<div style='float:left;width:100%;height:100%' > <img class='_img" + i + "'  /> </div>";
    var imgObjPreview = dd.getElementsByClassName("_img"+i)[0];
    if (docObj.files && docObj.files[i]) {
      //火狐下，直接设img属性
      imgObjPreview.style.display = 'block';
      imgObjPreview.style.width = '100%';
      imgObjPreview.style.height = '100%';
      //imgObjPreview.src = docObj.files[0].getAsDataURL();
      //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
      imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
    }
    else {
      //IE下，使用滤镜
      docObj.select();
      var imgSrc = document.selection.createRange().text;
      alert(imgSrc)
      var localImagId = dd.getElementsByClassName("_img"+i)[0];
      //必须设置初始大小
      localImagId.style.width = '100%';
      localImagId.style.height = '100%';
      //图片异常的捕捉，防止用户修改后缀来伪造图片
      try {
        localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
        localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
      }
      catch (e) {
        alert("您上传的图片格式不正确，请重新选择!");
        return false;
      }
      imgObjPreview.style.display = 'none';
      document.selection.empty();
    }
  }
  return true;
}

//只能输入数字、中文、英文
export function NumChinaEng(value){
    value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')
    return value;
}
