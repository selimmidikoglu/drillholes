


var whichColor = (rmr) => {
    var colorScale = [
        "0x331238",
        "0x486AE4",
        "0x26BCE5",
        "0x32F39A",
        "0xA0FF42",
        "0xF0D13A",
        "0xFC8125",
        "0xD23306",
        "0x7B0505"
    
    ];
    var index1 = Math.ceil(rmr / 0.100)
    return colorScale[index1];
}
var mixHexColors = (color1, color2) => {
    const valuesColor1 = color1.replace('0x', '').match(/.{2}/g).map((value) =>
        parseInt(value, 16)
    )
    const valuesColor2 = color2.replace('#', '').match(/.{2}/g).map((value) =>
        parseInt(value, 16)
    )
    const mixedValues = valuesColor1.map((value, index) =>
        ((value + valuesColor2[index]) / 2).toString(16).padStart(2, '')
    )
    return `#${mixedValues.join('')}` 
}

export default whichColor;