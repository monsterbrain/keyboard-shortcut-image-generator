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



    $('body').keydown(function (e) {
        const id = 'k'+e.keyCode;
        console.log('down = ' + keyMap[id]);

        var kbString = '';

        if (e.ctrlKey) {
            kbString += 'Ctrl + ';
        }

        if(e.altKey){
            kbString += 'Alt + ';
        }

        if (e.shiftKey) {
            kbString += 'Shift + ';
        }

        if (e.key != 'Control' && e.key != 'Shift' && e.key != 'Alt')
            kbString += e.key;

        $('#kb-input').val(kbString);
        e.preventDefault();
        e.stopPropagation();
    });

});

