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
        $metaKey.removeClass('cmd');
        $metaKey.removeClass('win');
        $metaKey.removeClass('meta');

        if (myOs == OS.mac) {
            $metaKey.addClass('cmd');
        } else if (myOs == OS.windows) {
            $metaKey.addClass('win');
        } else {
            $metaKey.addClass('meta');
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

    $('#generate-img-btn').click(function () {
      var e = document.getElementById("output-location");
      var e_width = e.offsetWidth;
      var e_height = e.offsetHeight;
      var e_x_offset = window.scrollX + e.getBoundingClientRect().left;
      var e_y_offset = window.scrollY + e.getBoundingClientRect().top;

      html2canvas(e, {
        scale: 1,
        backgroundColor: null,
        width: e_width,
        height: e_height,
        x: e_x_offset,
        y: e_y_offset }).then(canvas => {
            //document.body.appendChild(canvas)
            $('#img-preview-div').show();
            var base64image = canvas.toDataURL("image/png");
            let $imgDiv = $('<img src="' + base64image + '"/>');
            $('#img-out-preview').empty();
            $('#img-out-preview').append($imgDiv);
            // var win = window.open('', "_blank");
            // win.document.write('<img src="' + base64image + '"/>');
            // win.document.close();
        });
    });

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
            prefixKeyMap.set('shift', 'shift');
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
            prefixKeyMap.set('ctrl', 'ctrl');
            prefixKeyNameMap.set('ctrl', 'ctrl');
        }
        updateKeyPreviews();
    });

    $('#alt-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeyMap.delete('alt');
            prefixKeyNameMap.delete('alt');
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');
            // todo add to prefix
            prefixKeyMap.set('alt', 'alt');
            prefixKeyNameMap.set('alt', 'alt');
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
            kbString += 'Ctrl + ';
            kbHtmlString += '<kbd>Ctrl</kbd>+';
            generatedFilename += 'ctrl_';
        }

        if(e.altKey){
            kbString += 'Alt + ';
            kbHtmlString += '<kbd>Alt</kbd>+';
            generatedFilename += 'alt_';
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

