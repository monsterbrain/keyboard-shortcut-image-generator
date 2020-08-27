$('document').ready(function () {
    const keyMap = {
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
        	var base64image = canvas.toDataURL("image/png");
          var win = window.open('', "_blank");
          win.document.write('<img src="' + base64image + '"/>');
          win.document.close();
      });
    });

    $('body').keydown(function (e) {
        const id = 'k'+e.keyCode;
        console.log('down = ' + keyMap[id]);

        var kbString = '';
        var kbHtmlString = '';

        if (e.ctrlKey) {
            kbString += 'Ctrl + ';
            kbHtmlString += '<kbd>Ctrl</kbd>-';
        }

        if(e.altKey){
            kbString += 'Alt + ';
            kbHtmlString += '<kbd>Alt</kbd>-';
        }

        if (e.shiftKey) {
            kbString += 'Shift + ';
            kbHtmlString += '<kbd>Shift</kbd>-';
        }

        if (e.key != 'Control' && e.key != 'Shift' && e.key != 'Alt') {
            kbString += e.key;
            kbHtmlString += '<kbd>' + e.key + '</kbd>';
        }

        $('#kb-input').val(kbString);
        $('#output-location').html(kbHtmlString);
        
        e.preventDefault();
        e.stopPropagation();
    });

});

