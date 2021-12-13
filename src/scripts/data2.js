var data = [
    // [
    //     "HOLE_NUMBER",
    //     "X",
    //     "Y",
    //     "Z",
    //     "Recovery_Value",
    //     "Recovery_perc",
    //     "RQD_Value",
    //     "Rqd_perc",
    //     "RMR_value"
    // ],
    [
        "BDD-1001",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0.000"
    ],
    [
        "BDD-1001",
        "-2.478067976",
        "-1.040157406",
        "-9.632094875",
        "7.3",
        "0.73",
        "5.2",
        "0.52",
        "0.303"
    ],
    [
        "BDD-1001",
        "-5.089094135",
        "-2.046621566",
        "-19.23259342",
        "8.5",
        "0.85",
        "7.5",
        "0.75",
        "0.466"
    ],
    [
        "BDD-1001",
        "-7.695944007",
        "-3.104623569",
        "-28.82868458",
        "10",
        "1",
        "8.5",
        "0.85",
        "0.054"
    ],
    [
        "BDD-1001",
        "-10.30721042",
        "-4.195869126",
        "-38.41985087",
        "5.5",
        "0.55",
        "4.5",
        "0.45",
        "0.218"
    ],
   
  
    
]

//"HOLE_NUMBER",
//     "X",
//     "Y",
//     "Z",
//     "Recovery_Value",
//     "Recovery_perc",
//     "RQD_Value",
//     "Rqd_perc",
//     "RMR_value"

var a = data.map(el => {
    var b = {};
    b.HOLE_NUMBER = el[0];
    b.x = parseFloat(el[1]);
    b.y = parseFloat(el[2]);
    b.z = parseFloat(el[3]);
    b.rmr = parseFloat(el[8]);
    b.Recovery_Value = el[4];
    b.Recovery_perc = el[5];
    b.RQD_Value = el[6];
    b.Rqd_perc = el[7];
    b.RMR_value = el[8];
    return b;
})
export const drillNames = () => {

    var drillholesNames = [];
    for (let i = 0; i < data.length; i++) {
        const el = data[i];

        if (!drillholesNames.includes(el[0])) {
            drillholesNames.push()
            console.log(drillholesNames)
        }
    }
    console.log(drillholesNames)
    return drillholesNames;
}
export default a;

