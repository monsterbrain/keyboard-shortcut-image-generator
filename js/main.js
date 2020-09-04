let OS = {windows:"windows", mac:"mac",other:"other"}
var myOs = OS.windows; // default

var prefixKeys = "";
var prefixKeysHtml = "";

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

    function setCustomOS(newOs) {
        myOs = newOs;
        $(":radio").prop("checked", false); // clear previous os selections
        $("input[name="+myOs+"]:radio").prop("checked", true);

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

    $('#save-btn').click(function () {
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

    $('#meta-toggle').click((e)=>{
        if ($(e.currentTarget).hasClass('keyboard-keydown')) {
            $(e.currentTarget).removeClass('keyboard-keydown');
            prefixKeys = '';
            prefixKeysHtml = '';
        } else {
            $(e.currentTarget).addClass('keyboard-keydown');

            if (myOs == OS.mac) {
                prefixKeys = '⌘ Cmd + ';
                prefixKeysHtml = '<kbd>⌘ Cmd</kbd>+';
            } else if (myOs == OS.windows) {
                prefixKeys = '⊞ Win + ';
                prefixKeysHtml = '<kbd>⊞ Win</kbd>+';
            } else {
                prefixKeys = 'Meta + ';
                prefixKeysHtml = '<kbd>Meta</kbd>+';
            }
        }

        $('#kb-input').val(prefixKeys);
        $('#output-location').html(prefixKeysHtml);
    });

    $('body').keydown(function (e) {
        const id = 'k'+e.keyCode;
        console.log('down = ' + keyMap[id]+ ", keycode = "+e.keyCode);

        var kbString = prefixKeys + '';
        var kbHtmlString = prefixKeysHtml + '';

        if (e.ctrlKey) {
            kbString += 'Ctrl + ';
            kbHtmlString += '<kbd>Ctrl</kbd>+';
        }

        if(e.altKey){
            kbString += 'Alt + ';
            kbHtmlString += '<kbd>Alt</kbd>+';
        }

        if (e.shiftKey) {
            kbString += 'Shift + ';
            kbHtmlString += '<kbd>Shift</kbd>+';
        }

        if (e.metaKey) {
            if (myOs == OS.mac) {
                kbString += '⌘ Cmd + ';
                kbHtmlString += '<kbd>⌘ Cmd</kbd>+';
            } else if (myOs == OS.windows) {
                kbString += '⊞ Win + ';
                kbHtmlString += '<kbd>⊞ Win</kbd>+';
            } else {
                kbString += 'Meta + ';
                kbHtmlString += '<kbd>Meta</kbd>+';
            }
        }

        if (e.key != 'Control' && e.key != 'Shift' && e.key != 'Alt' && e.key != 'Meta') {
            kbString += e.key;
            console.log(e.key);
            if (keyMap[id] != undefined) {
                kbHtmlString += '<kbd>' + keyMap[id] + '</kbd>';    
            } else {
                kbHtmlString += '<kbd>' + e.key + '</kbd>';
            }
        }

        $('#kb-input').val(kbString);
        $('#output-location').html(kbHtmlString);
        
        e.preventDefault();
        e.stopPropagation();
    });

});

