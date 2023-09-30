let OS = {windows:"windows", mac:"mac",other:"other", userText: "text"}
var myOs = OS.windows; // default

var prefixKeyMap = new Map();
var prefixKeyNameMap = new Map();

var isTextInputMode = false;

var generatedFilename = "";

$('document').ready(function () {
    if(platform.os.family.indexOf("Win") != -1) {
        setCustomOS(OS.windows);
    } else if(platform.os.family.indexOf("Mac") != -1) {
        setCustomOS(OS.mac);
    } else {
        setCustomOS(OS.other);
    }

    $('.close-btn').click(function(){
        console.log('close btn click');
        $('#modal-revision-history').removeClass('active');
    });
    $('#revision-history').click(function () {
        $('#modal-revision-history').addClass('active');
    });

    tippy('#resize-checkbox-label', {
        placement: 'bottom',
        content: 'Resize from a larger image to improve quality',
      });

      // alert($("#resize-checkbox").prop('checked'));

    // on OS selection radio button click
    $("input:radio").click((e)=>{
        setCustomOS(e.currentTarget.name);
    });

    $('#user-text-input').hide();

    function setCustomOS(newOs) {
        myOs = newOs;
        $(":radio").prop("checked", false); // clear previous os selections
        $("input[name="+myOs+"]:radio").prop("checked", true);

        if (myOs == OS.userText) {
            $('#kb-input').hide();
            $('#user-text-input').show();
            isTextInputMode = true;
        } else {
            $('#kb-input').show();
            $('#user-text-input').hide();
            isTextInputMode = false;
        }

        updateToggleButtons(myOs);
    }

    function updateToggleButtons(newOs) {
        let $metaKey = $('#meta-toggle');
        let $controlKey = $('#ctrl-toggle');
        let $altKey = $('#alt-toggle');

        $metaKey.removeClass('cmd');
        $metaKey.removeClass('win');
        $metaKey.removeClass('meta');

        $controlKey.removeClass('ctrl');
        $controlKey.removeClass('control');

        $altKey.removeClass('alt');
        $altKey.removeClass('macOption');

        if (myOs == OS.mac) {
            $metaKey.addClass('cmd');
            $controlKey.addClass('control')
            $altKey.addClass('macOption')
        } else if (myOs == OS.windows) {
            $metaKey.addClass('win');
            $controlKey.addClass('ctrl')
            $altKey.addClass('alt')
        } else {
            $metaKey.addClass('meta');
            $controlKey.addClass('ctrl')
            $altKey.addClass('alt')
        }
    }

    const keyMap = {
        k32: 'SPACE',
        k65: 'A',
        k66: 'B',
        k67: 'C',
        k68: 'D',
        k69: 'E',
        k70: 'F',
        k71: 'G',
        k72: 'H',
        k73: 'I',
        k74: 'J',
        k75: 'K',
        k76: 'L',
        k77: 'M',
        k78: 'N',
        k79: 'O',
        k80: 'P',
        k81: 'Q',
        k82: 'R',
        k83: 'S',
        k84: 'T',
        k85: 'U',
        k86: 'V',
        k87: 'W',
        k88: 'X',
        k89: 'Y',
        k90: 'Z',
    };

    $('#img-preview-div').hide();

    var imgSizeSelector = document.getElementById("img-out-size-selector");
    imgSizeSelector.addEventListener("change", (e)=> {
        // alert(e.target.selectedIndex);
    });

    $('#generate-img-btn').click(function () {
      var e = document.getElementById("output-location");
      var e_width = e.offsetWidth;
      var e_height = e.offsetHeight;
      var e_x_offset = window.scrollX + e.getBoundingClientRect().left;
      var e_y_offset = window.scrollY + e.getBoundingClientRect().top;

      var isResizeFromLargeImage = $("#resize-checkbox").prop('checked');
      console.log("isResizeFromLargeImage="+isResizeFromLargeImage);
      var genDpi = isResizeFromLargeImage? 256: 96;
      html2canvas(e, {
        dpi: genDpi,
        scale: 1,
        backgroundColor: null,
        width: e_width,
        height: e_height,
        x: e_x_offset,
        y: e_y_offset
     }).then(canvas => {
            //document.body.appendChild(canvas)
            $('#img-preview-div').show();
            var base64image = canvas.toDataURL("image/png");

            if (isResizeFromLargeImage) {
                let img = new Image();
                img.src = base64image;
                img.onload = () => {
                    // 0.5x, 1x, 0.75x, 0.35x, 0.25x, 0.15x
                    let genImgWidth = img.width;
                    let img_sizes_in_width = [genImgWidth/2, genImgWidth, genImgWidth*0.75, genImgWidth*0.35, genImgWidth*0.25, genImgWidth*0.15];
                    var imgSizeSelector = document.getElementById("img-out-size-selector");
                    var resizeWidth = img_sizes_in_width[imgSizeSelector.selectedIndex];

                    console.log("resize width="+resizeWidth);

                    resizeImage(base64image, resizeWidth);
                }
                
            } else {
                let $imgDiv = $('<img src="' + base64image + '"/>');
                $('#img-out-preview').empty();
                $('#img-out-preview').append($imgDiv);

                $imgDiv[0].onload = ()=>{
                    $("#gen-img-size-label").text("image dimensions = "+$imgDiv[0].width+'px, '+$imgDiv[0].height+'px');
                }
            }

            // resizeImage(base64image, 298);
            // var win = window.open('', "_blank");
            // win.document.write('<img src="' + base64image + '"/>');
            // win.document.close();
        });
    });

    function resizeImage(base64image, width = 256) {
        img = new Image();
        img.src = base64image;

        img.onload = () => {

            console.log('img w,h'+img.width+','+img.height);
            var height = width * (img.height / img.width);
            console.log(height+"h");
    
            // Dynamically create a canvas element
            var canvas = document.createElement("canvas");

            // var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            // Actual resizing
            ctx.drawImage(img, 0, 0, width, height);

            var base64image = canvas.toDataURL("image/png");
            let $imgDiv = $('<img src="' + base64image + '"/>');
            $('#img-out-preview').empty();
            $('#img-out-preview').append($imgDiv);

            $imgDiv[0].onload = ()=>{
                $("#gen-img-size-label").text("image dimensions = "+$imgDiv[0].width+'px, '+$imgDiv[0].height+'px');
            }
    
            // Now use target canvas, to hold the final image, and output image from it
        } // End of the img.onLoad
    }

    $('#download-btn').click(function () {
        console.log("save as btn clicked");
        var img = $('#img-out-preview>img');
        console.log(img);
        saveBase64AsFile(img.attr('src'), generatedFilename.toLowerCase() +".png")
    });

    function saveBase64AsFile(base64, fileName) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.setAttribute("type", "hidden");
        // link.href = "data:text/plain;base64," + base64;
        link.href = base64;
        link.download = fileName;
        link.click();
        document.body.removeChild(link);
    }

    // Shift key toggle
    $('#shift-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeyMap.delete('shift');
            prefixKeyNameMap.delete('shift');
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');
            prefixKeyMap.set('shift', 'Shift');
            prefixKeyNameMap.set('shift', 'shift');
        }
        updateKeyPreviews();
    });

    $('#ctrl-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeyMap.delete('ctrl');
            prefixKeyNameMap.delete('ctrl');
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');
            if (myOs == OS.mac) {
                prefixKeyMap.set('ctrl', '⌃ Control');
                prefixKeyNameMap.set('ctrl', 'control');
            } else if (myOs == OS.windows) {
                prefixKeyMap.set('ctrl', 'Ctrl');
                prefixKeyNameMap.set('ctrl', 'ctrl');
            }   else {
                prefixKeyMap.set('ctrl', 'ctrl');
                prefixKeyNameMap.set('ctrl', 'ctrl');
            }
        }
        updateKeyPreviews();
    });

    $('#alt-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeyMap.delete('alt');
            prefixKeyNameMap.delete('alt');
            
            prefixKeyMap.delete('option');
            prefixKeyNameMap.delete('option');
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');
            // todo add to prefix
            if (myOs == OS.mac) {
                prefixKeyMap.set('option', '⌥ Option');
                prefixKeyNameMap.set('option', 'option');
            } else if (myOs == OS.windows) {
                prefixKeyMap.set('alt', 'Alt');
                prefixKeyNameMap.set('alt', 'alt');
            }   else {
                prefixKeyMap.set('alt', 'alt');
                prefixKeyNameMap.set('alt', 'alt');
            }
        }
        updateKeyPreviews();
    });

    $('#meta-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeyMap.delete('meta');
            prefixKeyNameMap.delete('meta');
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');

            if (myOs == OS.mac) {
                prefixKeyMap.set('meta', '⌘ Cmd');
                prefixKeyNameMap.set('meta', 'cmd');
            } else if (myOs == OS.windows) {
                prefixKeyMap.set('meta', '⊞ Win');
                prefixKeyNameMap.set('meta', 'win');
            } else {
                prefixKeyMap.set('meta', 'Meta');
                prefixKeyNameMap.set('meta', 'Meta');
            }
        }

        updateKeyPreviews()
    });

    function updateKeyPreviews() {
        let prefixKeysHtml = '';
        let prefixKeys = '';
        prefixKeyMap.forEach((value)=> {
            prefixKeys += value +'+';
            prefixKeysHtml += '<kbd>'+value+'</kbd>+';
        });
        $('#kb-input').val(prefixKeys);
        $('#output-location').html(prefixKeysHtml);
    }

    $('body').keyup(function (e) {
        if (isTextInputMode) {
            // allow user to input any text
            var userText = $('#user-text-input').val();
            console.log("userText="+userText);
            
            // remove all spaces
            // userText = userText.replaceAll(" ", "")

            // split by +
            var splitKeys = userText.split("+")

            var kbString = '';
            var kbHtmlString = '';
            for (var i=0; i<splitKeys.length; i++) {
                if (splitKeys[i].indexOf(',') != -1) {
                    var commaSplits = splitKeys[i].split(',');
                    for(var j=0; j<commaSplits.length;j++) {
                        kbString += commaSplits[j];
                        kbHtmlString += '<kbd>'+commaSplits[j]+'</kbd>';

                        if (j == commaSplits.length - 1) {
                            // last one - no need to add +
                        } else {
                            kbString += ' , ';
                            kbHtmlString += ',';
                        }
                    }
                } else {
                    kbString += splitKeys[i];
                    kbHtmlString += '<kbd>'+splitKeys[i]+'</kbd>';
    
                    if (i == splitKeys.length - 1) {
                        // last one - no need to add +
                    } else {
                        kbString += ' + ';
                        kbHtmlString += '+';
                    }
                }
            }

            $('#output-location').html(kbHtmlString);
            return;
        }
    });

    $('body').keydown(function (e) {
        if (isTextInputMode) {
            // // allow user to input any text
            // var userText = $('#user-text-input').val();
            // console.log("userText="+userText);
            
            // // remove all spaces
            // userText = userText.replaceAll(" ", "")

            // // split by +
            // var splitKeys = userText.split("+")

            // var kbString = '';
            // var kbHtmlString = '';
            // for (var i=0; i<splitKeys.length; i++) {
            //     kbString += splitKeys[i] + ' + ';
            //     kbHtmlString += '<kbd>'+splitKeys[i]+'</kbd>+';
            // }

            // $('#output-location').html(kbHtmlString);
            return;
        }
        const id = 'k'+e.keyCode;
        console.log('down = ' + keyMap[id]+ ", keycode = "+e.keyCode);

        let prefixKeysHtml = '';
        let prefixKeys = '';
        prefixKeyMap.forEach((value)=> {
            prefixKeys += value +'+';
            prefixKeysHtml += '<kbd>'+value+'</kbd>+';
        });

        let prefixKeysName = '';
        prefixKeyNameMap.forEach((key,value)=> {
            prefixKeysName += value +'_';
        });

        generatedFilename = 'kbs_' + prefixKeysName;

        var kbString = prefixKeys + '';
        var kbHtmlString = prefixKeysHtml + '';

        if (e.ctrlKey) {
            if (myOs == OS.mac) {
                kbString += '⌃ Control + ';
                kbHtmlString += '<kbd>⌃ Control</kbd>+';
                generatedFilename += 'control_';
            } else if (myOs == OS.windows) {
                kbString += 'Ctrl + ';
                kbHtmlString += '<kbd>Ctrl</kbd>+';
                generatedFilename += 'ctrl_';
            } else {
                kbString += 'Ctrl + ';
                kbHtmlString += '<kbd>Ctrl</kbd>+';
                generatedFilename += 'ctrl_';
            }
        }

        if(e.altKey){
            if (myOs == OS.mac) {
                kbString += '⌥ Option + ';
                kbHtmlString += '<kbd>⌥ Option</kbd>+';
                generatedFilename += 'option_';
            } else if (myOs == OS.windows) {
                kbString += 'Alt + ';
                kbHtmlString += '<kbd>Alt</kbd>+';
                generatedFilename += 'alt_';
            } else {
                kbString += 'Alt + ';
                kbHtmlString += '<kbd>Alt</kbd>+';
                generatedFilename += 'alt_';
            }
        }

        if (e.shiftKey) {
            kbString += 'Shift + ';
            kbHtmlString += '<kbd>Shift</kbd>+';
            generatedFilename += 'shift_';
        }

        if (e.metaKey) {
            if (myOs == OS.mac) {
                kbString += '⌘ Cmd + ';
                kbHtmlString += '<kbd>⌘ Cmd</kbd>+';
                generatedFilename += 'cmd_';
            } else if (myOs == OS.windows) {
                kbString += '⊞ Win + ';
                kbHtmlString += '<kbd>⊞ Win</kbd>+';
                generatedFilename += 'win_';
            } else {
                kbString += 'Meta + ';
                kbHtmlString += '<kbd>Meta</kbd>+';
                generatedFilename += 'meta_';
            }
        }

        if (e.key != 'Control' && e.key != 'Shift' && e.key != 'Alt' && e.key != 'Meta') {
            kbString += e.key;
            console.log(e.key);
            if (keyMap[id] != undefined) {
                kbHtmlString += '<kbd>' + keyMap[id] + '</kbd>';
                generatedFilename += ''+keyMap[id];
            } else {
                kbHtmlString += '<kbd>' + e.key + '</kbd>';
                generatedFilename += ''+e.key;
            }
        }

        $('#kb-input').val(kbString);
        $('#output-location').html(kbHtmlString);
        
        e.preventDefault();
        e.stopPropagation();
    });

});

