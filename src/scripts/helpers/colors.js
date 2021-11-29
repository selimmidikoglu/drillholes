


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

export default whichColor;